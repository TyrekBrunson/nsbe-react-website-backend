const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Event data array
const events = [
    {
        "_id": 1,
        "event": "NSBE Innovators Summit 2023",
        "img_name": "nesbemeeting2.jpg",
        "date": "2023",
        "description": "The NSBE Innovators Summit 2023 brought together engineers, innovators, and industry leaders to explore the latest trends in technology and engineering.",
        "details": ["Keynote Speakers", "Workshops", "Networking"],
        "location": "Atlanta, GA",
        "attendees": 500,
        "theme": "Innovation in Technology",
        "organizer": "National Society of Black Engineers"
    },
    {
        "_id": 2,
        "event": "NSBE Visionaries Conference 2022",
        "img_name": "nesbeemeeting3.jpg",
        "date": "2022",
        "description": "The NSBE Visionaries Conference 2022 focused on future innovations and advancements in STEM.",
        "details": ["Interactive Sessions", "Diversity Discussions", "New Technologies"],
        "location": "San Francisco, CA",
        "attendees": 600,
        "theme": "Future of STEM",
        "organizer": "National Society of Black Engineers"
    },
    {
        "_id": 3,
        "event": "NSBE Pioneers Gathering 2021",
        "img_name": "nesbemeeting4.jpg",
        "date": "2021",
        "description": "The NSBE Pioneers Gathering 2021 celebrated the achievements of Black engineers and explored groundbreaking projects.",
        "details": ["Design Workshops", "24 New Technology concepts", "Proof of Concepts"],
        "location": "South Carolina, SA",
        "attendees": 400,
        "theme": "Pioneers Gathering",
        "organizer": "National Society of Black Engineers"
    }
];

// Set JSON spaces for pretty-printing
app.set("json spaces", 2);

// Serve the index.html file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API route to get all events
app.get("/api/events", (req, res) => {
    res.json(events); // Respond with JSON data
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
