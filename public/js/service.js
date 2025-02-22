//Adding filter and search functionality to the services page
document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.querySelector('.search-bar');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
  
    // Search Functionality
    searchBar.addEventListener('input', (event) => {
      const searchterm = event.target.value.toLowerCase();
  
      serviceCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.service-description').textContent.toLowerCase();
  
        if (title.includes(searchterm) || description.includes(searchterm)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  
    // Category Filtering
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.textContent.toLowerCase();
  
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
  
        // Add active class to the clicked button
        button.classList.add('active');
  
  
        serviceCards.forEach(card => {
          const cardCategory = card.classList[1]; // Get the category class
  
          if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  });
  // Hamburger Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Close menu on link click
document.querySelectorAll('.auth-btn').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

  
