document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded and DOM fully loaded");

  const eventsContainer = document.getElementById("events-container");
  const allEventsLink = document.getElementById("all-events-link");

  if (!eventsContainer || !allEventsLink) {
    console.error("Elements not found on the page");
    return;
  }

  // Fetch events on "All Events" link click
  allEventsLink.addEventListener("click", async (event) => {
    event.preventDefault();
    console.log("All Events link clicked");

    try {
      const response = await fetch("/api/events");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const events = await response.json();

      console.log("Events fetched successfully:", events);

      eventsContainer.innerHTML = ""; // Clear previous content

      // Display JSON data as a formatted string
      const pre = document.createElement("pre");
      pre.textContent = JSON.stringify(events, null, 2); // Format JSON with 2 spaces indentation
      eventsContainer.appendChild(pre);
      
    } catch (error) {
      console.error("Error fetching events:", error);
      eventsContainer.innerHTML = "<p>Error loading events</p>";
    }
  });
});
