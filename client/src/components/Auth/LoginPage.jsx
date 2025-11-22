import { GoogleLogin } from '@react-oauth/google';
import './LoginPage.css';

const LoginPage = ({ onSuccess, onError }) => {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="game-title">🐍 Snake Game</h1>
                <p className="subtitle">Sign in to save your high scores</p>
                <div className="google-login-wrapper">
                    <GoogleLogin
                        onSuccess={onSuccess}
                        onError={onError}
                        theme="filled_blue"
                        size="large"
                        text="signin_with"
                        shape="rectangular"
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
