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

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/"); // Directory for uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"));
    }
  },
});

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

// Joi schema for event validation
const eventSchema = Joi.object({
  event: Joi.string().min(3).required(),
  img_name: Joi.string().optional(), // Optional for no image uploads
  date: Joi.string().regex(/^\d{4}$/).required(),
  description: Joi.string().min(10).required(),
  details: Joi.array().items(Joi.string().min(3)).required(),
  location: Joi.string().min(3).required(),
  attendees: Joi.number().integer().min(0).required(),
  theme: Joi.string().min(3).required(),
  organizer: Joi.string().min(3).required(),
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

// Route to add a new event with optional image upload
app.post("/api/events", upload.single("image"), (req, res) => {
  console.log("Incoming data:", req.body);

  const img_name = req.file ? `/images/${req.file.filename}` : req.body.img_name || "";

  const eventData = {
    ...req.body,
    img_name,
    details: req.body.details ? req.body.details.split(",").map((d) => d.trim()) : [],
    attendees: parseInt(req.body.attendees, 10),
  };

  const { error } = eventSchema.validate(eventData);
  if (error) {
    console.error("Validation error:", error.details);
    return res.status(400).json({
      success: false,
      message: "Validation error",
      details: error.details.map((err) => err.message),
    });
  }

  const events = readEvents();
  const newEvent = { _id: events.length + 1, ...eventData };
  events.push(newEvent);

  writeEvents(events);

  res.status(201).json({
    success: true,
    message: "Event added successfully!",
    data: newEvent,
  });
});

// Route for deleting an event by ID
app.delete("/api/events/:id", (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  const events = readEvents();
  const updatedEvents = events.filter((event) => event._id !== eventId);

  if (updatedEvents.length === events.length) {
    return res.status(404).json({ success: false, message:
