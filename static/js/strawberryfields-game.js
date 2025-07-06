// Strawberry Fields Forever - Game Engine
// Mobile-first minigame inspired by The Beatles ( ilove yu john :3)

// Game Configuration 
const GAME_CONFIG = {
    // Canvas and Display
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    
    // Strawberry System
    STRAWBERRY_BASE_SPAWN_RATE: 0.05, // Base probability per frame
    STRAWBERRY_SPAWN_RATE_INCREASE: 0.005, // Increase per level
    STRAWBERRY_MAX_SPAWN_RATE: 0.10, // Maximum spawn rate
    STRAWBERRY_BASE_FALL_SPEED: 6,
    STRAWBERRY_SPEED_INCREASE: 0.9, // Speed increase per level
    STRAWBERRY_MAX_FALL_SPEED: 15, // Maximum fall speed
    STRAWBERRY_SIZE: 30,
    STRAWBERRY_XP_MIN: 10,
    STRAWBERRY_XP_MAX: 20,
    
    // Player System
    PLAYER_SIZE: 60,
    PLAYER_START_LIVES: 10,
    
    // Power System (Double XP Mode)
    POWER_MAX: 100,
    POWER_DRAIN_RATE: 1.5, // Points per frame during double XP mode
    POWER_GAIN_PER_STRAWBERRY: 15,
    
    // XP and Level System
    XP_BASE_LEVEL: 150, // Base XP for level 1
    XP_LEVEL_MULTIPLIER: 20, // Additional XP per level (150 + 20*level)
    LIVES_PER_LEVEL: 1,
    HEAL_PER_LEVEL: 3,
    
    // Streak Bonuses
    STREAK_BONUS_10: 0.03, // 3% at 10 streak
    STREAK_BONUS_30: 0.10, // 10% at 30 streak
    STREAK_BONUS_50: 0.15, // 15% at 50 streak
    
    // Game Physics
    GRAVITY: 0.1,
    BOUNCE_DAMPING: 0.7,
};

// Sprite Constants 
const SPRITES = {
    STRAWBERRY: '/static/img/strawberry.png',
    BASKET_NORMAL: '/static/img/basket-normal.png',
    BASKET_POWER: '/static/img/basket-power.png',
    BACKGROUND: '/static/img/strawberry-field-bg.png',
    PARTICLE: '/static/img/particle.png',
};

// Sound Constants 
const SOUNDS = {
    CATCH: '/static/sounds/catch.mp3',
    MISS: '/static/sounds/miss.mp3',
    POWER_UP: '/static/sounds/power-up.mp3',
    LEVEL_UP: '/static/sounds/level-up.mp3',
    GAME_OVER: '/static/sounds/game-over.mp3',
    BACKGROUND_MUSIC: '/static/sounds/strawberry-fields-forever.mp3',
};

// Audio Manager Class
class AudioManager {
    constructor() {
        this.sounds = {};
        this.musicVolume = 0.3;
        this.sfxVolume = 0.9;
        this.isMuted = false;
        this.backgroundMusic = null;
        this.isLoaded = false;
        
        this.loadSounds();
    }
    
    loadSounds() {
        // Load background music
        this.backgroundMusic = new Audio(SOUNDS.BACKGROUND_MUSIC);
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = this.musicVolume;
        
        // Load sound effects
        Object.keys(SOUNDS).forEach(key => {
            if (key !== 'BACKGROUND_MUSIC') {
                this.sounds[key] = new Audio(SOUNDS[key]);
                this.sounds[key].volume = this.sfxVolume;
            }
        });
        
        this.isLoaded = true;
    }
    
