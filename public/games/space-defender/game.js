// Game constants
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
const FPS = 60;

// Colors
const COLORS = {
    BLACK: '#000000',
    WHITE: '#ffffff',
    RED: '#ff0000',
    GREEN: '#00ff00',
    BLUE: '#0000ff',
    YELLOW: '#ffff00',
    PURPLE: '#800080',
    CYAN: '#00ffff',
    ORANGE: '#ffa500'
};

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 40;
        this.speed = 8;
        this.color = COLORS.CYAN;
    }

    move(keys) {
        if (keys['ArrowLeft'] && this.x > 0) {
            this.x -= this.speed;
        }
        if (keys['ArrowRight'] && this.x < SCREEN_WIDTH - this.width) {
            this.x += this.speed;
        }
        if (keys['ArrowUp'] && this.y > 0) {
            this.y -= this.speed;
        }
        if (keys['ArrowDown'] && this.y < SCREEN_HEIGHT - this.height) {
            this.y += this.speed;
        }
    }

    draw(ctx) {
        // Draw spaceship body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width / 4, this.y + this.height - 10);
        ctx.lineTo(this.x + 3 * this.width / 4, this.y + this.height - 10);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        // Draw engine glow
        ctx.fillStyle = COLORS.YELLOW;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height + 5, 8, 0, 2 * Math.PI);
        ctx.fill();
    }

    getRect() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

class FallingObject {
    constructor(x, y, objType) {
        this.x = x;
        this.y = y;
        this.type = objType; // 'powerup', 'asteroid', 'coin'
        this.speed = Math.random() * 5 + 3; // 3-8
        this.size = Math.random() * 20 + 20; // 20-40
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 10; // -5 to 5

        if (objType === 'powerup') {
            this.color = COLORS.GREEN;
            this.points = 50;
        } else if (objType === 'coin') {
            this.color = COLORS.YELLOW;
            this.points = 10;
        } else { // asteroid
            this.color = COLORS.RED;
            this.points = -20;
        }
    }

    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);

        if (this.type === 'powerup') {
            // Draw power-up as a glowing cross
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 8, -this.size / 2, this.size / 4, this.size);
            ctx.fillRect(-this.size / 2, -this.size / 8, this.size, this.size / 4);
            
            // Add glow effect
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2 + 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        } else if (this.type === 'coin') {
            // Draw coin as a rotating circle
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.fillStyle = COLORS.ORANGE;
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2 - 5, 0, 2 * Math.PI);
            ctx.fill();
        } else { // asteroid
            // Draw asteroid as an irregular polygon
            ctx.fillStyle = this.color;
            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
                const angle = (i * 45) * Math.PI / 180;
                const radius = this.size / 2 + (Math.random() - 0.5) * 10;
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

    getRect() {
        return {
            x: this.x - this.size / 2,
            y: this.y - this.size / 2,
            width: this.size,
            height: this.size
        };
    }

    isOffScreen() {
        return this.y > SCREEN_HEIGHT + 50;
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 10; // -5 to 5
        this.vy = Math.random() * -6 - 2; // -8 to -2
        this.color = color;
        this.life = 30;
        this.maxLife = 30;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2; // gravity
        this.life--;
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        const size = Math.max(1, 5 * alpha);
        
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }

    isDead() {
        return this.life <= 0;
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.player = new Player(SCREEN_WIDTH / 2 - 30, SCREEN_HEIGHT - 100);
        this.fallingObjects = [];
        this.particles = [];
        this.score = 0;
        this.lives = 3;
        this.spawnTimer = 0;
        this.spawnDelay = 60; // frames
        this.gameOver = false;
        this.keys = {};
        this.stars = [];
        
        // Generate stars
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * SCREEN_WIDTH,
                y: Math.random() * SCREEN_HEIGHT
            });
        }

        this.setupEventListeners();
        this.gameLoop();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            if (this.gameOver) {
                if (e.code === 'KeyR') {
                    this.resetGame();
                } else if (e.code === 'KeyQ') {
                    // In a web context, we can't really quit, so just reset
                    this.resetGame();
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    spawnObject() {
        const x = Math.random() * (SCREEN_WIDTH - 100) + 50;
        const y = -50;

        // Determine object type based on probability
        const rand = Math.random();
        let objType;
        if (rand < 0.4) {
            objType = 'coin';
        } else if (rand < 0.6) {
            objType = 'powerup';
        } else {
            objType = 'asteroid';
        }

        this.fallingObjects.push(new FallingObject(x, y, objType));
    }

    createParticles(x, y, color, count = 10) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    handleCollision(obj) {
        if (obj.type === 'asteroid') {
            this.lives--;
            this.createParticles(obj.x, obj.y, COLORS.RED, 15);
        } else {
            this.score += obj.points;
            const color = obj.type === 'powerup' ? COLORS.GREEN : COLORS.YELLOW;
            this.createParticles(obj.x, obj.y, color, 8);
        }
    }

    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    drawStars() {
        this.ctx.fillStyle = COLORS.WHITE;
        for (const star of this.stars) {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, 1, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }

    drawHUD() {
        this.ctx.fillStyle = COLORS.WHITE;
        this.ctx.font = '24px Courier New';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
        this.ctx.fillText(`Lives: ${this.lives}`, 10, 60);
    }

    showGameOver() {
        document.getElementById('finalScore').textContent = `Final Score: ${this.score}`;
        document.getElementById('gameOver').style.display = 'block';
    }

    hideGameOver() {
        document.getElementById('gameOver').style.display = 'none';
    }

    resetGame() {
        this.player = new Player(SCREEN_WIDTH / 2 - 30, SCREEN_HEIGHT - 100);
        this.fallingObjects = [];
        this.particles = [];
        this.score = 0;
        this.lives = 3;
        this.spawnTimer = 0;
        this.spawnDelay = 60;
        this.gameOver = false;
        this.hideGameOver();
    }

    update() {
        if (!this.gameOver) {
            // Handle input
            this.player.move(this.keys);

            // Spawn objects
            this.spawnTimer++;
            if (this.spawnTimer >= this.spawnDelay) {
                this.spawnObject();
                this.spawnTimer = 0;
                // Gradually increase difficulty
                if (this.spawnDelay > 20) {
                    this.spawnDelay -= 0.1;
                }
            }

            // Update falling objects
            for (let i = this.fallingObjects.length - 1; i >= 0; i--) {
                const obj = this.fallingObjects[i];
                obj.update();
                
                if (obj.isOffScreen()) {
                    this.fallingObjects.splice(i, 1);
                } else if (this.checkCollision(this.player.getRect(), obj.getRect())) {
                    this.handleCollision(obj);
                    this.fallingObjects.splice(i, 1);
                }
            }

            // Update particles
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const particle = this.particles[i];
                particle.update();
                if (particle.isDead()) {
                    this.particles.splice(i, 1);
                }
            }

            // Check game over
            if (this.lives <= 0) {
                this.gameOver = true;
                this.showGameOver();
            }
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = COLORS.BLACK;
        this.ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        // Draw stars
        this.drawStars();

        if (!this.gameOver) {
            // Draw player
            this.player.draw(this.ctx);

            // Draw falling objects
            for (const obj of this.fallingObjects) {
                obj.draw(this.ctx);
            }

            // Draw particles
            for (const particle of this.particles) {
                particle.draw(this.ctx);
            }

            // Draw HUD
            this.drawHUD();
        }
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
});