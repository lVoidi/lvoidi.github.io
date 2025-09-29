/**
 * Cosmic Algorithm Parallax System - El Cosmos de Algoritmos
 * Creates a majestic cosmic visualization representing the vastness of algorithmic knowledge
 * Features: omniscient black hole, neural nebulae, scientific constellations, floating texts
 */

class CosmicAlgorithms {
    constructor() {
        this.container = null;
        this.stars = [];
        this.nebulae = [];
        this.constellations = [];
        this.texts = [];
        this.isInitialized = false;

        // Ecuaciones y textos científicos
        this.equations = [
            'O(log n)', 'Θ(n²)', 'Ω(n)', 'P = NP?', 'f(x) → ∞',
            '∀x ∈ S', '∃y ∈ T', '∫₀^∞ e^(-x)', '∑ᵢ₌₁ⁿ i²', '∏ᵢ₌₁ⁿ i!',
            'lim(n→∞)', '∇f(x,y)', '∂²f/∂x²', 'det(A) ≠ 0', 'rank(M)',
            'gcd(a,b)', 'lcm(x,y)', '2^n - 1', 'log₂(n!)', 'n choose k'
        ];

        this.latinTexts = [
            'Scientia potentia est', 'Cogito ergo sum', 'Veritas vincit',
            'Sapientia et virtus', 'Ars longa vita brevis', 'Per aspera ad astra',
            'Veni vidi vici', 'Alea iacta est', 'Memento mori',
            'Carpe diem', 'Audentes fortuna iuvat', 'Fiat lux',
            'E pluribus unum', 'Ad infinitum', 'Tabula rasa',
            'Terra incognita', 'Deus ex machina', 'Magna carta'
        ];

        this.init();
    }

    init() {
        if (this.isInitialized) return;

        this.createContainer();
        this.createCosmicLayers();
        this.createOmniscientEye();
        this.generateNeuralNebulae();
        this.generateCosmicStars();
        this.createScientificConstellations();
        this.generateFloatingTexts();
        this.bindScrollEvents();
        this.isInitialized = true;
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'cosmic-algorithm-container';
        document.body.insertBefore(this.container, document.body.firstChild);
    }

    createCosmicLayers() {
        const layers = [
            'cosmic-layer-nebulae',
            'cosmic-layer-stars',
            'cosmic-layer-constellations',
            'cosmic-layer-texts'
        ];

        layers.forEach(layerClass => {
            const layer = document.createElement('div');
            layer.className = `cosmic-layer ${layerClass}`;
            this.container.appendChild(layer);
        });
    }

    createOmniscientEye() {
        // Crear el agujero negro central como ojo omnisciente mejorado
        const eye = document.createElement('div');
        eye.className = 'omniscient-eye';

        // Lente gravitacional externa
        const gravitationalLensing = document.createElement('div');
        gravitationalLensing.className = 'gravitational-lensing';
        eye.appendChild(gravitationalLensing);

        // Horizonte de eventos
        const eventHorizon = document.createElement('div');
        eventHorizon.className = 'event-horizon';
        eye.appendChild(eventHorizon);

        // Disco de acreción naranja (externo)
        const diskGolden = document.createElement('div');
        diskGolden.className = 'accretion-disk-golden';
        eye.appendChild(diskGolden);

        // Disco de acreción rojo (interno)
        const diskRed = document.createElement('div');
        diskRed.className = 'accretion-disk-red';
        eye.appendChild(diskRed);

        // Núcleo del agujero negro (al final para que esté encima)
        const core = document.createElement('div');
        core.className = 'black-hole-core';
        eye.appendChild(core);

        this.container.appendChild(eye);
    }

    generateNeuralNebulae() {
        const nebulaLayer = this.container.querySelector('.cosmic-layer-nebulae');

        // Crear nebulosas principales
        for (let i = 1; i <= 3; i++) {
            const nebula = document.createElement('div');
            nebula.className = `neural-nebula neural-nebula-${i}`;
            nebulaLayer.appendChild(nebula);
            this.nebulae.push(nebula);

            // Agregar conexiones neurales a cada nebulosa
            this.createNeuralConnections(nebula, 8);
        }

        // Crear nebulosas adicionales más pequeñas
        for (let i = 0; i < 5; i++) {
            const smallNebula = document.createElement('div');
            smallNebula.className = 'neural-nebula';
            smallNebula.style.width = (150 + Math.random() * 100) + 'px';
            smallNebula.style.height = (100 + Math.random() * 80) + 'px';
            smallNebula.style.left = Math.random() * 100 + '%';
            smallNebula.style.top = Math.random() * 100 + '%';
            smallNebula.style.animationDelay = Math.random() * 8 + 's';

            nebulaLayer.appendChild(smallNebula);
            this.createNeuralConnections(smallNebula, 4);
        }
    }

