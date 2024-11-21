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

// Set up Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/"); // Destination folder for uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with extension
  },
});

const upload = multer({ storage });

// Path to the events JSON file
const eventsFilePath = "./events.json";

// Function to read events from the JSON file
const readEvents = () => {
  try {
    const data = fs.readFileSync(eventsFilePath, "utf-8");
    return JSON.parse(data); // Parse the JSON file content
  } catch (error) {
    console.error("Error reading events.json:", error);
    return []; // Return an empty array if the file is missing or corrupted
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
  date: Joi.string().regex(/^\d{4}$/).required(),
  description: Joi.string().min(10).required(),
  details: Joi.string().required(), // Details as a comma-separated string
  location: Joi.string().min(3).required(),
  attendees: Joi.number().integer().min(0).required(),
  theme: Joi.string().min(3).required(),
  organizer: Joi.string().min(3).required(),
});

// Route to get all events
app.get("/api/events", (req, res) => {
  try {
    const events = readEvents();
    res.json(events); // Send JSON response
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
});

// Route to add a new event
app.post("/api/events", upload.single("img_name"), (req, res) => {
  try {
    const img_name = req.file ? `/images/${req.file.filename}` : req.body.img_name || "";

    const eventData = {
      ...req.body,
      img_name,
      details: req.body.details.split(",").map((d) => d.trim()), // Convert details to an array
      attendees: parseInt(req.body.attendees, 10), // Ensure attendees is an integer
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
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
