const express = require("express");
const fs = require("fs");
const Joi = require("joi");
const cors = require("cors");
const path = require("path");

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
  img_name: Joi.string().min(5).required(),
  date: Joi.string().regex(/^\d{4}$/).required(), // Year format: YYYY
  description: Joi.string().min(10).required(),
  details: Joi.array().items(Joi.string().min(3)).required(),
  location: Joi.string().min(3).required(),
  attendees: Joi.number().integer().min(1).required(),
  theme: Joi.string().min(3).required(),
  organizer: Joi.string().min(3).required(),
});

// Route to get all events
app.get("/api/events", (req, res) => {
    try {
      const events = readEvents(); // Read events from the JSON file
      console.log("Sending events:", events); // Debug log
      res.json(events); // Send JSON response
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Error fetching events" }); // Send error response
    }
  });

// Route to add a new event
app.post("/api/events", (req, res) => {
    const { error } = eventSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details: error.details.map((err) => err.message),
      });
    }

  // Read current events
  const events = readEvents();

  // Add the new event with a unique ID
  const newEvent = { _id: events.length + 1, ...req.body };
  events.push(newEvent);

  // Write updated events back to the JSON file
  writeEvents(events);

  // Send a proper JSON response
  res.status(201).json({
    success: true,
    message: "Event added successfully!",
    data: newEvent,
  });
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
