/**
 * Quantum Knowledge Matrix Parallax System
 * Creates a scientific visualization representing the flow of knowledge,
 * equations, quantum particles, and neural networks
 */

class QuantumMatrix {
    constructor() {
        this.container = null;
        this.equations = [];
        this.particles = [];
        this.neuralNetworks = [];
        this.isInitialized = false;
        this.scientificEquations = [
            'E = mc²',
            'ℏω = E',
            '∇²ψ + k²ψ = 0',
            'F = ma',
            'ΔxΔp ≥ ℏ/2',
            '∮ E⃗ · dA = Q/ε₀',
            'H|ψ⟩ = E|ψ⟩',
            '∇ × B = μ₀J',
            'S = k ln Ω',
            'dS ≥ 0',
            '∂ψ/∂t = iℏĤψ',
            'F = G(m₁m₂)/r²',
            '∇ · E = ρ/ε₀',
            'PV = nRT',
            'λ = h/p',
            '∫ψ*ψ dτ = 1',
            'σ = SBT⁴',
            'v = fλ',
            'τ = RC',
            'Q = CV',
            '∇²V = -ρ/ε₀',
            'I = dQ/dt',
            'P = IV',
            'ω = 2πf',
            'k = 2π/λ',
            'n = c/v',
            'R = V/I',
            'C = Q/V',
            'L = Φ/I',
            'Z = R + iX',
            'α = dω/dt',
            'v² = u² + 2as',
            's = ut + ½at²',
            'v = u + at',
            'W = F·s',
            'P = W/t',
            'KE = ½mv²',
            'PE = mgh',
            'p = mv',
            'J = Ft',
            'T = 2π√(l/g)',
            'f = 1/T',
            'A = πr²',
            'V = ⁴⁄₃πr³'
        ];
        this.init();
    }

    init() {
        if (this.isInitialized) return;

        this.createContainer();
        this.createMatrixLayers();
        this.generateEquations();
        this.generateQuantumParticles();
        this.generateNeuralNetworks();
        this.createKnowledgeFields();
        this.createDataStreams();
        this.bindScrollEvents();
        this.isInitialized = true;
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'quantum-matrix-container';
        document.body.insertBefore(this.container, document.body.firstChild);
    }

    createMatrixLayers() {
        const layers = [
            'matrix-layer-equations',
            'matrix-layer-particles',
            'matrix-layer-neural'
        ];

        layers.forEach(layerClass => {
            const layer = document.createElement('div');
            layer.className = `matrix-layer ${layerClass}`;
            this.container.appendChild(layer);
        });
    }

    generateEquations() {
        const equationLayer = this.container.querySelector('.matrix-layer-equations');
        const equationCount = 25;

        for (let i = 0; i < equationCount; i++) {
            const equation = document.createElement('div');
            const equationText = this.scientificEquations[Math.floor(Math.random() * this.scientificEquations.length)];
            const sizes = ['small', 'medium', 'large'];
            const size = sizes[Math.floor(Math.random() * sizes.length)];

            equation.className = `floating-equation equation-${size}`;
            equation.textContent = equationText;

            // Random positioning
            equation.style.left = Math.random() * 100 + '%';
            equation.style.top = Math.random() * 100 + '%';

            // Random animation delay and duration
            equation.style.animationDelay = Math.random() * 5 + 's';
            equation.style.animationDuration = (3 + Math.random() * 4) + 's';

            // Subtle rotation for depth
            equation.style.transform = `rotateZ(${Math.random() * 20 - 10}deg)`;

            equationLayer.appendChild(equation);
            this.equations.push(equation);
        }
    }

    generateQuantumParticles() {
        const particleLayer = this.container.querySelector('.matrix-layer-particles');
        const particleTypes = ['quantum-particle', 'particle-electron', 'particle-photon'];
        const particleCount = 40;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];

            particle.className = `quantum-particle ${type}`;

