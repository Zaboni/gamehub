'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const GRID_SIZE = 20;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;

interface Position {
  x: number;
  y: number;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const gameStateRef = useRef<{
    snake: Position[];
    food: Position;
    direction: Direction;
    nextDirection: Direction;
    gameSpeed: number;
    lastMoveTime: number;
  }>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    gameSpeed: 150,
    lastMoveTime: 0
  });

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Save high score to localStorage
  useEffect(() => {
    localStorage.setItem('snakeHighScore', highScore.toString());
  }, [highScore]);

  const generateFood = useCallback((): Position => {
    const state = gameStateRef.current;
    let newFood: Position;
    
    do {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE))
      };
    } while (state.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    setIsPaused(false);
    
    gameStateRef.current = {
      snake: [{ x: 10, y: 10 }],
      food: generateFood(),
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      gameSpeed: 150,
      lastMoveTime: 0
    };
  }, [generateFood]);

  const startGame = useCallback(() => {
    setGameStarted(true);
    gameStateRef.current.lastMoveTime = Date.now();
  }, []);

  const togglePause = useCallback(() => {
    if (!gameStarted || gameOver) return;
    setIsPaused(prev => !prev);
  }, [gameStarted, gameOver]);

  const moveSnake = useCallback(() => {
    const state = gameStateRef.current;
    const head = { ...state.snake[0] };
    
    // Update direction
    state.direction = state.nextDirection;
    
    // Move head based on direction
    switch (state.direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
    }
    
    // Check wall collision
    if (head.x < 0 || head.x >= CANVAS_WIDTH / GRID_SIZE || 
        head.y < 0 || head.y >= CANVAS_HEIGHT / GRID_SIZE) {
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
      }
      return;
    }
    
    // Check self collision
    if (state.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
      }
      return;
    }
    
    // Add new head
    state.snake.unshift(head);
    
    // Check food collision
    if (head.x === state.food.x && head.y === state.food.y) {
      setScore(prev => prev + 10);
      state.food = generateFood();
      // Increase speed slightly
      state.gameSpeed = Math.max(80, state.gameSpeed - 2);
    } else {
      // Remove tail if no food eaten
      state.snake.pop();
    }
  }, [score, highScore, generateFood]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!gameStarted && !gameOver) {
      if (e.code === 'Space') {
        startGame();
        return;
      }
    }
    
    if (gameOver) {
      if (e.code === 'Space') {
        resetGame();
        return;
      }
    }
    
    if (e.code === 'KeyP' || e.code === 'Space') {
      if (gameStarted && !gameOver) {
        togglePause();
        return;
      }
    }
    
    if (!gameStarted || gameOver || isPaused) return;
    
    const state = gameStateRef.current;
    
    switch (e.code) {
      case 'ArrowUp':
      case 'KeyW':
        if (state.direction !== 'DOWN') {
          state.nextDirection = 'UP';
        }
        break;
      case 'ArrowDown':
      case 'KeyS':
        if (state.direction !== 'UP') {
          state.nextDirection = 'DOWN';
        }
        break;
      case 'ArrowLeft':
      case 'KeyA':
        if (state.direction !== 'RIGHT') {
          state.nextDirection = 'LEFT';
        }
        break;
      case 'ArrowRight':
      case 'KeyD':
        if (state.direction !== 'LEFT') {
          state.nextDirection = 'RIGHT';
        }
        break;
    }
    
    e.preventDefault();
  }, [gameStarted, gameOver, isPaused, startGame, resetGame, togglePause]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const state = gameStateRef.current;
    
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_WIDTH; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i <= CANVAS_HEIGHT; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_WIDTH, i);
      ctx.stroke();
    }
    
    // Draw snake
    state.snake.forEach((segment, index) => {
      if (index === 0) {
        // Head
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(
          segment.x * GRID_SIZE + 1,
          segment.y * GRID_SIZE + 1,
          GRID_SIZE - 2,
          GRID_SIZE - 2
        );
        
        // Eyes
        ctx.fillStyle = '#000';
        const eyeSize = 3;
        const eyeOffset = 5;
        
        if (state.direction === 'RIGHT') {
          ctx.fillRect(segment.x * GRID_SIZE + GRID_SIZE - eyeOffset, segment.y * GRID_SIZE + 4, eyeSize, eyeSize);
          ctx.fillRect(segment.x * GRID_SIZE + GRID_SIZE - eyeOffset, segment.y * GRID_SIZE + GRID_SIZE - 7, eyeSize, eyeSize);
        } else if (state.direction === 'LEFT') {
          ctx.fillRect(segment.x * GRID_SIZE + 2, segment.y * GRID_SIZE + 4, eyeSize, eyeSize);
          ctx.fillRect(segment.x * GRID_SIZE + 2, segment.y * GRID_SIZE + GRID_SIZE - 7, eyeSize, eyeSize);
        } else if (state.direction === 'UP') {
          ctx.fillRect(segment.x * GRID_SIZE + 4, segment.y * GRID_SIZE + 2, eyeSize, eyeSize);
          ctx.fillRect(segment.x * GRID_SIZE + GRID_SIZE - 7, segment.y * GRID_SIZE + 2, eyeSize, eyeSize);
        } else if (state.direction === 'DOWN') {
          ctx.fillRect(segment.x * GRID_SIZE + 4, segment.y * GRID_SIZE + GRID_SIZE - eyeOffset, eyeSize, eyeSize);
          ctx.fillRect(segment.x * GRID_SIZE + GRID_SIZE - 7, segment.y * GRID_SIZE + GRID_SIZE - eyeOffset, eyeSize, eyeSize);
        }
      } else {
        // Body
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(
          segment.x * GRID_SIZE + 2,
          segment.y * GRID_SIZE + 2,
          GRID_SIZE - 4,
          GRID_SIZE - 4
        );
      }
    });
    
    // Draw food
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(
      state.food.x * GRID_SIZE + GRID_SIZE / 2,
      state.food.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 2 - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
    
    // Add shine to food
    ctx.fillStyle = '#fca5a5';
    ctx.beginPath();
    ctx.arc(
      state.food.x * GRID_SIZE + GRID_SIZE / 2 - 3,
      state.food.y * GRID_SIZE + GRID_SIZE / 2 - 3,
      3,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }, []);

  const gameLoop = useCallback((currentTime: number) => {
    const state = gameStateRef.current;
    
    if (gameStarted && !gameOver && !isPaused) {
      if (currentTime - state.lastMoveTime >= state.gameSpeed) {
        moveSnake();
        state.lastMoveTime = currentTime;
      }
    }
    
    render();
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameStarted, gameOver, isPaused, moveSnake, render]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    resetGame();
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [resetGame, gameLoop]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">🐍 Snake Game</h1>
          <div className="flex gap-8 justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3 border border-white/30">
              <div className="text-sm text-white/80">Score</div>
              <div className="text-2xl font-bold text-white">{score}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3 border border-white/30">
              <div className="text-sm text-white/80">High Score</div>
              <div className="text-2xl font-bold text-yellow-300">{highScore}</div>
            </div>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="relative mb-6">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-2 border-white/30 rounded-lg bg-gray-900 shadow-lg"
          />
          
          {/* Game State Overlays */}
          {!gameStarted && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
              <div className="text-center text-white">
                <div className="text-2xl font-bold mb-4">🐍 Ready to Play?</div>
                <div className="text-lg mb-4">Use arrow keys or WASD to move</div>
                <div className="text-sm text-gray-300">Press SPACE to start</div>
              </div>
            </div>
          )}
          
          {isPaused && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
              <div className="text-center text-white">
                <div className="text-3xl font-bold mb-2">⏸️ PAUSED</div>
                <div className="text-sm text-gray-300">Press P or SPACE to resume</div>
              </div>
            </div>
          )}
          
          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg">
              <div className="text-center text-white">
                <div className="text-3xl font-bold mb-4 text-red-400">💀 Game Over!</div>
                <div className="text-xl mb-2">Final Score: {score}</div>
                {score === highScore && score > 0 && (
                  <div className="text-lg text-yellow-300 mb-4">🎉 New High Score!</div>
                )}
                <div className="text-sm text-gray-300">Press SPACE to play again</div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="text-center space-y-4">
          <div className="flex gap-4 justify-center flex-wrap">
            {!gameStarted && !gameOver && (
              <button
                onClick={startGame}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors duration-200"
              >
                Start Game
              </button>
            )}
            {gameStarted && !gameOver && (
              <button
                onClick={togglePause}
                className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-colors duration-200"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
            )}
            {gameOver && (
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors duration-200"
              >
                Play Again
              </button>
            )}
          </div>
          
          {/* Instructions */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
            <div className="text-white text-sm">
              <div className="font-bold mb-2">🎮 Controls:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>↑↓←→ Arrow Keys</div>
                <div>WASD Keys</div>
                <div>SPACE - Start/Pause</div>
                <div>P - Pause/Resume</div>
              </div>
              <div className="mt-3 text-xs text-white/80">
                Eat the red food to grow and increase your score. Don't hit the walls or yourself!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}