const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const grid = 20;
let count = 0;
let snake = [{ x: 160, y: 160 }];
let dx = grid;
let dy = 0;
let food = { x: 320, y: 320 };
let score = 0;
let gameOver = false;

// Generate random food position
function getRandomFood() {
    let newFood;
    let isOnSnake;

    do {
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / grid)) * grid,
            y: Math.floor(Math.random() * (canvas.height / grid)) * grid,
        };

        // Check if food spawned on snake
        isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    } while (isOnSnake);

    return newFood;
}

// Check if snake collides with itself
function checkSelfCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// Reset game
function resetGame() {
    snake = [{ x: 160, y: 160 }];
    dx = grid;
    dy = 0;
    food = getRandomFood();
    score = 0;
    gameOver = false;
    document.getElementById('score').textContent = '0';
}

// Main game loop
function loop() {
    requestAnimationFrame(loop);

    if (gameOver) return;

    if (++count < 6) return; // Control game speed
    count = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move snake
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wrap around edges
    if (head.x < 0) head.x = canvas.width - grid;
    if (head.x >= canvas.width) head.x = 0;
    if (head.y < 0) head.y = canvas.height - grid;
    if (head.y >= canvas.height) head.y = 0;

    // Check self collision
    if (checkSelfCollision(head)) {
        gameOver = true;

        // Send final score to backend
        if (user) {
            fetch('/api/score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.userId, score })
            })
                .then(() => {
                    loadHighScores(); // Refresh high scores
                })
                .catch(err => console.error('Failed to save score:', err));
        }

        // Show game over message
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 30px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);

        ctx.font = '20px Inter';
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);

        ctx.font = '16px Inter';
        ctx.fillStyle = '#667eea';
        ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 60);

        return;
    }

    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('score').textContent = score;
        food = getRandomFood();
    } else {
        snake.pop();
    }

    // Draw food with glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff5252';
    ctx.fillStyle = '#ff5252';
    ctx.fillRect(food.x, food.y, grid - 2, grid - 2);
    ctx.shadowBlur = 0;

    // Draw snake with gradient
    snake.forEach((segment, index) => {
        const opacity = 1 - (index / snake.length) * 0.5;

        if (index === 0) {
            // Head - brighter
            ctx.fillStyle = '#667eea';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#667eea';
        } else {
            // Body - gradient fade
            ctx.fillStyle = `rgba(102, 126, 234, ${opacity})`;
            ctx.shadowBlur = 0;
        }

        ctx.fillRect(segment.x, segment.y, grid - 2, grid - 2);
    });

    ctx.shadowBlur = 0;
}

// Keyboard controls
document.addEventListener('keydown', e => {
    if (gameOver && e.key === ' ') {
        resetGame();
        return;
    }

    if (e.key === 'ArrowLeft' && dx === 0) {
        dx = -grid;
        dy = 0;
    } else if (e.key === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -grid;
    } else if (e.key === 'ArrowRight' && dx === 0) {
        dx = grid;
        dy = 0;
    } else if (e.key === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = grid;
    }
});

// Start game loop
requestAnimationFrame(loop);
