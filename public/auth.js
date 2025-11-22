let user = null;

// Handle Google Sign-In response
function handleCredentialResponse(response) {
    const idToken = response.credential;

    // Send token to backend for verification & user upsert
    fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
    })
        .then(r => r.json())
        .then(data => {
            if (data.error) throw new Error(data.error);

            user = data;

            // Update UI with user info
            document.getElementById('userName').textContent = data.name;
            document.getElementById('userAvatar').src = data.picture;

            // Hide auth section, show game
            document.getElementById('auth-section').classList.add('hidden');
            document.getElementById('game-section').classList.remove('hidden');

            // Load high scores
            loadHighScores();
        })
        .catch(err => {
            console.error('Authentication error:', err);
            alert('Authentication failed: ' + err.message);
        });
}

// Logout handler
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            user = null;

            // Reset game
            score = 0;
            snake = [{ x: 160, y: 160 }];
            dx = grid;
            dy = 0;
            document.getElementById('score').textContent = '0';

            // Hide game, show auth
            document.getElementById('game-section').classList.add('hidden');
            document.getElementById('auth-section').classList.remove('hidden');

            // Reset Google button
            if (typeof google !== 'undefined') {
                google.accounts.id.disableAutoSelect();
            }
        });
    }
});

// Load high scores from backend
function loadHighScores() {
    fetch('/api/highscores')
        .then(r => r.json())
        .then(scores => {
            const list = document.getElementById('highscores-list');
            if (scores.length === 0) {
                list.innerHTML = '<p style="text-align: center; color: #8e8ea9;">No scores yet. Be the first!</p>';
                return;
            }

            list.innerHTML = scores.map((item, index) => `
        <div class="highscore-item">
          <span class="highscore-rank">#${index + 1}</span>
          <span class="highscore-name">${item.name}</span>
          <span class="highscore-score">${item.score}</span>
          <span class="highscore-date">${new Date(item.played_at).toLocaleDateString()}</span>
        </div>
      `).join('');
        })
        .catch(err => {
            console.error('Failed to load high scores:', err);
            document.getElementById('highscores-list').innerHTML = '<p style="text-align: center; color: #f5576c;">Failed to load scores</p>';
        });
}
