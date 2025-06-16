'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

interface FallingObject {
  x: number;
  y: number;
  type: 'powerup' | 'asteroid' | 'coin';
  speed: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  points: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
}

interface Star {
  x: number;
  y: number;
}

export default function SpaceDefenderGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  const gameStateRef = useRef<{
    player: Player;
    fallingObjects: FallingObject[];
    particles: Particle[];
    stars: Star[];
    keys: Record<string, boolean>;
    spawnTimer: number;
    spawnDelay: number;
  }>({
    player: {
      x: SCREEN_WIDTH / 2 - 30,
      y: SCREEN_HEIGHT - 100,
      width: 60,
      height: 40,
      speed: 8
    },
    fallingObjects: [],
    particles: [],
    stars: [],
    keys: {},
    spawnTimer: 0,
    spawnDelay: 60
  });

  const createStars = useCallback(() => {
    const stars: Star[] = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * SCREEN_WIDTH,
        y: Math.random() * SCREEN_HEIGHT
      });
    }
    gameStateRef.current.stars = stars;
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    
    gameStateRef.current = {
      player: {
        x: SCREEN_WIDTH / 2 - 30,
        y: SCREEN_HEIGHT - 100,
        width: 60,
        height: 40,
        speed: 8
      },
      fallingObjects: [],
      particles: [],
      stars: gameStateRef.current.stars,
      keys: {},
      spawnTimer: 0,
      spawnDelay: 60
    };
  }, []);

  const checkCollision = useCallback((rect1: any, rect2: any) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }, []);

  const createParticles = useCallback((x: number, y: number, color: string, count = 10) => {
    for (let i = 0; i < count; i++) {
      gameStateRef.current.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * -6 - 2,
        color,
        life: 30,
        maxLife: 30
      });
    }
  }, []);

  const spawnObject = useCallback(() => {
    const x = Math.random() * (SCREEN_WIDTH - 100) + 50;
    const y = -50;

    const rand = Math.random();
    let type: 'powerup' | 'asteroid' | 'coin';
    let color: string;
    let points: number;

    if (rand < 0.4) {
      type = 'coin';
      color = '#ffff00';
      points = 10;
    } else if (rand < 0.6) {
      type = 'powerup';
      color = '#00ff00';
      points = 50;
    } else {
      type = 'asteroid';
      color = '#ff0000';
      points = -20;
    }

    gameStateRef.current.fallingObjects.push({
      x,
      y,
      type,
      speed: Math.random() * 5 + 3,
      size: Math.random() * 20 + 20,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 10,
      points,
      color
    });
  }, []);

  const update = useCallback(() => {
    if (gameOver) return;

    const state = gameStateRef.current;
    const { player, keys } = state;

    // Handle input
    if (keys['ArrowLeft'] && player.x > 0) {
      player.x -= player.speed;
    }
    if (keys['ArrowRight'] && player.x < SCREEN_WIDTH - player.width) {
      player.x += player.speed;
    }
    if (keys['ArrowUp'] && player.y > 0) {
      player.y -= player.speed;
    }
    if (keys['ArrowDown'] && player.y < SCREEN_HEIGHT - player.height) {
      player.y += player.speed;
    }

    // Spawn objects
    state.spawnTimer++;
    if (state.spawnTimer >= state.spawnDelay) {
      spawnObject();
      state.spawnTimer = 0;
      if (state.spawnDelay > 20) {
        state.spawnDelay -= 0.1;
      }
    }

    // Update falling objects
    for (let i = state.fallingObjects.length - 1; i >= 0; i--) {
      const obj = state.fallingObjects[i];
      obj.y += obj.speed;
      obj.rotation += obj.rotationSpeed;
      
      if (obj.y > SCREEN_HEIGHT + 50) {
        state.fallingObjects.splice(i, 1);
      } else if (checkCollision(
        { x: player.x, y: player.y, width: player.width, height: player.height },
        { x: obj.x - obj.size/2, y: obj.y - obj.size/2, width: obj.size, height: obj.size }
      )) {
        if (obj.type === 'asteroid') {
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameOver(true);
            }
            return newLives;
          });
          createParticles(obj.x, obj.y, '#ff0000', 15);
        } else {
          setScore(prev => prev + obj.points);
          createParticles(obj.x, obj.y, obj.color, 8);
        }
        state.fallingObjects.splice(i, 1);
      }
    }

    // Update particles
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const particle = state.particles[i];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.2; // gravity
      particle.life--;
      
      if (particle.life <= 0) {
        state.particles.splice(i, 1);
      }
    }
  }, [gameOver, spawnObject, checkCollision, createParticles]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const state = gameStateRef.current;
    
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    
    // Draw stars
    ctx.fillStyle = '#ffffff';
    for (const star of state.stars) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, 1, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    if (!gameOver) {
      // Draw player
      const { player } = state;
      ctx.fillStyle = '#00ffff';
      ctx.beginPath();
      ctx.moveTo(player.x + player.width / 2, player.y);
      ctx.lineTo(player.x, player.y + player.height);
      ctx.lineTo(player.x + player.width / 4, player.y + player.height - 10);
      ctx.lineTo(player.x + 3 * player.width / 4, player.y + player.height - 10);
      ctx.lineTo(player.x + player.width, player.y + player.height);
      ctx.closePath();
      ctx.fill();
      
      // Draw engine glow
      ctx.fillStyle = '#ffff00';
      ctx.beginPath();
      ctx.arc(player.x + player.width / 2, player.y + player.height + 5, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw falling objects
      for (const obj of state.fallingObjects) {
        ctx.save();
        ctx.translate(obj.x, obj.y);
        ctx.rotate(obj.rotation * Math.PI / 180);
        
        if (obj.type === 'powerup') {
          ctx.fillStyle = obj.color;
          ctx.fillRect(-obj.size / 8, -obj.size / 2, obj.size / 4, obj.size);
          ctx.fillRect(-obj.size / 2, -obj.size / 8, obj.size, obj.size / 4);
          
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = obj.color;
          ctx.beginPath();
          ctx.arc(0, 0, obj.size / 2 + 5, 0, 2 * Math.PI);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        } else if (obj.type === 'coin') {
          ctx.fillStyle = obj.color;
          ctx.beginPath();
          ctx.arc(0, 0, obj.size / 2, 0, 2 * Math.PI);
          ctx.fill();
          
          ctx.fillStyle = '#ffa500';
          ctx.beginPath();
          ctx.arc(0, 0, obj.size / 2 - 5, 0, 2 * Math.PI);
          ctx.fill();
        } else { // asteroid
          ctx.fillStyle = obj.color;
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const angle = (i * 45) * Math.PI / 180;
            const radius = obj.size / 2 + (Math.random() - 0.5) * 10;
            const px = radius * Math.cos(angle);
            const py = radius * Math.sin(angle);
            if (i === 0) {
              ctx.moveTo(px, py);
            } else {
              ctx.lineTo(px, py);
            }
          }
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
      
      // Draw particles
      for (const particle of state.particles) {
        const alpha = particle.life / particle.maxLife;
        const size = Math.max(1, 5 * alpha);
        
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
      
      // Draw HUD
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Courier New';
      ctx.fillText(`Score: ${score}`, 10, 30);
      ctx.fillText(`Lives: ${lives}`, 10, 60);
    }
  }, [gameOver, score, lives]);

  const gameLoop = useCallback(() => {
    update();
    render();
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [update, render]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.code] = true;
      
      if (gameOver && (e.code === 'KeyR' || e.code === 'KeyQ')) {
        resetGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.code] = false;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver, resetGame]);

  useEffect(() => {
    createStars();
    gameLoop();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [createStars, gameLoop]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="relative border-2 border-gray-600 rounded-lg shadow-2xl shadow-cyan-400/30">
        <canvas
          ref={canvasRef}
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT}
          className="block bg-black rounded-md"
        />
        
        {/* Instructions */}
        <div className="absolute top-3 right-3 text-white text-xs bg-black/70 p-3 rounded-md max-w-80 z-10">
          <div className="font-bold mb-2">Controls:</div>
          <div>Arrow Keys - Move spaceship</div>
          <div>R - Restart (when game over)</div>
          <div>Q - Quit (when game over)</div>
          <br />
          <div className="font-bold">Objectives:</div>
          <div>🟢 Green Power-ups: +50 points</div>
          <div>🟡 Yellow Coins: +10 points</div>
          <div>🔴 Red Asteroids: -20 points, -1 life</div>
        </div>
        
        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg">
            <div className="text-center text-white">
              <div className="text-5xl font-bold mb-4 text-red-400">GAME OVER</div>
              <div className="text-2xl mb-4">Final Score: {score}</div>
              <div className="text-gray-300 mb-6">Press R to restart or Q to quit</div>
              <button
                onClick={resetGame}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Restart Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}