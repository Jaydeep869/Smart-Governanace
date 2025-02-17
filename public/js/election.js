async function loadelectiondata() {
    const electiondata=document.getElementById('election-data');
    if (!electiondata){
        console.error('Element with id "election-data" not found');
        return;
    }
    
    try {
        const response=await fetch('/api/elections');
        if(!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const election = await response.json();

        let html='';
        let i=1;
        election.forEach(election => {
            html+=`
            <div class="election-card, election-card-${i}">
            <h3>${election.candidate_name}</h3>
            <p>Candidate Party: ${election.candidate_party}</p>
            <p>Election Date : ₹${election.polling_booth_location}</p>
          </div>
          `;
        });
        electiondata.innerHTML=html;
    } catch (error) {
        console.error('failed to load election data: ', error);
        electiondata.innerHTML='<p>Failed to load election data. Please try again later.</p>';
    }
    
}

window.onload = loadelectiondata;