    createNeuralConnections(nebula, count) {
        for (let i = 0; i < count; i++) {
            const connection = document.createElement('div');
            connection.className = 'neural-connection';

            const length = 50 + Math.random() * 150;
            const angle = Math.random() * 360;

            connection.style.width = length + 'px';
            connection.style.left = '50%';
            connection.style.top = '50%';
            connection.style.transform = `rotate(${angle}deg)`;
            connection.style.animationDelay = Math.random() * 6 + 's';

            nebula.appendChild(connection);
        }
    }

    generateCosmicStars() {
        const starLayer = this.container.querySelector('.cosmic-layer-stars');
        const starCount = 80;

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            const types = ['white', 'golden'];
            const sizes = ['small', 'medium', 'large'];

            const type = types[Math.floor(Math.random() * types.length)];
            const size = sizes[Math.floor(Math.random() * sizes.length)];

            star.className = `cosmic-star star-${type} star-${size}`;

            // Posicionamiento aleatorio
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 4 + 's';
            star.style.animationDuration = (3 + Math.random() * 2) + 's';

            // Algunas estrellas con brillo extra
            if (Math.random() > 0.8) {
                star.style.filter = `brightness(${1.5 + Math.random()})`;
            }

            starLayer.appendChild(star);
            this.stars.push(star);
        }
    }

    createScientificConstellations() {
        const constellationLayer = this.container.querySelector('.cosmic-layer-constellations');

        // Constelación del átomo
        const atomConstellation = this.createAtomConstellation();
        atomConstellation.className += ' constellation-atom';
        constellationLayer.appendChild(atomConstellation);

        // Constelación del ADN
        const dnaConstellation = this.createDNAConstellation();
        dnaConstellation.className += ' constellation-dna';
        constellationLayer.appendChild(dnaConstellation);

        // Constelaciones adicionales más pequeñas
        for (let i = 0; i < 3; i++) {
            const miniConstellation = this.createMiniConstellation();
            miniConstellation.style.left = Math.random() * 100 + '%';
            miniConstellation.style.top = Math.random() * 100 + '%';
            constellationLayer.appendChild(miniConstellation);
        }
    }

    createAtomConstellation() {
        const atom = document.createElement('div');
        atom.className = 'constellation';

        // Núcleo central
        const nucleus = document.createElement('div');
        nucleus.className = 'cosmic-star star-golden star-medium';
        nucleus.style.position = 'absolute';
        nucleus.style.left = '50%';
        nucleus.style.top = '50%';
        nucleus.style.transform = 'translate(-50%, -50%)';
        atom.appendChild(nucleus);

        // Electrones orbitales
        const orbits = [60, 90, 120];
        orbits.forEach((radius, index) => {
            for (let i = 0; i < 3 + index; i++) {
                const electron = document.createElement('div');
                electron.className = 'cosmic-star star-white star-small';
                electron.style.position = 'absolute';

                const angle = (i / (3 + index)) * 2 * Math.PI;
                const x = 50 + Math.cos(angle) * (radius / 4);
                const y = 50 + Math.sin(angle) * (radius / 4);

                electron.style.left = x + '%';
                electron.style.top = y + '%';

                atom.appendChild(electron);

                // Líneas orbitales
                if (i === 0) {
                    const orbital = document.createElement('div');
                    orbital.className = 'constellation-line';
                    orbital.style.width = radius + 'px';
                    orbital.style.left = '50%';
                    orbital.style.top = '50%';
                    orbital.style.transform = `translate(-50%, -50%) rotate(${index * 45}deg)`;
                    orbital.style.borderRadius = '50%';
                    orbital.style.border = '1px solid rgba(255, 215, 0, 0.3)';
                    orbital.style.background = 'none';
                    atom.appendChild(orbital);
                }
            }
        });

        return atom;
    }

    createDNAConstellation() {
        const dna = document.createElement('div');
        dna.className = 'constellation';

        // Crear hélice doble
        for (let i = 0; i < 20; i++) {
            const height = (i / 19) * 180;
            const angle1 = (i / 19) * Math.PI * 4;
            const angle2 = angle1 + Math.PI;

            // Primera cadena
            const base1 = document.createElement('div');
            base1.className = 'cosmic-star star-golden star-small';
            base1.style.position = 'absolute';
            base1.style.left = (50 + Math.cos(angle1) * 30) + '%';
            base1.style.top = (10 + height / 2) + '%';
            dna.appendChild(base1);

            // Segunda cadena
            const base2 = document.createElement('div');
            base2.className = 'cosmic-star star-white star-small';
            base2.style.position = 'absolute';
            base2.style.left = (50 + Math.cos(angle2) * 30) + '%';
            base2.style.top = (10 + height / 2) + '%';
            dna.appendChild(base2);

            // Conexiones entre cadenas
            if (i % 3 === 0) {
                const connection = document.createElement('div');
                connection.className = 'constellation-line';
                connection.style.width = '60%';
                connection.style.left = (20 + Math.cos(angle1) * 30) + '%';
                connection.style.top = (10 + height / 2) + '%';
                connection.style.transform = `rotate(${Math.cos(angle1) * 30}deg)`;
                dna.appendChild(connection);
            }
        }

        return dna;
    }

    createMiniConstellation() {
        const mini = document.createElement('div');
        mini.className = 'constellation';
        mini.style.width = '100px';
        mini.style.height = '100px';

        // Patrón simple de estrellas conectadas
        const positions = [
            { x: 20, y: 20 }, { x: 80, y: 30 }, { x: 60, y: 70 }, { x: 30, y: 80 }
        ];

        positions.forEach((pos, index) => {
            const star = document.createElement('div');
            star.className = 'cosmic-star star-white star-small';
            star.style.position = 'absolute';
            star.style.left = pos.x + '%';
            star.style.top = pos.y + '%';
            mini.appendChild(star);

            // Conectar con la siguiente estrella
            if (index < positions.length - 1) {
                const line = document.createElement('div');
                line.className = 'constellation-line';
                const nextPos = positions[index + 1];
                const dx = nextPos.x - pos.x;
                const dy = nextPos.y - pos.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                line.style.width = length + '%';
                line.style.left = pos.x + '%';
                line.style.top = pos.y + '%';
                line.style.transform = `rotate(${angle}deg)`;
                mini.appendChild(line);
            }
        });

        return mini;
    }

    generateFloatingTexts() {
        const textLayer = this.container.querySelector('.cosmic-layer-texts');

        // Ecuaciones matemáticas
        this.equations.forEach((equation, index) => {
            const textElement = document.createElement('div');
            textElement.className = 'cosmic-text';
            textElement.textContent = equation;

            textElement.style.left = Math.random() * 100 + '%';
            textElement.style.top = Math.random() * 100 + '%';
            textElement.style.animationDelay = (index * 0.8) + 's';
            textElement.style.fontSize = (0.6 + Math.random() * 0.4) + 'rem';

            textLayer.appendChild(textElement);
            this.texts.push(textElement);
        });

        // Textos en latín
        this.latinTexts.slice(0, 12).forEach((text, index) => {
            const textElement = document.createElement('div');
            textElement.className = 'cosmic-text latin-text';
            textElement.textContent = text;

            textElement.style.left = Math.random() * 100 + '%';
            textElement.style.top = Math.random() * 100 + '%';
            textElement.style.animationDelay = (index * 1.2 + 8) + 's';
            textElement.style.fontSize = (0.5 + Math.random() * 0.3) + 'rem';

            textLayer.appendChild(textElement);
            this.texts.push(textElement);
        });
    }

    bindScrollEvents() {
        let ticking = false;

        const updateParallax = () => {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollPercent = scrollY / (documentHeight - windowHeight);

            // Update cosmic layers
            const layers = {
                nebulae: this.container.querySelector('.cosmic-layer-nebulae'),
                stars: this.container.querySelector('.cosmic-layer-stars'),
                constellations: this.container.querySelector('.cosmic-layer-constellations'),
                texts: this.container.querySelector('.cosmic-layer-texts')
            };

            if (layers.nebulae) {
                const speed = scrollY * 0.2;
                layers.nebulae.style.transform = `translate3d(0, ${speed}px, 0) rotateZ(${scrollPercent * 20}deg)`;
            }

            if (layers.stars) {
                const speed = scrollY * 0.4;
                layers.stars.style.transform = `translate3d(0, ${speed}px, 0) scale(${1 + scrollPercent * 0.1})`;
            }

            if (layers.constellations) {
                const speed = scrollY * 0.6;
                layers.constellations.style.transform = `translate3d(0, ${speed}px, 0) rotateY(${scrollPercent * 30}deg)`;
            }

            if (layers.texts) {
                const speed = scrollY * 0.8;
                layers.texts.style.transform = `translate3d(0, ${speed}px, 0)`;
            }

            // Update omniscient eye based on scroll
            const eye = this.container.querySelector('.omniscient-eye');
            if (eye) {
                const eyeIntensity = 1 + scrollPercent * 0.5;
                eye.style.filter = `brightness(${eyeIntensity})`;
            }

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
        window.addEventListener('resize', requestTick, { passive: true });
    }

    // Add new cosmic elements dynamically
    addCosmicEvent() {
        // Agregar una nueva estrella fugaz ocasionalmente
        if (Math.random() < 0.3) {
            this.createShootingStar();
        }

        // Agregar nuevo texto flotante
        if (Math.random() < 0.2) {
            this.addFloatingText();
        }
    }

    createShootingStar() {
        const starLayer = this.container.querySelector('.cosmic-layer-stars');
        if (!starLayer) return;

        const shootingStar = document.createElement('div');
        shootingStar.className = 'cosmic-star star-white star-small';
        shootingStar.style.position = 'absolute';
        shootingStar.style.left = '0%';
        shootingStar.style.top = Math.random() * 50 + '%';
        shootingStar.style.opacity = '1';
        shootingStar.style.transition = 'all 3s linear';
        shootingStar.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.8), 2px 0 100px rgba(255, 255, 255, 0.4)';

        starLayer.appendChild(shootingStar);

        // Animar el movimiento
        setTimeout(() => {
            shootingStar.style.left = '100%';
            shootingStar.style.opacity = '0';
        }, 100);

        // Remover después de la animación
        setTimeout(() => {
            if (shootingStar.parentNode) {
                shootingStar.parentNode.removeChild(shootingStar);
            }
        }, 3500);
    }

    addFloatingText() {
        const textLayer = this.container.querySelector('.cosmic-layer-texts');
        if (!textLayer) return;

        const randomTexts = [...this.equations, ...this.latinTexts];
        const text = randomTexts[Math.floor(Math.random() * randomTexts.length)];

        const textElement = document.createElement('div');
        textElement.className = Math.random() > 0.5 ? 'cosmic-text' : 'cosmic-text latin-text';
        textElement.textContent = text;
        textElement.style.left = Math.random() * 100 + '%';
        textElement.style.top = '100%';
        textElement.style.opacity = '0';
        textElement.style.transition = 'all 8s ease-out';

        textLayer.appendChild(textElement);

        setTimeout(() => {
            textElement.style.top = Math.random() * 100 + '%';
            textElement.style.opacity = '0.7';
        }, 100);

        setTimeout(() => {
            if (textElement.parentNode) {
                textElement.parentNode.removeChild(textElement);
            }
        }, 20000);
    }

    // Optimization for mobile devices
    optimizeForMobile() {
        if (window.innerWidth <= 768) {
            // Reduce elements for mobile
            this.stars.forEach((star, index) => {
                if (index % 2 === 0) {
                    star.style.display = 'none';
                }
            });

            this.texts.forEach((text, index) => {
                if (index % 3 === 0) {
                    text.style.display = 'none';
                }
            });
        }
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.isInitialized = false;
    }
}

