/**
 * Parallax Void Background System
 * Creates a dynamic starfield with multiple layers and black hole effects
 * Themed around Dante's Inferno and black holes
 */

class ParallaxVoid {
    constructor() {
        this.container = null;
        this.layers = [];
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;

        this.createContainer();
        this.createStarLayers();
        this.createBlackHoleEffects();
        this.bindScrollEvents();
        this.isInitialized = true;
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'parallax-container';
        document.body.insertBefore(this.container, document.body.firstChild);
    }

    createStarLayers() {
        const layerConfigs = [
            { className: 'stars-layer-1', starCount: 150, starTypes: ['small', 'medium'] },
            { className: 'stars-layer-2', starCount: 100, starTypes: ['small', 'medium', 'large'] },
            { className: 'stars-layer-3', starCount: 80, starTypes: ['medium', 'large'] }
        ];

        layerConfigs.forEach((config, index) => {
            const layer = document.createElement('div');
            layer.className = `stars-layer ${config.className}`;

            for (let i = 0; i < config.starCount; i++) {
                const star = this.createStar(config.starTypes);
                layer.appendChild(star);
            }

            this.container.appendChild(layer);
            this.layers.push(layer);
        });
    }

    createStar(starTypes) {
        const star = document.createElement('div');
        const starType = starTypes[Math.floor(Math.random() * starTypes.length)];

        star.className = `star star-${starType}`;

        // Random position
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';

        // Random animation delay for variety
        star.style.animationDelay = Math.random() * 3 + 's';

        // Subtle random color variations in the red spectrum
        const redIntensity = 200 + Math.floor(Math.random() * 55); // 200-255
        const colorVariation = Math.random() * 0.3 + 0.7; // 0.7-1.0
        star.style.filter = `hue-rotate(${Math.random() * 20 - 10}deg) brightness(${colorVariation})`;

        return star;
    }

    createBlackHoleEffects() {
        // Main black hole distortion (gravitational lensing)
        const blackHole = document.createElement('div');
        blackHole.className = 'black-hole-distortion';
        this.container.appendChild(blackHole);

        // Event horizon - Interstellar style
        const eventHorizon = document.createElement('div');
        eventHorizon.className = 'event-horizon';
        this.container.appendChild(eventHorizon);

        // Additional subtle distortion effects
        this.createGravitationalLensing();
    }

    createGravitationalLensing() {
        // Create subtle gravitational lensing effects around the black hole
        for (let i = 0; i < 3; i++) {
            const lens = document.createElement('div');
            lens.style.position = 'absolute';
            lens.style.top = (20 + i * 5) + '%';
            lens.style.right = (15 + i * 3) + '%';
            lens.style.width = (80 + i * 40) + 'px';
            lens.style.height = (80 + i * 40) + 'px';
            lens.style.borderRadius = '50%';
            lens.style.border = `1px solid rgba(255, 68, 68, ${0.1 - i * 0.02})`;
            lens.style.animation = `blackHoleRotation ${40 + i * 20}s linear infinite reverse`;
            lens.style.filter = 'blur(2px)';
            this.container.appendChild(lens);
        }
    }

    bindScrollEvents() {
        let ticking = false;

        const updateParallax = () => {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollPercent = scrollY / (documentHeight - windowHeight);

            this.layers.forEach((layer, index) => {
                const speed = (index + 1) * 0.5;
                const yPos = scrollY * speed;
                const rotation = scrollPercent * 360 * (index + 1);

                layer.style.transform = `translate3d(0, ${yPos}px, 0) rotate(${rotation}deg)`;
            });

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
        window.addEventListener('resize', () => {
            requestTick();
        }, { passive: true });
    }

    // Method to add more stars dynamically (for performance or effects)
    addDynamicStars(count = 20) {
        if (this.layers.length === 0) return;

        const randomLayer = this.layers[Math.floor(Math.random() * this.layers.length)];
        const starTypes = ['small', 'medium', 'large'];

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const star = this.createStar(starTypes);
                star.style.opacity = '0';
                star.style.transition = 'opacity 2s ease-in';
                randomLayer.appendChild(star);

                requestAnimationFrame(() => {
                    star.style.opacity = '1';
                });
            }, i * 100);
        }
    }

    // Performance optimization for mobile devices
    optimizeForMobile() {
        if (window.innerWidth <= 768) {
            // Reduce star count for mobile
            this.layers.forEach(layer => {
                const stars = layer.querySelectorAll('.star');
                stars.forEach((star, index) => {
                    if (index % 2 === 0) {
                        star.style.display = 'none';
                    }
                });
            });

            // Simplify animations
            document.documentElement.style.setProperty('--animation-duration-multiplier', '2');
        }
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.isInitialized = false;
    }
}

// Initialize the parallax void system when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const parallaxVoid = new ParallaxVoid();

    // Optimize for mobile devices
    parallaxVoid.optimizeForMobile();

    // Add some dynamic stars periodically for enhanced effect
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance every interval
            parallaxVoid.addDynamicStars(5);
        }
    }, 30000); // Every 30 seconds

    // Store instance globally for debugging/interaction
    window.parallaxVoid = parallaxVoid;
});

// Handle visibility change to pause animations when tab is not active
document.addEventListener('visibilitychange', () => {
    const container = document.querySelector('.parallax-container');
    if (container) {
        if (document.hidden) {
            container.style.animationPlayState = 'paused';
            container.querySelectorAll('*').forEach(el => {
                el.style.animationPlayState = 'paused';
            });
        } else {
            container.style.animationPlayState = 'running';
            container.querySelectorAll('*').forEach(el => {
                el.style.animationPlayState = 'running';
            });
        }
    }
});