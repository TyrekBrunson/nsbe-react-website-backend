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
const eventsFilePath = "./events.json";

// Function to read events from the JSON file
const readEvents = () => {
  try {
    const data = fs.readFileSync(eventsFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading events.json:", error);
    return [];
  }
};

// Function to write data to the JSON file
const writeEvents = (data) => {
  try {
    fs.writeFileSync(eventsFilePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to events.json:", error);
  }
};

// Joi schema for validation
const eventSchema = Joi.object({
  event: Joi.string().min(3).required(),
  img_name: Joi.string().optional(),
  date: Joi.string().pattern(/^\d{4}$/).required(), // Year format (YYYY)
  description: Joi.string().min(10).required(),
  details: Joi.array().items(Joi.string().min(3)).required(), // Array of strings
  location: Joi.string().min(3).required(),
  attendees: Joi.number().integer().min(0).required(),
  theme: Joi.string().min(3).required(),
  organizer: Joi.string().min(3).required(),
});

// Middleware for logging and error handling
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

// Route to get all events
app.get("/api/events", (req, res) => {
  try {
    const events = readEvents();
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
});

// Route to add a new event
app.post("/api/events", (req, res) => {
  console.log("Incoming data:", req.body);

  const { error } = eventSchema.validate(req.body);
  if (error) {
    console.error("Validation error:", error.details);
    return res.status(400).json({
      success: false,
      message: "Validation error",
      details: error.details.map((err) => err.message),
    });
  }

  const events = readEvents();

  // Add the new event with a unique ID
  const newEvent = { _id: events.length + 1, ...req.body };
  events.push(newEvent);

  writeEvents(events);

  res.status(201).json({
    success: true,
    message: "Event added successfully!",
    data: newEvent,
  });
});

// Configure multer for storing uploaded images
const upload = multer({
  dest: "public/images",
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"));
    }
  },
});

// Route for uploading an image
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  res.status(200).json({
    success: true,
    message: "Image uploaded successfully!",
    imagePath: `/images/${req.file.filename}`,
  });
});

// Route for deleting an event by ID
app.delete("/api/events/:id", (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  const events = readEvents();

  const updatedEvents = events.filter((event) => event._id !== eventId);

  if (updatedEvents.length === events.length) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }

  writeEvents(updatedEvents);

  res.status(200).json({ success: true, message: "Event deleted successfully!" });
});

// Serve static files (React app)
app.use(express.static("public"));

// Catch-all route to serve React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "An internal server error occurred." });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
