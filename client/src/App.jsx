import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth } from './hooks/useAuth';
import { useGame } from './hooks/useGame';
import { useHighScores } from './hooks/useHighScores';
import LoginPage from './components/Auth/LoginPage';
import UserInfo from './components/Auth/UserInfo';
import GameCanvas from './components/Game/GameCanvas';
import GameInfo from './components/Game/GameInfo';
import HighScores from './components/Game/HighScores';
import './App.css';

const GOOGLE_CLIENT_ID = '634193896624-9ri71hpsaofsqov9pfckco1c17lf6l95.apps.googleusercontent.com';

function App() {
  const { user, login, logout, isAuthenticated } = useAuth();
  const { scores, isLoading, error, refresh } = useHighScores();
  const gameState = useGame(user, refresh);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      await login(credentialResponse);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleLoginError = () => {
    console.error('Login failed');
  };

  const handleLogout = () => {
    logout();
    gameState.resetGame();
  };

  if (!isAuthenticated) {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <LoginPage
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
        />
      </GoogleOAuthProvider>
    );
  }

  return (
    <div className="game-section">
      <div className="game-container">
        <div className="game-header">
          <h1 className="game-title">🐍 Snake Game</h1>
          <UserInfo user={user} onLogout={handleLogout} />
        </div>

        <div className="game-layout">
          <div className="game-left">
            <GameCanvas
              snake={gameState.snake}
              food={gameState.food}
              gameOver={gameState.gameOver}
              score={gameState.score}
              onRestart={gameState.resetGame}
              GRID={gameState.GRID}
            />
          </div>

          <div className="game-right">
            <GameInfo
              score={gameState.score}
              isPaused={gameState.isPaused}
            />

            <HighScores
              scores={scores}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
