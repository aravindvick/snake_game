import './HighScores.css';

const HighScores = ({ scores, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="highscores-section">
                <h2>🏆 Top 10 High Scores</h2>
                <div className="highscores-list">
                    <p className="loading-text">Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="highscores-section">
                <h2>🏆 Top 10 High Scores</h2>
                <div className="highscores-list">
                    <p className="error-text">Failed to load scores</p>
                </div>
            </div>
        );
    }

    if (scores.length === 0) {
        return (
            <div className="highscores-section">
                <h2>🏆 Top 10 High Scores</h2>
                <div className="highscores-list">
                    <p className="empty-text">No scores yet. Be the first!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="highscores-section">
            <h2>🏆 Top 10 High Scores</h2>
            <div className="highscores-list">
                {scores.map((item, index) => (
                    <div key={index} className="highscore-item">
                        <span className="highscore-rank">#{index + 1}</span>
                        <span className="highscore-name">{item.name}</span>
                        <span className="highscore-score">{item.score}</span>
                        <span className="highscore-date">
                            {new Date(item.played_at).toLocaleDateString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HighScores;
