// Game constants
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;
const FPS = 60;

// Game state
let gameState = 'start'; // 'start', 'playing', 'gameOver'
let score = 0;
let distance = 0;
let gameSpeed = 2;
let baseSpeed = 2;

// Player object
const player = {
    x: 100,
    y: CANVAS_HEIGHT / 2,
    width: 40,
    height: 30,
    velocityY: 0,
    maxSpeed: 8,
    acceleration: 0.5,
    friction: 0.8
};

// Game objects arrays
let stars = [];
let asteroids = [];
let powerups = [];
let particles = [];
let backgroundStars = [];

// Input handling
const keys = {};

// Canvas and context
let canvas, ctx;

// Initialize game
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Create background stars
    createBackgroundStars();
    
    // Setup event listeners
    setupEventListeners();
    
    // Start game loop
    gameLoop();
}

// Setup event listeners
function setupEventListeners() {
    document.addEventListener('keydown', (e) => {
        keys[e.code] = true;
        e.preventDefault();
    });
    
    document.addEventListener('keyup', (e) => {
        keys[e.code] = false;
        e.preventDefault();
    });
}

// Create background stars
function createBackgroundStars() {
    backgroundStars = [];
    for (let i = 0; i < 100; i++) {
        backgroundStars.push({
            x: Math.random() * CANVAS_WIDTH,
            y: Math.random() * CANVAS_HEIGHT,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 2 + 1
        });
    }
}

// Start game
function startGame() {
    gameState = 'playing';
    score = 0;
    distance = 0;
    gameSpeed = baseSpeed;
    
    // Reset player
    player.x = 100;
    player.y = CANVAS_HEIGHT / 2;
    player.velocityY = 0;
    
    // Clear arrays
    stars = [];
    asteroids = [];
    powerups = [];
    particles = [];
    
    // Hide start screen
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    
    updateUI();
}

// Restart game
function restartGame() {
    startGame();
}

// Show start screen
function showStartScreen() {
    gameState = 'start';
    document.getElementById('startScreen').style.display = 'block';
    document.getElementById('gameOver').style.display = 'none';
}

// Game over
function gameOver() {
    gameState = 'gameOver';
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalDistance').textContent = Math.floor(distance);
    document.getElementById('gameOver').style.display = 'block';
    
    // Create explosion particles
    createExplosion(player.x + player.width/2, player.y + player.height/2);
}

// Update game logic
function update() {
    if (gameState !== 'playing') return;
    
    // Update distance and speed
    distance += gameSpeed * 0.1;
    gameSpeed = baseSpeed + Math.floor(distance / 100) * 0.5;
    
    // Handle input
    handleInput();
    
    // Update player
    updatePlayer();
    
    // Spawn objects
    spawnObjects();
    
    // Update objects
    updateStars();
    updateAsteroids();
    updatePowerups();
    updateParticles();
    updateBackgroundStars();
    
    // Check collisions
    checkCollisions();
    
    // Update UI
    updateUI();
}

// Handle input
function handleInput() {
    if (keys['ArrowUp']) {
        player.velocityY -= player.acceleration;
    }
    if (keys['ArrowDown']) {
        player.velocityY += player.acceleration;
    }
    if (keys['ArrowLeft']) {
        gameSpeed = Math.max(1, gameSpeed - 0.1);
    }
    if (keys['ArrowRight']) {
        gameSpeed = Math.min(10, gameSpeed + 0.1);
    }
}

// Update player
function updatePlayer() {
    // Apply velocity
    player.y += player.velocityY;
    
    // Apply friction
    player.velocityY *= player.friction;
    
    // Limit speed
    player.velocityY = Math.max(-player.maxSpeed, Math.min(player.maxSpeed, player.velocityY));
    
    // Keep player on screen
    player.y = Math.max(0, Math.min(CANVAS_HEIGHT - player.height, player.y));
}

// Spawn objects
function spawnObjects() {
    // Spawn stars
    if (Math.random() < 0.3) {
        stars.push({
            x: CANVAS_WIDTH,
            y: Math.random() * (CANVAS_HEIGHT - 40) + 20,
            size: Math.random() * 8 + 4,
            points: 10,
            collected: false
        });
    }
    
    // Spawn asteroids
    if (Math.random() < 0.02 + distance * 0.00001) {
        asteroids.push({
            x: CANVAS_WIDTH,
            y: Math.random() * (CANVAS_HEIGHT - 60) + 30,
            size: Math.random() * 30 + 20,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.2
        });
    }
    
    // Spawn powerups
    if (Math.random() < 0.005) {
        powerups.push({
            x: CANVAS_WIDTH,
            y: Math.random() * (CANVAS_HEIGHT - 40) + 20,
            size: 16,
            type: 'speed',
            collected: false,
            pulse: 0
        });
    }
}

// Update stars
function updateStars() {
    for (let i = stars.length - 1; i >= 0; i--) {
        const star = stars[i];
        star.x -= gameSpeed * 2;
        
        if (star.x < -star.size) {
            stars.splice(i, 1);
        }
    }
}

