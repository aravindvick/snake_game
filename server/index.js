require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { OAuth2Client } = require('google-auth-library');

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

const db = new sqlite3.Database('./data/users.db');

// Initialise DB tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    picture TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS scores (
    user_id TEXT,
    score INTEGER,
    played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Verify Google ID token
async function verifyToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
}

// Auth endpoint – receives ID token from frontend, verifies, upserts user
app.post('/api/auth', async (req, res) => {
  const { idToken } = req.body;
  try {
    const payload = await verifyToken(idToken);
    const { sub, email, name, picture } = payload;
    // Upsert user
    db.run(
      `INSERT INTO users (id, email, name, picture) VALUES (?,?,?,?)
       ON CONFLICT(id) DO UPDATE SET email=excluded.email, name=excluded.name, picture=excluded.picture`,
      [sub, email, name, picture]
    );
    res.json({ userId: sub, email, name, picture });
  } catch (e) {
    console.error(e);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Save score endpoint
app.post('/api/score', (req, res) => {
  const { userId, score } = req.body;
  db.run(`INSERT INTO scores (user_id, score) VALUES (?,?)`, [userId, score], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Get high scores (top 10)
app.get('/api/highscores', (req, res) => {
  db.all(`SELECT u.name, s.score, s.played_at FROM scores s JOIN users u ON s.user_id = u.id ORDER BY s.score DESC LIMIT 10`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
