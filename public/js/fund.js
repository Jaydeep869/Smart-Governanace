//fetching data from the server
fetch('/api/funds')
      .then(response => response.json())
      .then(data => {
        console.log("fetched");
        const tbody = document.getElementById('fundsTable').querySelector('tbody');
        tbody.innerHTML = '';
        if (data.length === 0) {
          tbody.innerHTML = '<tr><td colspan="2">No data found for District A.</td></tr>';
        } else {
          data.forEach(item => {
            const row = document.createElement('tr');
  
            const sectorCell = document.createElement('td');
            sectorCell.textContent = item.sector;
            row.appendChild(sectorCell);
  
            const amountCell = document.createElement('td');
            amountCell.textContent = item.total_amount;
            row.appendChild(amountCell);
  
            tbody.appendChild(row);
          });
        }
      })
      .catch(error => {
        console.error('Error fetching funds data:', error);
        alert('Error fetching data. Please try again later.');
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