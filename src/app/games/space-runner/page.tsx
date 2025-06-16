'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  maxSpeed: number;
  acceleration: number;
  friction: number;
}

interface GameObject {
  x: number;
  y: number;
  size: number;
}

interface Star extends GameObject {
  points: number;
  collected: boolean;
}

interface Asteroid extends GameObject {
  rotation: number;
  rotationSpeed: number;
}

interface Powerup extends GameObject {
  type: string;
  collected: boolean;
  pulse: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  alpha: number;
}

interface BackgroundStar {
  x: number;
  y: number;
  size: number;
  speed: number;
}

type GameState = 'start' | 'playing' | 'gameOver';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;

export default function SpaceRunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(2);
  const [finalScore, setFinalScore] = useState(0);
  const [finalDistance, setFinalDistance] = useState(0);

  const gameStateRef = useRef<{
    player: Player;
    stars: Star[];
    asteroids: Asteroid[];
    powerups: Powerup[];
    particles: Particle[];
    backgroundStars: BackgroundStar[];
    keys: Record<string, boolean>;
    baseSpeed: number;
  }>({
    player: {
      x: 100,
      y: CANVAS_HEIGHT / 2,
      width: 40,
      height: 30,
      velocityY: 0,
      maxSpeed: 8,
      acceleration: 0.5,
      friction: 0.8
    },
    stars: [],
    asteroids: [],
    powerups: [],
    particles: [],
    backgroundStars: [],
    keys: {},
    baseSpeed: 2
  });

  const createBackgroundStars = useCallback(() => {
    const stars: BackgroundStar[] = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 2 + 1
      });
    }
    gameStateRef.current.backgroundStars = stars;
  }, []);

  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setDistance(0);
    setGameSpeed(gameStateRef.current.baseSpeed);
    
    // Reset player
    gameStateRef.current.player = {
      x: 100,
      y: CANVAS_HEIGHT / 2,
      width: 40,
      height: 30,
      velocityY: 0,
      maxSpeed: 8,
      acceleration: 0.5,
      friction: 0.8
    };
    
    // Clear arrays
    gameStateRef.current.stars = [];
    gameStateRef.current.asteroids = [];
    gameStateRef.current.powerups = [];
    gameStateRef.current.particles = [];
  }, []);

  const gameOver = useCallback(() => {
    setGameState('gameOver');
    setFinalScore(score);
    setFinalDistance(Math.floor(distance));
    
    // Create explosion particles
    const player = gameStateRef.current.player;
    for (let i = 0; i < 20; i++) {
      gameStateRef.current.particles.push({
        x: player.x + player.width/2,
        y: player.y + player.height/2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        life: 60,
        maxLife: 60,
        color: '#ff4444',
        alpha: 1
      });
    }
  }, [score, distance]);

  const isColliding = useCallback((obj1: any, obj2: any) => {
    return obj1.x < obj2.x + obj2.size &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.size &&
           obj1.y + obj1.height > obj2.y;
  }, []);

  const update = useCallback(() => {
    if (gameState !== 'playing') return;
    
    const state = gameStateRef.current;
    const currentGameSpeed = gameSpeed;
    
    // Update distance and speed
    const newDistance = distance + currentGameSpeed * 0.1;
    const newGameSpeed = state.baseSpeed + Math.floor(newDistance / 100) * 0.5;
    setDistance(newDistance);
    setGameSpeed(newGameSpeed);
    
    // Handle input
    const { keys, player } = state;
    if (keys['ArrowUp']) {
      player.velocityY -= player.acceleration;
    }
    if (keys['ArrowDown']) {
      player.velocityY += player.acceleration;
    }
    if (keys['ArrowLeft']) {
      setGameSpeed(Math.max(1, currentGameSpeed - 0.1));
    }
    if (keys['ArrowRight']) {
      setGameSpeed(Math.min(10, currentGameSpeed + 0.1));
    }
    
    // Update player
    player.y += player.velocityY;
    player.velocityY *= player.friction;
    player.velocityY = Math.max(-player.maxSpeed, Math.min(player.maxSpeed, player.velocityY));
    player.y = Math.max(0, Math.min(CANVAS_HEIGHT - player.height, player.y));
    
    // Spawn objects
    if (Math.random() < 0.3) {
      state.stars.push({
        x: CANVAS_WIDTH,
        y: Math.random() * (CANVAS_HEIGHT - 40) + 20,
        size: Math.random() * 8 + 4,
        points: 10,
        collected: false
      });
    }
    
    if (Math.random() < 0.02 + newDistance * 0.00001) {
      state.asteroids.push({
        x: CANVAS_WIDTH,
        y: Math.random() * (CANVAS_HEIGHT - 60) + 30,
        size: Math.random() * 30 + 20,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.2
      });
    }
    
    if (Math.random() < 0.005) {
      state.powerups.push({
        x: CANVAS_WIDTH,
        y: Math.random() * (CANVAS_HEIGHT - 40) + 20,
        size: 16,
        type: 'speed',
        collected: false,
        pulse: 0
      });
    }
    
    // Update objects
    for (let i = state.stars.length - 1; i >= 0; i--) {
      const star = state.stars[i];
      star.x -= currentGameSpeed * 2;
      if (star.x < -star.size) {
        state.stars.splice(i, 1);
      }
    }
    
    for (let i = state.asteroids.length - 1; i >= 0; i--) {
      const asteroid = state.asteroids[i];
      asteroid.x -= currentGameSpeed * 1.5;
      asteroid.rotation += asteroid.rotationSpeed;
      if (asteroid.x < -asteroid.size) {
        state.asteroids.splice(i, 1);
      }
    }
    
    for (let i = state.powerups.length - 1; i >= 0; i--) {
      const powerup = state.powerups[i];
      powerup.x -= currentGameSpeed * 2;
      powerup.pulse += 0.2;
      if (powerup.x < -powerup.size) {
        state.powerups.splice(i, 1);
      }
    }
    
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const particle = state.particles[i];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
      particle.alpha = particle.life / particle.maxLife;
      if (particle.life <= 0) {
        state.particles.splice(i, 1);
      }
    }
    
    for (const star of state.backgroundStars) {
      star.x -= star.speed * currentGameSpeed * 0.3;
      if (star.x < 0) {
        star.x = CANVAS_WIDTH;
        star.y = Math.random() * CANVAS_HEIGHT;
      }
    }
    
    // Check collisions
    for (let i = state.stars.length - 1; i >= 0; i--) {
      const star = state.stars[i];
      if (!star.collected && isColliding(player, star)) {
        star.collected = true;
        setScore(prev => prev + star.points);
        // Create star particles
        for (let j = 0; j < 8; j++) {
          state.particles.push({
            x: star.x,
            y: star.y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 30,
            maxLife: 30,
            color: '#ffff00',
            alpha: 1
          });
        }
        state.stars.splice(i, 1);
      }
    }
    
    for (const asteroid of state.asteroids) {
      if (isColliding(player, asteroid)) {
        gameOver();
        return;
      }
    }
    
    for (let i = state.powerups.length - 1; i >= 0; i--) {
      const powerup = state.powerups[i];
      if (!powerup.collected && isColliding(player, powerup)) {
        powerup.collected = true;
        setScore(prev => prev + 50);
        setGameSpeed(prev => prev + 1);
        // Create powerup particles
        for (let j = 0; j < 12; j++) {
          state.particles.push({
            x: powerup.x,
            y: powerup.y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 40,
            maxLife: 40,
            color: '#00ffff',
            alpha: 1
          });
        }
        state.powerups.splice(i, 1);
      }
    }
  }, [gameState, gameSpeed, distance, score, gameOver, isColliding]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const state = gameStateRef.current;
    
    // Clear canvas
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw background stars
    ctx.fillStyle = '#ffffff';
    for (const star of state.backgroundStars) {
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    
    if (gameState === 'playing') {
      // Draw player
      const { player } = state;
      ctx.save();
      ctx.translate(player.x + player.width/2, player.y + player.height/2);
      
      ctx.fillStyle = '#00ffff';
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(-15, -10);
      ctx.lineTo(-10, 0);
      ctx.lineTo(-15, 10);
      ctx.closePath();
      ctx.fill();
      
      ctx.fillStyle = '#ffff00';
      ctx.beginPath();
      ctx.arc(-18, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
      
      // Draw stars
      for (const star of state.stars) {
        ctx.fillStyle = '#ffff00';
        ctx.save();
        ctx.translate(star.x, star.y);
        ctx.rotate(Date.now() * 0.01);
        
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5;
          const x = Math.cos(angle) * star.size;
          const y = Math.sin(angle) * star.size;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          
          const innerAngle = ((i + 0.5) * Math.PI * 2) / 5;
          const innerX = Math.cos(innerAngle) * star.size * 0.5;
          const innerY = Math.sin(innerAngle) * star.size * 0.5;
          ctx.lineTo(innerX, innerY);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      
      // Draw asteroids
      for (const asteroid of state.asteroids) {
        ctx.fillStyle = '#666666';
        ctx.save();
        ctx.translate(asteroid.x, asteroid.y);
        ctx.rotate(asteroid.rotation);
        
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI * 2) / 8;
          const radius = asteroid.size * (0.8 + Math.sin(i) * 0.2);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = '#444444';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
      }
      
      // Draw powerups
      for (const powerup of state.powerups) {
        const pulseSize = powerup.size + Math.sin(powerup.pulse) * 4;
        
        ctx.fillStyle = '#00ffff';
        ctx.globalAlpha = 0.8 + Math.sin(powerup.pulse) * 0.2;
        
        ctx.save();
        ctx.translate(powerup.x, powerup.y);
        ctx.rotate(powerup.pulse * 0.1);
        
        ctx.beginPath();
        ctx.moveTo(0, -pulseSize);
        ctx.lineTo(pulseSize * 0.3, -pulseSize * 0.3);
        ctx.lineTo(0, -pulseSize * 0.1);
        ctx.lineTo(pulseSize * 0.5, pulseSize * 0.3);
        ctx.lineTo(0, pulseSize);
        ctx.lineTo(-pulseSize * 0.3, pulseSize * 0.3);
        ctx.lineTo(0, pulseSize * 0.1);
        ctx.lineTo(-pulseSize * 0.5, -pulseSize * 0.3);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
        ctx.globalAlpha = 1;
      }
      
      // Draw particles
      for (const particle of state.particles) {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }, [gameState]);

  const gameLoop = useCallback(() => {
    update();
    render();
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [update, render]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.code] = true;
      e.preventDefault();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.code] = false;
      e.preventDefault();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    createBackgroundStars();
    gameLoop();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [createBackgroundStars, gameLoop]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="relative border-4 border-blue-400 rounded-xl shadow-2xl shadow-blue-400/50">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block rounded-lg bg-black"
        />
        
        {/* UI Overlay */}
        <div className="absolute top-5 left-5 text-white text-lg font-mono z-10">
          <div>Score: {score}</div>
          <div>Distance: {Math.floor(distance)}m</div>
          <div>Speed: {gameSpeed.toFixed(1)}x</div>
        </div>
        
        {/* Instructions */}
        <div className="absolute top-5 right-5 text-white text-sm bg-black/70 p-4 rounded-lg max-w-64 z-10">
          <div className="font-bold mb-2">🚀 Space Runner</div>
          <div className="space-y-1 mb-3">
            <div>🔼 Up Arrow - Move Up</div>
            <div>🔽 Down Arrow - Move Down</div>
            <div>⬅️ Left Arrow - Slow Down</div>
            <div>➡️ Right Arrow - Speed Up</div>
          </div>
          <div className="font-bold">Collect:</div>
          <div>⭐ Stars - Points</div>
          <div>⚡ Power-ups - Boost</div>
          <div className="font-bold">Avoid:</div>
          <div>🌑 Asteroids - Game Over</div>
        </div>
        
        {/* Start Screen */}
        {gameState === 'start' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg">
            <div className="text-center text-white">
              <div className="text-5xl font-bold mb-5 text-blue-400 drop-shadow-lg">
                🚀 SPACE RUNNER
              </div>
              <div className="text-lg mb-8 text-gray-300">
                Navigate through space, collect stars, and avoid asteroids!<br />
                The longer you survive, the faster you go!
              </div>
              <button
                onClick={startGame}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Start Game
              </button>
            </div>
          </div>
        )}
        
        {/* Game Over Screen */}
        {gameState === 'gameOver' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 rounded-lg">
            <div className="text-center text-white bg-gray-900/90 p-8 rounded-xl border-2 border-blue-400">
              <div className="text-4xl font-bold mb-4 text-red-400">💥 GAME OVER</div>
              <div className="text-2xl mb-2 text-blue-400">Final Score: {finalScore}</div>
              <div className="text-2xl mb-4 text-blue-400">Distance: {finalDistance}m</div>
              <div className="text-gray-300 mb-6">You crashed into an asteroid!</div>
              <div className="space-x-4">
                <button
                  onClick={startGame}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Play Again
                </button>
                <button
                  onClick={() => setGameState('start')}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Main Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}