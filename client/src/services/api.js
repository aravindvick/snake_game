import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const authAPI = {
    verifyToken: async (idToken) => {
        const response = await api.post('/auth', { idToken });
        return response.data;
    }
};

export const scoresAPI = {
    saveScore: async (userId, score) => {
        const response = await api.post('/score', { userId, score });
        return response.data;
    },

    getHighScores: async () => {
        const response = await api.get('/highscores');
        return response.data;
    }
};

export default api;
