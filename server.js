const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
const multer = require("multer");
const path = require("path");

app.use(express.static("public"));
app.use("/uploads", express.static("uploads")); // Serve uploaded images
app.use(express.json());
app.use(cors());

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/"); // Directory to store uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to avoid file name collisions
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"));
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
});

// Dummy data for houses
let houses = [
  {
    _id: 1,
    name: "Farmhouse",
    size: 2000,
    bedrooms: 3,
    bathrooms: 2.5,
    main_image: "images/farm.webp",
  },
  {
    _id: 2,
    name: "Mountain House",
    size: 1700,
    bedrooms: 3,
    bathrooms: 2,
    main_image: "images/mountain-house.webp",
  },
  {
    _id: 3,
    name: "Lake House",
    size: 3000,
    bedrooms: 4,
    bathrooms: 3,
    main_image: "images/lake-house.webp",
  },
];

// GET all houses
app.get("/api/houses", (req, res) => {
  res.status(200).json(houses);
});

// POST a new house with image upload
app.post("/api/houses", upload.single("img"), (req, res) => {
  const { error } = validateHouse(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const house = {
    _id: houses.length + 1,
    name: req.body.name,
    size: parseInt(req.body.size, 10),
    bedrooms: parseInt(req.body.bedrooms, 10),
    bathrooms: parseFloat(req.body.bathrooms),
    main_image: req.file ? "images/" + req.file.filename : null,
  };

  houses.push(house);
  res.status(201).json({ success: true, message: "House added successfully!", data: house });
});

// PUT (update) a house with optional image upload
app.put("/api/houses/:id", upload.single("img"), (req, res) => {
  const house = houses.find((h) => h._id === parseInt(req.params.id, 10));
  if (!house) {
    return res.status(404).json({ success: false, message: "House not found" });
  }

  const { error } = validateHouse(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  house.name = req.body.name;
  house.size = parseInt(req.body.size, 10);
  house.bedrooms = parseInt(req.body.bedrooms, 10);
  house.bathrooms = parseFloat(req.body.bathrooms);
  if (req.file) {
    house.main_image = "images/" + req.file.filename;
  }

  res.status(200).json({ success: true, message: "House updated successfully!", data: house });
});

// DELETE a house
app.delete("/api/houses/:id", (req, res) => {
  const houseIndex = houses.findIndex((h) => h._id === parseInt(req.params.id, 10));
  if (houseIndex === -1) {
    return res.status(404).json({ success: false, message: "House not found" });
  }

  const deletedHouse = houses.splice(houseIndex, 1);
  res.status(200).json({ success: true, message: "House deleted successfully!", data: deletedHouse });
});

// Validation schema for house data
const validateHouse = (house) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    size: Joi.number().required(),
    bedrooms: Joi.number().required(),
    bathrooms: Joi.number().required(),
  });

  return schema.validate(house);
};

// Error handling middleware for file uploads
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
  next();
});

// Start the server
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
