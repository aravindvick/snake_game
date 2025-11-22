import { useEffect, useRef } from 'react';
import './GameCanvas.css';

const GameCanvas = ({ snake, food, gameOver, score, onRestart, GRID }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw food with glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff5252';
        ctx.fillStyle = '#ff5252';
        ctx.fillRect(food.x, food.y, GRID - 2, GRID - 2);
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

            ctx.fillRect(segment.x, segment.y, GRID - 2, GRID - 2);
        });

        ctx.shadowBlur = 0;

        // Draw game over screen
        if (gameOver) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 30px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);

            ctx.font = '20px Inter, sans-serif';
            ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);

            ctx.font = '16px Inter, sans-serif';
            ctx.fillStyle = '#667eea';
            ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 60);
        }
    }, [snake, food, gameOver, score, GRID]);

    return (
        <div className="game-board">
            <canvas
                ref={canvasRef}
                width={600}
                height={600}
                className="game-canvas"
            />
        </div>
    );
};

export default GameCanvas;
