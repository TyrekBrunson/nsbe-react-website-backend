const express = require("express");
const fs = require("fs");
const Joi = require("joi");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Path to the events JSON file
const eventsFilePath = path.resolve(__dirname, "./events.json");

// Function to read events from the JSON file
const readEvents = () => {
  try {
    const data = fs.readFileSync(eventsFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading events.json:", error.message);
    return [];
  }
};

// Function to write data to the JSON file
const writeEvents = (data) => {
  try {
    fs.writeFileSync(eventsFilePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to events.json:", error.message);
    // Backup logic
    fs.writeFileSync(
      `${eventsFilePath}.backup`,
      JSON.stringify(data, null, 2),
      "utf-8"
    );
  }
};

// Joi schema for event validation
const eventSchema = Joi.object({
  event: Joi.string().min(3).required(),
  img_name: Joi.string().optional(),
  date: Joi.string().regex(/^\d{4}$/).required(),
  description: Joi.string().min(10).required(),
  details: Joi.array().items(Joi.string().min(3)).required(),
  location: Joi.string().min(3).required(),
  attendees: Joi.number().integer().min(0).required(),
  theme: Joi.string().min(3).required(),
  organizer: Joi.string().min(3).required(),
});

// Get all events
app.get("/api/events", (req, res) => {
  try {
    const events = readEvents();
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).json({ success: false, message: "Error fetching events." });
  }
});

// Add a new event
app.post("/api/events", (req, res) => {
  try {
    console.log("Incoming data:", req.body);

    const { error } = eventSchema.validate(req.body);
    if (error) {
      console.error("Validation error:", error.details);
      return res.status(400).json({
        success: false,
        message: "Validation error.",
        details: error.details.map((err) => err.message),
      });
    }

    const events = readEvents();
    const newEvent = { _id: events.length + 1, ...req.body };
    events.push(newEvent);

    writeEvents(events);

    res.status(201).json({
      success: true,
      message: "Event added successfully!",
      data: newEvent,
    });
  } catch (error) {
    console.error("Error adding event:", error.message);
    res.status(500).json({ success: false, message: "Error adding event." });
  }
});

// Multer configuration for image uploads
const upload = multer({
  dest: path.resolve(__dirname, "public/images"),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and GIF images are allowed."));
    }
  },
});

// Upload an image
app.post("/api/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded.");
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully!",
      imagePath: `/images/${req.file.filename}`,
    });
  } catch (error) {
    console.error("Error uploading image:", error.message);
    res
      .status(400)
      .json({ success: false, message: error.message || "Upload failed." });
  }
});

// Delete an event by ID
app.delete("/api/events/:id", (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const events = readEvents();
    const updatedEvents = events.filter((event) => event._id !== eventId);

    if (updatedEvents.length === events.length) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    writeEvents(updatedEvents);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting event:", error.message);
    res.status(500).json({ success: false, message: "Error deleting event." });
  }
});

// Serve static files
app.use(express.static(path.resolve(__dirname, "public")));

// Catch-all route for React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