// Initialize the Cosmic Algorithm System when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const cosmicAlgorithms = new CosmicAlgorithms();

    // Optimize for mobile
    cosmicAlgorithms.optimizeForMobile();

    // Add cosmic events periodically
    setInterval(() => {
        cosmicAlgorithms.addCosmicEvent();
    }, 15000); // Every 15 seconds

    // Store globally for debugging
    window.cosmicAlgorithms = cosmicAlgorithms;
});

// Handle visibility change for performance
document.addEventListener('visibilitychange', () => {
    const container = document.querySelector('.cosmic-algorithm-container');
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

// Cosmic interaction on mouse movement (desktop only)
if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        const container = document.querySelector('.cosmic-algorithm-container');
        if (!container) return;

        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        // Subtle cosmic field distortion
        const eye = container.querySelector('.omniscient-eye');
        if (eye) {
            const offsetX = (x - 0.5) * 20;
            const offsetY = (y - 0.5) * 20;
            eye.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
        }

        // Nebulae respond to mouse
        const nebulae = container.querySelectorAll('.neural-nebula');
        nebulae.forEach((nebula, index) => {
            const intensity = 1 + (Math.sin(x * Math.PI + index) * 0.2);
            nebula.style.filter = `blur(${2 + intensity}px) brightness(${intensity})`;
        });
    });
}