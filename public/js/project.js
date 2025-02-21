
// Load projects from the server and render them in the DOM
async function loadProjects() {
  const projectsList = document.getElementById('projects-list');// getting the projectslist from the DOM using its id where we will render the projects
  if (!projectsList) return;// if the projectslist is not found then return

  try {
      const response = await fetch('/api/projects');// fetching the projects from the server
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);// if the response is not ok then throw an error
      const projects = await response.json();// if the response is ok then parse the response as json

      let inside_content = '';// initializing an empty string to store the projects
      // loop through the projects and create a card for each project
      projects.forEach((project, i) => {
        inside_content += `
        <div class="project-card project-no-${i + 1}" 
              data-status="${project.status.toLowerCase()}"
         data-type="${project.project_type.toLowerCase()}"
         data-percentage="${project.percent_completed}">
        <div class="card-header">
            <h3>${project.project_name}</h3>
            <span class="percentage ${project.percent_completed == 100 ? 'completed' : ''}">${project.percent_completed}%</span>
        </div>
        <div class="progress-container">
            <div class="progress-bar ${project.percent_completed == 100 ? 'completed' : ''}" 
                 style="width: ${project.percent_completed}%">
            </div>
        </div>
            <div class="project-meta">
                <div class="meta-item">
                    <span class="label">Status:</span>
                    <span class="value">${project.status}</span>
                </div>
                <div class="meta-item">
                    <span class="label">Budget:</span>
                    <span class="value">₹${project.budget}</span>
                </div>
            </div>
        </div>
    `;
      });
      // Rendering the projects in the DOM
      projectsList.innerHTML = inside_content;
      
      // Initializing the filtering functionality
      Filtering();
  } catch (error) {
      console.error('Failed to load projects:', error);
      projectsList.innerHTML = '<p>Failed to load projects. Please try again later.</p>';
  }
}


// creating initializeFiltering function to filter the projects based on their status and category
function Filtering() {
  const filterButtons = document.querySelectorAll('.filter-btn');     // getting all the filter buttons
  let activeStatus = 'all';                                           // setting the default status to all
  const activeCategories = new Set();                                 // creating a set to store the active categories

  // adding click event listeners to the filter buttons
  filterButtons.forEach(button => {
      button.addEventListener('click', () => {
          const isStatusButton = button.classList.contains('status-btn');           // checking if the button is a status button
          const filterValue = button.dataset.status || button.dataset.category;     // getting the filter value
          
          if (isStatusButton) {
              // handling status filter
              activeStatus = filterValue;
              filterButtons.forEach(b => b.classList.remove('active'));
              button.classList.add('active');
          } else {
              // handling category filter
              button.classList.toggle('active');
              if (activeCategories.has(filterValue)) {
                  activeCategories.delete(filterValue);
              } else {
                  activeCategories.add(filterValue);
              }
          }

          // calling the filterProjects function to filter the projects based on the active status and categories
          filterProjects(activeStatus, activeCategories);
      });
  });
}

// creating filterProjects function to filter the projects based on the status and categories
function filterProjects(statusFilter, categoryFilters) {
  const cards = document.querySelectorAll('.project-card');              
  
  cards.forEach(card => {
      const cardStatus = card.dataset.status;
      const cardType = card.dataset.type;
      
      const statusMatch = statusFilter === 'all' || cardStatus === statusFilter;
      const categoryMatch = categoryFilters.size === 0 || categoryFilters.has(cardType);
      
      card.style.display = (statusMatch && categoryMatch) ? 'block' : 'none';
  });
  
}

// Load projects when the page is loaded
window.onload = loadProjects;


// Add event listener to the suggestion form
document.addEventListener('DOMContentLoaded', () => {
    const suggestionForm = document.getElementById('suggestionForm');
  
    suggestionForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      // geting values from the form fields
      const projectName = document.getElementById('project-name').value;
      const suggestion = document.getElementById('suggestion').value;
      const email = document.getElementById('email').value;
  
      // preparing the payload using keys expected by the backend
      const payload = {
        project_name: projectName,
        suggestion: suggestion,
        email: email,
      };
  
      // sending the suggestion to the server
      try {
        const response = await fetch('/api/suggestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }
  
        const result = await response.json();
        alert('Suggestion submitted successfully!');
        suggestionForm.reset();
      } catch (error) {
        console.error('Error submitting suggestion:', error);
        alert('Failed to submit suggestion. Please try again later.');
      }
    });
  });


const varanasiCoordinates = [25.3176, 82.9739];   // setting the coordinates of Varanasi

// Initializing the map and set its view to Varanasi
const map = L.map('map').setView(varanasiCoordinates, 13);

// Adding OpenStreetMap tiles to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

