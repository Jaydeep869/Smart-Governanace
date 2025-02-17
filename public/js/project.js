async function loadProjects() {
    const projectsList = document.getElementById('projects-list');
    if (!projectsList) {
      console.error('Element with id "projects-list" not found!');
      return;
    }
  
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const projects = await response.json();
  
      let html = '';
      let i=1;
      projects.forEach(project => {
        html += `
          <div class="project-card, project-no-${i}">
            <h3>${project.title}</h3>
            <p>Status: ${project.status}</p>
            <p>Budget: ₹${project.budget}</p>
          </div>
        `;
        i+=1;
      });
      projectsList.innerHTML = html;
    } catch (error) {
      console.error('Failed to load projects:', error);
      projectsList.innerHTML = '<p>Failed to load projects. Please try again later.</p>';
    }
  }
  
  window.onload = loadProjects;