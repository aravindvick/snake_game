import './UserInfo.css';

const UserInfo = ({ user, onLogout }) => {
    return (
        <div className="user-info">
            <img src={user.picture} alt={user.name} className="avatar" />
            <span className="user-name">{user.name}</span>
            <button onClick={onLogout} className="btn-logout">
                Logout
            </button>
        </div>
    );
};

export default UserInfo;
