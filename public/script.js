document.addEventListener("DOMContentLoaded", () => {
  const eventsContainer = document.getElementById("events-container");
  const allEventsLink = document.getElementById("all-events-link");

  // Fetch events on "All Events" link click
  allEventsLink.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/events");
      const events = await response.json();

      eventsContainer.innerHTML = ""; // Clear previous content

      // Display each event as a card
      events.forEach((event) => {
        const eventCard = document.createElement("div");
        eventCard.classList.add("event-card");
        eventCard.innerHTML = `
          <h2>${event.event}</h2>
          <p><strong>Date:</strong> ${event.date}</p>
          <p><strong>Location:</strong> ${event.location}</p>
          <p><strong>Theme:</strong> ${event.theme}</p>
          <p>${event.description}</p>
          <ul>${event.details.map(detail => `<li>${detail}</li>`).join('')}</ul>
        `;
        eventsContainer.appendChild(eventCard);
      });
    } catch (error) {
      console.error("Error fetching events:", error);
      eventsContainer.innerHTML = "<p>Error loading events</p>";
    }
  });
});