            // Random positioning
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';

            // Random animation properties
            particle.style.animationDelay = Math.random() * 3 + 's';
            particle.style.animationDuration = (2 + Math.random() * 4) + 's';

            // Add random movement path for quantum uncertainty
            if (Math.random() > 0.5) {
                particle.style.transform = `translateZ(${Math.random() * 50 - 25}px)`;
            }

            particleLayer.appendChild(particle);
            this.particles.push(particle);
        }
    }

    generateNeuralNetworks() {
        const neuralLayer = this.container.querySelector('.matrix-layer-neural');
        const networkCount = 3;

        for (let i = 0; i < networkCount; i++) {
            const network = this.createNeuralNetwork();
            network.style.left = (20 + i * 30) + '%';
            network.style.top = (20 + i * 25) + '%';
            network.style.animationDelay = i * 2 + 's';

            neuralLayer.appendChild(network);
            this.neuralNetworks.push(network);
        }
    }

    createNeuralNetwork() {
        const network = document.createElement('div');
        network.className = 'neural-network';

        // Create neural nodes
        const nodeCount = 8;
        const nodes = [];

        for (let i = 0; i < nodeCount; i++) {
            const node = document.createElement('div');
            node.className = 'neural-node';

            // Position nodes in a circular pattern
            const angle = (i / nodeCount) * 2 * Math.PI;
            const radius = 80 + Math.random() * 40;
            const x = Math.cos(angle) * radius + 150;
            const y = Math.sin(angle) * radius + 150;

            node.style.left = x + 'px';
            node.style.top = y + 'px';
            node.style.animationDelay = (i * 0.3) + 's';

            network.appendChild(node);
            nodes.push({ element: node, x, y });
        }

        // Create connections between nodes
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (Math.random() > 0.6) { // 40% chance of connection
                    const connection = this.createNeuralConnection(nodes[i], nodes[j]);
                    network.appendChild(connection);
                }
            }
        }

        return network;
    }

    createNeuralConnection(node1, node2) {
        const connection = document.createElement('div');
        connection.className = 'neural-connection';

        const dx = node2.x - node1.x;
        const dy = node2.y - node1.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        connection.style.width = length + 'px';
        connection.style.left = node1.x + 'px';
        connection.style.top = node1.y + 'px';
        connection.style.transform = `rotate(${angle}deg)`;
        connection.style.animationDelay = Math.random() * 2 + 's';

        return connection;
    }

    createKnowledgeFields() {
        const fieldCount = 2;

        for (let i = 0; i < fieldCount; i++) {
            const field = document.createElement('div');
            field.className = 'knowledge-field';

            field.style.left = (10 + i * 60) + '%';
            field.style.top = (30 + i * 40) + '%';
            field.style.animationDelay = i * 3 + 's';
            field.style.animationDuration = (80 + Math.random() * 40) + 's';

            this.container.appendChild(field);
        }
    }

    createDataStreams() {
        const streamCount = 8;

        for (let i = 0; i < streamCount; i++) {
            const stream = document.createElement('div');
            stream.className = 'data-stream';

            stream.style.left = (Math.random() * 100) + '%';
            stream.style.height = (100 + Math.random() * 200) + 'px';
            stream.style.animationDelay = Math.random() * 3 + 's';
            stream.style.animationDuration = (2 + Math.random() * 2) + 's';

            this.container.appendChild(stream);
        }
    }

    bindScrollEvents() {
        let ticking = false;

        const updateParallax = () => {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollPercent = scrollY / (documentHeight - windowHeight);

            // Update equation layers
            const equationLayer = this.container.querySelector('.matrix-layer-equations');
            const particleLayer = this.container.querySelector('.matrix-layer-particles');
            const neuralLayer = this.container.querySelector('.matrix-layer-neural');

            if (equationLayer) {
                const equationSpeed = scrollY * 0.3;
                equationLayer.style.transform = `translate3d(0, ${equationSpeed}px, 0) rotateZ(${scrollPercent * 45}deg)`;
            }

            if (particleLayer) {
                const particleSpeed = scrollY * 0.5;
                particleLayer.style.transform = `translate3d(0, ${particleSpeed}px, 0) scale(${1 + scrollPercent * 0.2})`;
            }

            if (neuralLayer) {
                const neuralSpeed = scrollY * 0.7;
                neuralLayer.style.transform = `translate3d(0, ${neuralSpeed}px, 0)`;
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

    // Dynamic equation generation for continuous learning effect
    addNewEquation() {
        const equationLayer = this.container.querySelector('.matrix-layer-equations');
        if (!equationLayer) return;

        const equation = document.createElement('div');
        const equationText = this.scientificEquations[Math.floor(Math.random() * this.scientificEquations.length)];
        const sizes = ['small', 'medium', 'large'];
        const size = sizes[Math.floor(Math.random() * sizes.length)];

        equation.className = `floating-equation equation-${size}`;
        equation.textContent = equationText;
        equation.style.left = Math.random() * 100 + '%';
        equation.style.top = '100%';
        equation.style.opacity = '0';
        equation.style.transition = 'all 3s ease-in-out';

        equationLayer.appendChild(equation);

        // Animate in
        setTimeout(() => {
            equation.style.top = Math.random() * 100 + '%';
            equation.style.opacity = '1';
        }, 100);

        // Remove after animation
        setTimeout(() => {
            if (equation.parentNode) {
                equation.parentNode.removeChild(equation);
            }
        }, 15000);
    }

    // Optimization for mobile devices
    optimizeForMobile() {
        if (window.innerWidth <= 768) {
            // Reduce equation count
            this.equations.forEach((eq, index) => {
                if (index % 2 === 0) {
                    eq.style.display = 'none';
                }
            });

            // Reduce particle count
            this.particles.forEach((particle, index) => {
                if (index % 3 === 0) {
                    particle.style.display = 'none';
                }
            });

            // Simplify neural networks
            this.neuralNetworks.forEach(network => {
                const connections = network.querySelectorAll('.neural-connection');
                connections.forEach((conn, index) => {
                    if (index % 2 === 0) {
                        conn.style.display = 'none';
                    }
                });
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

// Initialize the Quantum Knowledge Matrix when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const quantumMatrix = new QuantumMatrix();

    // Optimize for mobile
    quantumMatrix.optimizeForMobile();

    // Add new equations periodically for dynamic learning effect
    setInterval(() => {
        if (Math.random() < 0.4) { // 40% chance
            quantumMatrix.addNewEquation();
        }
    }, 8000); // Every 8 seconds

    // Store globally for debugging
    window.quantumMatrix = quantumMatrix;
});

// Handle visibility change for performance
document.addEventListener('visibilitychange', () => {
    const container = document.querySelector('.quantum-matrix-container');
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

// Quantum field interactions on mouse movement (desktop only)
if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        const container = document.querySelector('.quantum-matrix-container');
        if (!container) return;

        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;

        // Subtle field distortion based on mouse position
        const particles = container.querySelectorAll('.quantum-particle');
        particles.forEach(particle => {
            const rect = particle.getBoundingClientRect();
            const particleX = (rect.left + rect.width / 2) / window.innerWidth * 100;
            const particleY = (rect.top + rect.height / 2) / window.innerHeight * 100;

            const distance = Math.sqrt(Math.pow(x - particleX, 2) + Math.pow(y - particleY, 2));

            if (distance < 20) {
                const intensity = (20 - distance) / 20;
                particle.style.transform = `scale(${1 + intensity * 0.5}) translateZ(${intensity * 10}px)`;
                particle.style.filter = `brightness(${1 + intensity})`;
            } else {
                particle.style.transform = '';
                particle.style.filter = '';
            }
        });
    });
}