import './GameInfo.css';

const GameInfo = ({ score, isPaused }) => {
    return (
        <div className="game-info">
            <div className="score-display">
                <span className="label">Current Score:</span>
                <span className="score-value">{score}</span>
            </div>
            {isPaused && (
                <div className="pause-indicator">
                    ⏸️ PAUSED
                </div>
            )}
            <div className="controls-hint">
                Use arrow keys to control the snake • Press P to pause
            </div>
        </div>
    );
};

export default GameInfo;
