# Snake Game Web Application (React + Express)

A modern snake game built with React, Vite, Express, and SQLite. Features Google OAuth authentication, score tracking, and a beautiful glassmorphism UI.

## Features

- 🐍 Classic snake game with smooth controls
- ⚛️ React frontend with Vite
- 🔐 Google OAuth 2.0 authentication
- 💾 SQLite database for user data and scores
- 🏆 High score leaderboard (top 10)
- 🎨 Modern UI with glassmorphism effects
- 📱 Responsive design
- ⚡ Hot module replacement (HMR)

## Tech Stack

**Frontend**:
- React 18
- Vite
- @react-oauth/google
- Axios

**Backend**:
- Node.js
- Express
- SQLite3
- google-auth-library

## Project Structure

```
snake_game/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API service
│   │   └── App.jsx
│   └── package.json
├── server/                 # Express backend
│   ├── index.js
│   ├── package.json
│   └── data/               # SQLite database
├── .env                    # Environment variables
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- npm
- Google Cloud Console account (for OAuth credentials)

## Setup Instructions

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen if prompted
6. Select **Web application** as the application type
7. Add authorized JavaScript origins:
   - `http://localhost:5173`
8. Add authorized redirect URIs:
   - `http://localhost:3001/auth/google/callback`
9. Copy the **Client ID** and **Client Secret**

### 2. Configure Environment Variables

Create/edit the `.env` file in the project root:

```
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
PORT=3001
```

### 3. Update Frontend with Client ID

Open `client/src/App.jsx` and update the `GOOGLE_CLIENT_ID` constant (line 12):

```javascript
const GOOGLE_CLIENT_ID = 'your_actual_client_id_here';
```

### 4. Install Dependencies

**Backend**:
```bash
cd server
npm install
```

**Frontend**:
```bash
cd client
npm install
```

### 5. Run the Application

**Terminal 1 - Start Backend**:
```bash
cd server
npm run dev
```
Server will start on `http://localhost:3001`

**Terminal 2 - Start Frontend**:
```bash
cd client
npm run dev
```
Frontend will start on `http://localhost:5173`

### 6. Access the Application

Open your browser and navigate to `http://localhost:5173`

## How to Play

1. Click **Sign in with Google** to authenticate
2. Use arrow keys to control the snake:
   - ⬆️ Arrow Up - Move up
   - ⬇️ Arrow Down - Move down
   - ⬅️ Arrow Left - Move left
   - ➡️ Arrow Right - Move right
3. Press **P** to pause/unpause
4. Eat the red food to grow and increase your score
5. Avoid hitting yourself!
6. Press **SPACE** to restart after game over

## API Endpoints

- `POST /api/auth` - Verify Google ID token and create/update user
- `POST /api/score` - Save a game score
- `GET /api/highscores` - Get top 10 high scores

## Database Schema

### Users Table
- `id` (TEXT, PRIMARY KEY) - Google user ID
- `email` (TEXT) - User email
- `name` (TEXT) - User display name
- `picture` (TEXT) - Profile picture URL

### Scores Table
- `user_id` (TEXT, FOREIGN KEY) - Reference to users table
- `score` (INTEGER) - Game score
- `played_at` (DATETIME) - Timestamp

## Development

### Frontend Development
- Hot module replacement enabled
- Component-based architecture
- Custom hooks for game logic, auth, and data fetching
- Scoped CSS per component

### Backend Development
- Nodemon for auto-restart
- CORS configured for local development
- RESTful API design

## Production Build

**Build Frontend**:
```bash
cd client
npm run build
```

This creates an optimized production build in `client/dist/`.

To serve the production build, you can configure the backend to serve static files from `client/dist/`.

## License

MIT
