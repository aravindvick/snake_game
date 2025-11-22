import { useState, useCallback } from 'react';
import { authAPI } from '../services/api';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = useCallback(async (credentialResponse) => {
        setIsLoading(true);
        setError(null);

        try {
            const idToken = credentialResponse.credential;
            const userData = await authAPI.verifyToken(idToken);
            setUser(userData);
            return userData;
        } catch (err) {
            setError(err.message || 'Authentication failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setError(null);
    }, []);

    return {
        user,
        isLoading,
        error,
        login,
        logout,
        isAuthenticated: !!user
    };
};
