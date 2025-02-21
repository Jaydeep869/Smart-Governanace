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

  