// Update asteroids
function updateAsteroids() {
    for (let i = asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i];
        asteroid.x -= gameSpeed * 1.5;
        asteroid.rotation += asteroid.rotationSpeed;
        
        if (asteroid.x < -asteroid.size) {
            asteroids.splice(i, 1);
        }
    }
}

// Update powerups
function updatePowerups() {
    for (let i = powerups.length - 1; i >= 0; i--) {
        const powerup = powerups[i];
        powerup.x -= gameSpeed * 2;
        powerup.pulse += 0.2;
        
        if (powerup.x < -powerup.size) {
            powerups.splice(i, 1);
        }
    }
}

// Update particles
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        particle.alpha = particle.life / particle.maxLife;
        
        if (particle.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

// Update background stars
function updateBackgroundStars() {
    for (const star of backgroundStars) {
        star.x -= star.speed * gameSpeed * 0.3;
        
        if (star.x < 0) {
            star.x = CANVAS_WIDTH;
            star.y = Math.random() * CANVAS_HEIGHT;
        }
    }
}

// Check collisions
function checkCollisions() {
    // Check star collisions
    for (let i = stars.length - 1; i >= 0; i--) {
        const star = stars[i];
        if (!star.collected && isColliding(player, star)) {
            star.collected = true;
            score += star.points;
            createStarParticles(star.x, star.y);
            stars.splice(i, 1);
        }
    }
    
    // Check asteroid collisions
    for (const asteroid of asteroids) {
        if (isColliding(player, asteroid)) {
            gameOver();
            return;
        }
    }
    
    // Check powerup collisions
    for (let i = powerups.length - 1; i >= 0; i--) {
        const powerup = powerups[i];
        if (!powerup.collected && isColliding(player, powerup)) {
            powerup.collected = true;
            score += 50;
            gameSpeed += 1;
            createPowerupParticles(powerup.x, powerup.y);
            powerups.splice(i, 1);
        }
    }
}

// Collision detection
function isColliding(obj1, obj2) {
    return obj1.x < obj2.x + obj2.size &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.size &&
           obj1.y + obj1.height > obj2.y;
}

// Create particles
function createStarParticles(x, y) {
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 30,
            maxLife: 30,
            color: '#ffff00',
            alpha: 1
        });
    }
}

function createPowerupParticles(x, y) {
    for (let i = 0; i < 12; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 40,
            maxLife: 40,
            color: '#00ffff',
            alpha: 1
        });
    }
}

function createExplosion(x, y) {
    for (let i = 0; i < 20; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.5) * 12,
            life: 60,
            maxLife: 60,
            color: '#ff4444',
            alpha: 1
        });
    }
}

// Render game
function render() {
    // Clear canvas
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw background stars
    ctx.fillStyle = '#ffffff';
    for (const star of backgroundStars) {
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
    
    if (gameState === 'playing') {
        // Draw player
        drawPlayer();
        
        // Draw stars
        drawStars();
        
        // Draw asteroids
        drawAsteroids();
        
        // Draw powerups
        drawPowerups();
        
        // Draw particles
        drawParticles();
    }
}

// Draw player
function drawPlayer() {
    ctx.save();
    ctx.translate(player.x + player.width/2, player.y + player.height/2);
    
    // Draw spaceship
    ctx.fillStyle = '#00ffff';
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(-15, -10);
    ctx.lineTo(-10, 0);
    ctx.lineTo(-15, 10);
    ctx.closePath();
    ctx.fill();
    
    // Draw engine glow
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(-18, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// Draw stars
function drawStars() {
    for (const star of stars) {
        ctx.fillStyle = '#ffff00';
        ctx.save();
        ctx.translate(star.x, star.y);
        ctx.rotate(Date.now() * 0.01);
        
        // Draw star shape
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
}

// Draw asteroids
function drawAsteroids() {
    for (const asteroid of asteroids) {
        ctx.fillStyle = '#666666';
        ctx.save();
        ctx.translate(asteroid.x, asteroid.y);
        ctx.rotate(asteroid.rotation);
        
        // Draw irregular asteroid shape
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
        
        // Add some detail
        ctx.strokeStyle = '#444444';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
    }
}

// Draw powerups
function drawPowerups() {
    for (const powerup of powerups) {
        const pulseSize = powerup.size + Math.sin(powerup.pulse) * 4;
        
        ctx.fillStyle = '#00ffff';
        ctx.globalAlpha = 0.8 + Math.sin(powerup.pulse) * 0.2;
        
        ctx.save();
        ctx.translate(powerup.x, powerup.y);
        ctx.rotate(powerup.pulse * 0.1);
        
        // Draw lightning bolt shape
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
}

// Draw particles
function drawParticles() {
    for (const particle of particles) {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

// Update UI
function updateUI() {
    document.getElementById('scoreDisplay').textContent = score;
    document.getElementById('distanceDisplay').textContent = Math.floor(distance);
    document.getElementById('speedDisplay').textContent = gameSpeed.toFixed(1);
}

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Initialize game when page loads
window.addEventListener('load', () => {
    init();
});