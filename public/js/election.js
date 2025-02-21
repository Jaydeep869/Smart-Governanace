document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = createLoadingOverlay();
    document.body.appendChild(loadingOverlay);

    // Fetch election data from the server
    fetch('/api/elections')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            ['national', 'state', 'municipal', 'panchayat'].forEach(tier => {
                populateSection(tier, data[tier] || {});
            });
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorToast('Failed to load election data. Please try again later.');
        })
        .finally(() => {
            loadingOverlay.remove();
        });
});

/**
 * Populates a given election tier section.
 * If completed election data exists, it displays completed candidate cards (with badges).
 * Otherwise, if upcoming data exists, it shows upcoming candidate cards.
 */
function populateSection(tier, { completed = [], upcoming = [] }) {
    const completedContainer = document.getElementById(`${tier}-completed-cards`);
    const upcomingContainer = document.getElementById(`${tier}-upcoming-cards`);
    const completedSection = document.getElementById(`${tier}-completed`);
    const upcomingSection = document.getElementById(`${tier}-upcoming`);

    // Clear existing content
    [completedContainer, upcomingContainer].forEach(container => {
        if (container) container.innerHTML = '';
    });

    // Handle completed elections
    if (completed.length > 0) {
        completed.forEach(candidate => {
            completedContainer.appendChild(createCandidateCard(candidate, 'completed'));
        });
        upcomingSection?.classList.add('hidden');
    } else {
        completedSection?.classList.add('hidden');
    }

    // Handle upcoming elections (only shown if no completed data exists)
    if (upcoming.length > 0 && completed.length === 0) {
        upcoming.forEach(candidate => {
            upcomingContainer.appendChild(createCandidateCard(candidate, 'upcoming'));
        });
    } else {
        upcomingSection?.classList.add('hidden');
    }

    // (Optional) Show an empty state if neither completed nor upcoming data exist.
    if (completed.length === 0 && upcoming.length === 0) {
        const container = completedSection || upcomingSection;
        if (container) {
            container.innerHTML = `<div class="empty-state">No election data available</div>`;
        }
    }
}

/**
 * Creates an HTML card element with candidate details.
 * For completed elections, displays a badge:
 *   - Green "Winner" badge if candidate.result is "won"
 *   - Neutral "Not Winner" badge if candidate.result is "lost"
 * For upcoming elections, no badge is displayed.
 */
function createCandidateCard(candidate, status) {
    const card = document.createElement('div');
    card.className = `election-card ${status} party-${candidate.candidate_party.toLowerCase()}`;

    let resultBadge = "";
    if (status === 'completed') {
        if (candidate.result && candidate.result.toLowerCase() === 'won') {
            resultBadge = `<div class="result-badge won">Winner</div>`;
        } else if (candidate.result && candidate.result.toLowerCase() === 'lost') {
            resultBadge = `<div class="result-badge lost">Not Winner</div>`;
        }
    }

    card.innerHTML = `
        <div class="card-header">
            <h3 class="candidate-name">${candidate.candidate_name}</h3>
            <span class="party-tag">${candidate.candidate_party}</span>
            ${resultBadge}
        </div>
        <div class="card-body">
            <div class="detail-item">
                <span class="detail-label">Age</span>
                <span class="detail-value">${candidate.age}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Party Member Since</span>
                <span class="detail-value">${new Date(candidate.party_join_date).getFullYear()}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Election Date</span>
                <span class="detail-value">${new Date(candidate.election_date).toLocaleDateString()}</span>
            </div>
            ${status === 'completed' ? `
            <div class="result-details">
                <div class="detail-item">
                    <span class="detail-label">Votes Received</span>
                    <span class="detail-value">${candidate.votes_received.toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Vote Margin</span>
                    <span class="detail-value">${candidate.margin_of_votes.toLocaleString()}</span>
                </div>
            </div>` : ''}
        </div>
    `;

    return card;
}

// Utility functions
function createLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Loading election data...</p>
    `;
    return overlay;
}

//if there is an error, show an error toast message in the UI
function showErrorToast(message) {
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 5000);
}