    playSound(soundKey) {
        if (!this.isLoaded || this.isMuted) return;
        
        const sound = this.sounds[soundKey];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => {
                // Handle play promise rejection silently
                console.log('Audio play failed:', e);
            });
        }
    }
    
    startBackgroundMusic() {
        if (!this.isLoaded || this.isMuted) return;
        
        this.backgroundMusic.play().catch(e => {
            console.log('Background music play failed:', e);
        });
    }
    
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }
    
    stopAllSounds() {
        // Stop background music
        this.stopBackgroundMusic();
        
        // Stop all sound effects
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }
    
    pauseBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
        }
    }
    
    resumeBackgroundMusic() {
        if (!this.isMuted && this.backgroundMusic) {
            this.backgroundMusic.play().catch(e => {
                console.log('Background music resume failed:', e);
            });
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.pauseBackgroundMusic();
        } else {
            this.resumeBackgroundMusic();
        }
        
        return this.isMuted;
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = this.musicVolume;
        }
    }
    
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.sfxVolume;
        });
    }
}

// Game State
class GameState {
    constructor() {
        this.reset();
    }
    
    reset() {
        // Player stats
        this.lives = GAME_CONFIG.PLAYER_START_LIVES;
        this.maxLives = GAME_CONFIG.PLAYER_START_LIVES;
        this.xp = 0;
        this.level = 1;
        this.xpRequiredForNextLevel = GAME_CONFIG.XP_BASE_LEVEL + GAME_CONFIG.XP_LEVEL_MULTIPLIER;
        this.totalXPEarned = 0;
        this.score = 0;
        this.streak = 0;
        this.bestStreak = 0;
        
        // Power system
        this.power = 0;
        this.powerMode = false;
        this.powerModeTimer = 0;
        
        // Game state
        this.gameStarted = false;
        this.gameOver = false;
        this.paused = false;
        
        // Arrays
        this.strawberries = [];
        this.particles = [];
        this.xpPopups = [];
        
        // Player position
        this.playerX = GAME_CONFIG.CANVAS_WIDTH / 2;
        this.playerY = GAME_CONFIG.CANVAS_HEIGHT - 80;
        
        // Input state
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.touchX = 0;
        this.touchY = 0;
        
        // Timers
        this.gameTime = 0;
        this.lastStrawberrySpawn = 0;
    }
}

// Strawberry Class
class Strawberry {
    constructor(x, y, level = 1) {
        this.x = x;
        this.y = y;
        this.size = GAME_CONFIG.STRAWBERRY_SIZE;
        
        // Calculate dynamic speed based on level
        const speedIncrease = (level - 1) * GAME_CONFIG.STRAWBERRY_SPEED_INCREASE;
        this.speed = Math.min(
            GAME_CONFIG.STRAWBERRY_BASE_FALL_SPEED + speedIncrease,
            GAME_CONFIG.STRAWBERRY_MAX_FALL_SPEED
        );
        
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        this.xp = Math.floor(Math.random() * (GAME_CONFIG.STRAWBERRY_XP_MAX - GAME_CONFIG.STRAWBERRY_XP_MIN + 1)) + GAME_CONFIG.STRAWBERRY_XP_MIN;
        this.collected = false;
        this.missed = false;
    }
    
    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
        
