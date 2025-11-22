import { useState, useEffect, useCallback } from 'react';
import { scoresAPI } from '../services/api';

export const useHighScores = () => {
    const [scores, setScores] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchScores = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await scoresAPI.getHighScores();
            setScores(data);
        } catch (err) {
            setError(err.message || 'Failed to load high scores');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchScores();
    }, [fetchScores]);

    return {
        scores,
        isLoading,
        error,
        refresh: fetchScores
    };
};
