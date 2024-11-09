document.addEventListener("DOMContentLoaded", function() {
    fetch('/api/events')
      .then(response => response.json())
      .then(data => {
        const container = document.getElementById('events-container');
        
        data.forEach(event => {
          const eventCard = document.createElement('div');
          eventCard.classList.add('event-card');
  
          eventCard.innerHTML = `
            <img src="${event.img_name}" alt="${event.event}">
            <h2>${event.event}</h2>
            <p><strong>Date:</strong> ${event.date}</p>
            <p>${event.description}</p>
            <div class="event-details">
              <p><strong>Location:</strong> ${event.location}</p>
              <p><strong>Attendees:</strong> ${event.attendees}</p>
              <p><strong>Theme:</strong> ${event.theme}</p>
              <p><strong>Organizer:</strong> ${event.organizer}</p>
              <p><strong>Details:</strong></p>
              <ul>
                ${event.details.map(detail => `<li>${detail}</li>`).join('')}
              </ul>
            </div>
          `;
          
          container.appendChild(eventCard);
        });
      })
      .catch(error => console.error('Error fetching event data:', error));
  });
  