import { useState, useEffect, useRef, useCallback } from 'react';
import { scoresAPI } from '../services/api';

const GRID = 20;
const CANVAS_SIZE = 600;
const INITIAL_SNAKE = [{ x: 300, y: 300 }];
const INITIAL_FOOD = { x: 480, y: 480 }];

export const useGame = (user, onScoreUpdate) => {
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [food, setFood] = useState(INITIAL_FOOD);
    const [direction, setDirection] = useState({ dx: GRID, dy: 0 });
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const directionRef = useRef(direction);
    const snakeRef = useRef(snake);
    const gameLoopRef = useRef(null);

    // Update refs when state changes
    useEffect(() => {
        directionRef.current = direction;
    }, [direction]);

    useEffect(() => {
        snakeRef.current = snake;
    }, [snake]);

    const getRandomFood = useCallback(() => {
        let newFood;
        let isOnSnake;

        do {
            newFood = {
                x: Math.floor(Math.random() * (CANVAS_SIZE / GRID)) * GRID,
                y: Math.floor(Math.random() * (CANVAS_SIZE / GRID)) * GRID,
            };
            isOnSnake = snakeRef.current.some(
                segment => segment.x === newFood.x && segment.y === newFood.y
            );
        } while (isOnSnake);

        return newFood;
    }, []);

    const checkSelfCollision = useCallback((head) => {
        for (let i = 1; i < snakeRef.current.length; i++) {
            if (head.x === snakeRef.current[i].x && head.y === snakeRef.current[i].y) {
                return true;
            }
        }
        return false;
    }, []);

    const resetGame = useCallback(() => {
        setSnake(INITIAL_SNAKE);
        setDirection({ dx: GRID, dy: 0 });
        setFood(getRandomFood());
        setScore(0);
        setGameOver(false);
        setIsPaused(false);
    }, [getRandomFood]);

    const saveScore = useCallback(async (finalScore) => {
        if (user && finalScore > 0) {
            try {
                await scoresAPI.saveScore(user.userId, finalScore);
                if (onScoreUpdate) {
                    onScoreUpdate();
                }
            } catch (err) {
                console.error('Failed to save score:', err);
            }
        }
    }, [user, onScoreUpdate]);

    const handleKeyPress = useCallback((e) => {
        const { dx, dy } = directionRef.current;

        if (gameOver && e.key === ' ') {
            e.preventDefault();
            resetGame();
            return;
        }

        if (e.key === 'p' || e.key === 'P') {
            e.preventDefault();
            setIsPaused(prev => !prev);
            return;
        }

        switch (e.key) {
            case 'ArrowLeft':
                if (dx === 0) setDirection({ dx: -GRID, dy: 0 });
                break;
            case 'ArrowUp':
                if (dy === 0) setDirection({ dx: 0, dy: -GRID });
                break;
            case 'ArrowRight':
                if (dx === 0) setDirection({ dx: GRID, dy: 0 });
                break;
            case 'ArrowDown':
                if (dy === 0) setDirection({ dx: 0, dy: GRID });
                break;
            default:
                break;
        }
    }, [gameOver, resetGame]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    const gameLoop = useCallback(() => {
        if (gameOver || isPaused) return;

        const { dx, dy } = directionRef.current;
        const currentSnake = [...snakeRef.current];
        const head = {
            x: currentSnake[0].x + dx,
            y: currentSnake[0].y + dy
        };

        // Wrap around edges
        if (head.x < 0) head.x = CANVAS_SIZE - GRID;
        if (head.x >= CANVAS_SIZE) head.x = 0;
        if (head.y < 0) head.y = CANVAS_SIZE - GRID;
        if (head.y >= CANVAS_SIZE) head.y = 0;

        // Check self collision
        if (checkSelfCollision(head)) {
            setGameOver(true);
            saveScore(score);
            return;
        }

        currentSnake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            const newScore = score + 1;
            setScore(newScore);
            setFood(getRandomFood());
        } else {
            currentSnake.pop();
        }

        setSnake(currentSnake);
    }, [gameOver, isPaused, food, score, checkSelfCollision, getRandomFood, saveScore]);

    useEffect(() => {
        gameLoopRef.current = setInterval(gameLoop, 100);
        return () => {
            if (gameLoopRef.current) {
                clearInterval(gameLoopRef.current);
            }
        };
    }, [gameLoop]);

    return {
        snake,
        food,
        score,
        gameOver,
        isPaused,
        resetGame,
        GRID
    };
};