        // Mark as missed if it falls off screen
        if (this.y > GAME_CONFIG.CANVAS_HEIGHT + this.size) {
            this.missed = true;
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Draw strawberry (placeholder circle for now)
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ff4757';
        ctx.fill();
        
        // Draw strawberry details
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ff6b6b';
        ctx.fill();
        
        // Draw seeds
        ctx.fillStyle = '#2d3436';
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * (this.size / 4);
            const y = Math.sin(angle) * (this.size / 4);
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

// Particle Class for effects
class Particle {
    constructor(x, y, color, size = 3) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8 - 2;
        this.color = color;
        this.size = size;
        this.life = 1;
        this.decay = 0.02;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2; // Gravity
        this.life -= this.decay;
        this.size *= 0.99;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

// XP Popup Class
class XPPopup {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.life = 1;
        this.decay = 0.02;
        this.vy = -2;
        this.isPowerMode = text.includes('2x!');
    }
    
    update() {
        this.y += this.vy;
        this.life -= this.decay;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.font = '16px SuperAdorable';
        ctx.fillStyle = this.isPowerMode ? '#f39c12' : '#00b894';
        ctx.textAlign = 'center';
        
        // Add glow effect for power mode
        if (this.isPowerMode) {
            ctx.shadowColor = '#f39c12';
            ctx.shadowBlur = 10;
        }
        
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}

// Main Game Class
class StrawberryFieldsGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.state = new GameState();
        this.audioManager = new AudioManager();
        
        // Resize canvas for mobile
        this.resizeCanvas();
        
        // Initialize UI elements
        this.initializeUI();
        
        // Set up event listeners
        this.setupControls();
        
        // Start game loop
        this.gameLoop();
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        const containerWidth = container.offsetWidth;
        const aspectRatio = GAME_CONFIG.CANVAS_WIDTH / GAME_CONFIG.CANVAS_HEIGHT;
        
        if (containerWidth < GAME_CONFIG.CANVAS_WIDTH) {
            this.canvas.width = containerWidth;
            this.canvas.height = containerWidth / aspectRatio;
        } else {
            this.canvas.width = GAME_CONFIG.CANVAS_WIDTH;
            this.canvas.height = GAME_CONFIG.CANVAS_HEIGHT;
        }
        
        // Scale factor for mobile
        this.scale = this.canvas.width / GAME_CONFIG.CANVAS_WIDTH;
    }
    
    initializeUI() {
        // Get UI elements
        this.ui = {
            levelDisplay: document.getElementById('levelDisplay'),
            xpDisplay: document.getElementById('xpDisplay'),
            streakDisplay: document.getElementById('streakDisplay'),
            scoreDisplay: document.getElementById('scoreDisplay'),
            powerFill: document.getElementById('powerFill'),
            livesCount: document.getElementById('livesCount'),
            gameOverScreen: document.getElementById('gameOverScreen'),
            startScreen: document.getElementById('startScreen'),
            pauseScreen: document.getElementById('pauseScreen'),
            startButton: document.getElementById('startButton'),
            restartButton: document.getElementById('restartButton'),
            pauseButton: document.getElementById('pauseButton'),
            resumeButton: document.getElementById('resumeButton'),
            restartFromPause: document.getElementById('restartFromPause'),
            audioButton: document.getElementById('audioButton'),
            finalLevel: document.getElementById('finalLevel'),
            finalXP: document.getElementById('finalXP'),
            finalStreak: document.getElementById('finalStreak'),
            finalScore: document.getElementById('finalScore'),
            pauseLevel: document.getElementById('pauseLevel'),
            pauseXP: document.getElementById('pauseXP'),
            pauseStreak: document.getElementById('pauseStreak'),
        };
        
        // Set up button events
        this.ui.startButton.addEventListener('click', () => this.startGame());
        this.ui.restartButton.addEventListener('click', () => this.restartGame());
        this.ui.pauseButton.addEventListener('click', () => this.togglePause());
        this.ui.resumeButton.addEventListener('click', () => this.resumeGame());
        this.ui.restartFromPause.addEventListener('click', () => this.restartFromPause());
        this.ui.audioButton.addEventListener('click', () => this.toggleAudio());
        
        // Update initial UI
        this.updateUI();
        this.updateLives();
        
        // Hide pause button initially
        this.ui.pauseButton.classList.add('hidden');
    }
    
    setupControls() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.state.keys[e.key] = true;
            if (e.key === ' ') {
                e.preventDefault();
                if (!this.state.gameStarted) {
                    this.startGame();
                } else if (this.state.gameStarted && !this.state.gameOver) {
                    this.togglePause();
                }
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                if (!this.state.gameStarted) {
                    this.startGame();
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.state.keys[e.key] = false;
        });
        
        // Mouse controls
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.state.mouseX = (e.clientX - rect.left) / this.scale;
            this.state.mouseY = (e.clientY - rect.top) / this.scale;
        });
        
        // Touch controls
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.state.touchX = (touch.clientX - rect.left) / this.scale;
            this.state.touchY = (touch.clientY - rect.top) / this.scale;
        });
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.state.touchX = (touch.clientX - rect.left) / this.scale;
            this.state.touchY = (touch.clientY - rect.top) / this.scale;
        });
        
        // Prevent context menu on mobile
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }
    
    startGame() {
        this.state.gameStarted = true;
        this.state.gameOver = false;
        this.state.paused = false;
        this.ui.startScreen.classList.add('hide');
        this.ui.pauseButton.classList.remove('hidden');
        this.audioManager.startBackgroundMusic();
        this.updateUI();
    }
    
    restartGame() {
        this.state.reset();
        this.ui.gameOverScreen.classList.remove('show');
        this.ui.startScreen.classList.remove('hide');
        this.ui.pauseButton.classList.add('hidden');
        this.audioManager.stopAllSounds();
        this.updateUI();
        this.updateLives();
    }
    
    togglePause() {
        if (this.state.gameOver || !this.state.gameStarted) return;
        
        if (this.state.paused) {
            this.resumeGame();
        } else {
            this.pauseGame();
        }
    }
    
    pauseGame() {
        this.state.paused = true;
        this.ui.pauseButton.textContent = '▶️';
        this.audioManager.pauseBackgroundMusic();
        
        // Update pause screen stats
        this.ui.pauseLevel.textContent = this.state.level;
        this.ui.pauseXP.textContent = `${this.state.xp}/${this.state.xpRequiredForNextLevel}`;
        this.ui.pauseStreak.textContent = this.state.streak;
        
        // Show pause screen
        this.ui.pauseScreen.classList.add('show');
    }
    
    resumeGame() {
        this.state.paused = false;
        this.ui.pauseButton.textContent = '⏸️';
        this.ui.pauseScreen.classList.remove('show');
        this.audioManager.resumeBackgroundMusic();
    }
    
    restartFromPause() {
        this.state.reset();
        this.ui.pauseScreen.classList.remove('show');
        this.ui.startScreen.classList.remove('hide');
        this.ui.pauseButton.classList.add('hidden');
        this.audioManager.stopAllSounds();
        this.updateUI();
        this.updateLives();
    }
    
    // Dynamic difficulty calculation methods
    getCurrentSpawnRate() {
        const levelIncrease = (this.state.level - 1) * GAME_CONFIG.STRAWBERRY_SPAWN_RATE_INCREASE;
        return Math.min(
            GAME_CONFIG.STRAWBERRY_BASE_SPAWN_RATE + levelIncrease,
            GAME_CONFIG.STRAWBERRY_MAX_SPAWN_RATE
        );
    }
    
    getXPRequiredForLevel(level) {
        return GAME_CONFIG.XP_BASE_LEVEL + (GAME_CONFIG.XP_LEVEL_MULTIPLIER * level);
    }
    
    getXPRequiredForNextLevel() {
        return this.getXPRequiredForLevel(this.state.level);
    }
    
    getTotalXPRequiredForLevel(level) {
        let totalXP = 0;
        for (let i = 1; i <= level; i++) {
            totalXP += this.getXPRequiredForLevel(i);
        }
        return totalXP;
    }
    
    toggleAudio() {
        const isMuted = this.audioManager.toggleMute();
        this.ui.audioButton.textContent = isMuted ? '🔇' : '🔊';
        this.ui.audioButton.classList.toggle('muted', isMuted);
    }
    
    updatePlayer() {
        if (!this.state.gameStarted || this.state.gameOver || this.state.paused) return;
        
        // Mouse/Touch controls (instant follow)
        const targetX = this.state.touchX || this.state.mouseX;
        if (targetX > 0) {
            this.state.playerX = targetX;
        }
        
        // Keyboard controls (for accessibility)
        const keyboardSpeed = 8;
        if (this.state.keys['ArrowLeft'] || this.state.keys['a'] || this.state.keys['A']) {
            this.state.playerX -= keyboardSpeed;
        }
        if (this.state.keys['ArrowRight'] || this.state.keys['d'] || this.state.keys['D']) {
            this.state.playerX += keyboardSpeed;
        }
        
        // Clamp player position
        const halfSize = GAME_CONFIG.PLAYER_SIZE / 2;
        this.state.playerX = Math.max(halfSize, Math.min(GAME_CONFIG.CANVAS_WIDTH - halfSize, this.state.playerX));
        
        // Update power mode (Double XP mode)
        if (this.state.powerMode) {
            this.state.power -= GAME_CONFIG.POWER_DRAIN_RATE;
            if (this.state.power <= 0) {
                this.state.power = 0;
                this.state.powerMode = false;
                this.ui.powerFill.classList.remove('power-mode');
            }
        }
    }
    
    updateStrawberries() {
        if (!this.state.gameStarted || this.state.gameOver || this.state.paused) return;
        
        // Spawn new strawberries with dynamic difficulty
        const currentSpawnRate = this.getCurrentSpawnRate();
        if (Math.random() < currentSpawnRate) {
            const x = Math.random() * (GAME_CONFIG.CANVAS_WIDTH - GAME_CONFIG.STRAWBERRY_SIZE) + GAME_CONFIG.STRAWBERRY_SIZE / 2;
            this.state.strawberries.push(new Strawberry(x, -GAME_CONFIG.STRAWBERRY_SIZE, this.state.level));
        }
        
        // Update existing strawberries
        for (let i = this.state.strawberries.length - 1; i >= 0; i--) {
            const strawberry = this.state.strawberries[i];
            strawberry.update();
            
            // Check for collision with player
            if (!strawberry.collected && !strawberry.missed) {
                const dx = strawberry.x - this.state.playerX;
                const dy = strawberry.y - this.state.playerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < (strawberry.size + GAME_CONFIG.PLAYER_SIZE) / 2) {
                    this.collectStrawberry(strawberry, i);
                    continue;
                }
            }
            
            // Remove missed strawberries
            if (strawberry.missed && !strawberry.collected) {
                this.missStrawberry(strawberry);
                this.state.strawberries.splice(i, 1);
            } else if (strawberry.y > GAME_CONFIG.CANVAS_HEIGHT + 100) {
                this.state.strawberries.splice(i, 1);
            }
        }
    }
    
    collectStrawberry(strawberry, index) {
        strawberry.collected = true;
        
        // Calculate XP with streak bonuses
        let xp = strawberry.xp;
        let bonusMultiplier = 1;
        
        if (this.state.streak >= 50) {
            bonusMultiplier += GAME_CONFIG.STREAK_BONUS_50;
        } else if (this.state.streak >= 30) {
            bonusMultiplier += GAME_CONFIG.STREAK_BONUS_30;
        } else if (this.state.streak >= 10) {
            bonusMultiplier += GAME_CONFIG.STREAK_BONUS_10;
        }
        
        xp = Math.floor(xp * bonusMultiplier);
        
        // Apply Power Mode (Double XP)
        if (this.state.powerMode) {
            xp *= 2;
        }
        
        // Add XP and update score
        this.state.xp += xp;
        this.state.totalXPEarned += xp;
        this.state.score += xp;
        this.state.streak++;
        
        if (this.state.streak > this.state.bestStreak) {
            this.state.bestStreak = this.state.streak;
        }
        
        // Update power
        this.state.power = Math.min(GAME_CONFIG.POWER_MAX, this.state.power + GAME_CONFIG.POWER_GAIN_PER_STRAWBERRY);
        
        // Activate power mode if at max
        if (this.state.power >= GAME_CONFIG.POWER_MAX && !this.state.powerMode) {
            this.state.powerMode = true;
            this.ui.powerFill.classList.add('power-mode');
            this.audioManager.playSound('POWER_UP');
        }
        
        // Check for level up with new formula
        if (this.state.xp >= this.state.xpRequiredForNextLevel) {
            this.levelUp();
        }
        
        // Create particles (golden particles if in power mode)
        const particleColor = this.state.powerMode ? '#f39c12' : '#ff6b6b';
        for (let i = 0; i < 8; i++) {
            this.state.particles.push(new Particle(strawberry.x, strawberry.y, particleColor));
        }
        
        // Create XP popup (show double XP indicator)
        const xpText = this.state.powerMode ? `+${xp} XP (2x!)` : `+${xp} XP`;
        this.state.xpPopups.push(new XPPopup(strawberry.x, strawberry.y, xpText));
        
        // Remove strawberry
        this.state.strawberries.splice(index, 1);
        
        // Play catch sound
        this.audioManager.playSound('CATCH');
        
        // Update UI
        this.updateUI();
    }
    
    missStrawberry(strawberry) {
        // Lose life
        this.state.lives--;
        this.state.streak = 0;
        
        // Play miss sound
        this.audioManager.playSound('MISS');
        
        // Create miss particles
        for (let i = 0; i < 5; i++) {
            this.state.particles.push(new Particle(strawberry.x, strawberry.y, '#636e72'));
        }
        
        // Update UI
        this.updateUI();
        this.updateLives();
        
        // Check for game over
        if (this.state.lives <= 0) {
            this.gameOver();
        }
    }
    
    levelUp() {
        // Subtract XP used for this level
        this.state.xp -= this.state.xpRequiredForNextLevel;
        
        // Increase level
        this.state.level++;
        
        // Calculate new XP requirement for next level (150 + 20*level)
        this.state.xpRequiredForNextLevel = this.getXPRequiredForLevel(this.state.level);
        
        // Increase max lives and heal
        this.state.maxLives += GAME_CONFIG.LIVES_PER_LEVEL;
        this.state.lives = Math.min(this.state.maxLives, this.state.lives + GAME_CONFIG.HEAL_PER_LEVEL);
        
        // Play level up sound
        this.audioManager.playSound('LEVEL_UP');
        
        // Level up effect
        this.ui.levelDisplay.classList.add('level-up-effect');
        setTimeout(() => {
            this.ui.levelDisplay.classList.remove('level-up-effect');
        }, 600);
        
        // Check if we can level up again (in case of lots of XP at once)
        if (this.state.xp >= this.state.xpRequiredForNextLevel) {
            this.levelUp();
        }
        
        // Update UI
        this.updateUI();
        this.updateLives();
    }
    
    updateParticles() {
        if (this.state.paused) return;
        
        for (let i = this.state.particles.length - 1; i >= 0; i--) {
            const particle = this.state.particles[i];
            particle.update();
            
            if (particle.life <= 0) {
                this.state.particles.splice(i, 1);
            }
        }
    }
    
    updateXPPopups() {
        if (this.state.paused) return;
        
        for (let i = this.state.xpPopups.length - 1; i >= 0; i--) {
            const popup = this.state.xpPopups[i];
            popup.update();
            
            if (popup.life <= 0) {
                this.state.xpPopups.splice(i, 1);
            }
        }
    }
    
    gameOver() {
        this.state.gameOver = true;
        this.state.paused = false;
        
        // Stop background music and play game over sound
        this.audioManager.stopBackgroundMusic();
        this.audioManager.playSound('GAME_OVER');
        
        // Hide pause button
        this.ui.pauseButton.classList.add('hidden');
        
        // Update final stats
        this.ui.finalLevel.textContent = this.state.level;
        this.ui.finalXP.textContent = this.state.totalXPEarned;
        this.ui.finalStreak.textContent = this.state.bestStreak;
        this.ui.finalScore.textContent = this.state.score;
        
        // Show game over screen
        this.ui.gameOverScreen.classList.add('show');
    }
    
    updateUI() {
        this.ui.levelDisplay.textContent = this.state.level;
        this.ui.xpDisplay.textContent = `${this.state.xp}/${this.state.xpRequiredForNextLevel}`;
        this.ui.streakDisplay.textContent = this.state.streak;
        this.ui.scoreDisplay.textContent = this.state.score;
        
        // Update power bar
        const powerPercentage = (this.state.power / GAME_CONFIG.POWER_MAX) * 100;
        this.ui.powerFill.style.width = powerPercentage + '%';
        
        // Streak effect
        if (this.state.streak > 0 && this.state.streak % 10 === 0) {
            this.ui.streakDisplay.classList.add('streak-effect');
            setTimeout(() => {
                this.ui.streakDisplay.classList.remove('streak-effect');
            }, 500);
        }
    }
    
    updateLives() {
        this.ui.livesCount.textContent = this.state.lives;
        
        // Add warning effect when lives are low
        if (this.state.lives <= 3) {
            this.ui.livesCount.style.color = '#ff6b6b';
            this.ui.livesCount.style.animation = 'lowLivesWarning 0.5s ease-in-out infinite alternate';
        } else {
            this.ui.livesCount.style.color = '#e17055';
            this.ui.livesCount.style.animation = 'none';
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Scale context for mobile
        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);
        
        // Draw background
        this.drawBackground();
        
        if (this.state.gameStarted && !this.state.gameOver) {
            // Draw game elements
            this.drawStrawberries();
            this.drawPlayer();
            this.drawParticles();
            this.drawXPPopups();
        }
        
        this.ctx.restore();
    }
    
    drawBackground() {
        // Sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.CANVAS_HEIGHT);
        gradient.addColorStop(0, '#74b9ff');
        gradient.addColorStop(0.5, '#a8daff');
        gradient.addColorStop(1, '#dceeff');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
        
        // Ground
        this.ctx.fillStyle = '#00b894';
        this.ctx.fillRect(0, GAME_CONFIG.CANVAS_HEIGHT - 40, GAME_CONFIG.CANVAS_WIDTH, 40);
        
        // Grass details
        this.ctx.fillStyle = '#00a085';
        for (let i = 0; i < GAME_CONFIG.CANVAS_WIDTH; i += 20) {
            this.ctx.fillRect(i, GAME_CONFIG.CANVAS_HEIGHT - 40, 10, 40);
        }
    }
    
    drawStrawberries() {
        this.state.strawberries.forEach(strawberry => {
            strawberry.draw(this.ctx);
        });
    }
    
    drawPlayer() {
        this.ctx.save();
        this.ctx.translate(this.state.playerX, this.state.playerY);
        
        // Draw basket (placeholder)
        const size = GAME_CONFIG.PLAYER_SIZE;
        
        // Basket color based on power mode (golden for double XP)
        const basketColor = this.state.powerMode ? '#f39c12' : '#8b4513';
        const rimColor = this.state.powerMode ? '#f1c40f' : '#654321';
        
        // Draw basket body
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size / 2, 0, Math.PI);
        this.ctx.fillStyle = basketColor;
        this.ctx.fill();
        
        // Draw basket rim
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, size / 2, size / 8, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = rimColor;
        this.ctx.fill();
        
        // Draw basket pattern
        this.ctx.strokeStyle = rimColor;
        this.ctx.lineWidth = 2;
        for (let i = -size / 2; i < size / 2; i += 8) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, -size / 8);
            this.ctx.lineTo(i, size / 4);
            this.ctx.stroke();
        }
        
        // Power mode glow (golden for double XP)
        if (this.state.powerMode) {
            this.ctx.shadowColor = '#f39c12';
            this.ctx.shadowBlur = 20;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, size / 2 + 5, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    drawParticles() {
        this.state.particles.forEach(particle => {
            particle.draw(this.ctx);
        });
    }
    
    drawXPPopups() {
        this.state.xpPopups.forEach(popup => {
            popup.draw(this.ctx);
        });
    }
    
    gameLoop() {
        // Update game state
        this.updatePlayer();
        this.updateStrawberries();
        this.updateParticles();
        this.updateXPPopups();
        
        // Draw everything
        this.draw();
        
        // Continue loop
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new StrawberryFieldsGame();
    
    // Make game globally accessible for debugging
    window.strawberryGame = game;
}); 