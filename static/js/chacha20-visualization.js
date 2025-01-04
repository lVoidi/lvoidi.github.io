class ChaCha20Visualizer {
    constructor() {
        this.svg = document.getElementById('chacha20Visualization');
        this.state = new Array(16).fill(0);
        this.isPlaying = false;
        this.animationSpeed = 1000;
        this.currentRound = 0;
        
        // Initialize controls
        this.initializeControls();
        
        // Create initial state matrix display
        this.createStateMatrix();
        this.initializeState();
    }

    initializeControls() {
        document.getElementById('startVisualization').addEventListener('click', () => this.start());
        document.getElementById('resetVisualization').addEventListener('click', () => this.reset());
        document.getElementById('generateInput').addEventListener('click', () => this.generateRandomInput());
        
        document.getElementById('speedControl').addEventListener('input', (e) => {
            const speed = 6 - e.target.value;
            this.animationSpeed = speed * 200;
        });
    }

    createStateMatrix() {
        const container = document.querySelector('.state-matrix-container');
        const grid = document.createElement('div');
        grid.className = 'chacha-state-matrix';
        
        // Create 4x4 grid for state matrix
        for (let i = 0; i < 4; i++) {
            const row = document.createElement('div');
            row.className = 'matrix-row';
            for (let j = 0; j < 4; j++) {
                const cell = document.createElement('div');
                cell.className = 'matrix-cell';
                cell.id = `cell-${i}-${j}`;
                cell.textContent = '00000000';
                row.appendChild(cell);
            }
            grid.appendChild(row);
        }
        
        container.appendChild(grid);
    }

    initializeState() {
        // Constants "expand 32-byte k"
        this.state[0] = 0x61707865;
        this.state[1] = 0x3320646e;
        this.state[2] = 0x79622d32;
        this.state[3] = 0x6b206574;
        
        this.updateDisplay();
    }

    updateDisplay() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const cell = document.getElementById(`cell-${i}-${j}`);
                const value = this.state[i * 4 + j];
                cell.textContent = value.toString(16).padStart(8, '0');
            }
        }
    }

    async start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        
        document.getElementById('startVisualization').disabled = true;
        document.getElementById('generateInput').disabled = true;

        // Perform 20 rounds (10 double rounds)
        for (let round = 0; round < 10; round++) {
            this.currentRound = round;
            await this.executeDoubleRound(round);
        }

        document.getElementById('currentStep').textContent = 'ChaCha20 rounds complete!';
        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
        document.getElementById('generateInput').disabled = false;
    }

    async executeDoubleRound(round) {
        // Column round
        document.getElementById('currentStep').textContent = `Round ${round + 1}: Column Quarter-Rounds`;
        await this.visualizeQuarterRound([0, 4, 8, 12], 'column');
        await this.visualizeQuarterRound([1, 5, 9, 13], 'column');
        await this.visualizeQuarterRound([2, 6, 10, 14], 'column');
        await this.visualizeQuarterRound([3, 7, 11, 15], 'column');

        // Diagonal round
        document.getElementById('currentStep').textContent = `Round ${round + 1}: Diagonal Quarter-Rounds`;
        await this.visualizeQuarterRound([0, 5, 10, 15], 'diagonal');
        await this.visualizeQuarterRound([1, 6, 11, 12], 'diagonal');
        await this.visualizeQuarterRound([2, 7, 8, 13], 'diagonal');
        await this.visualizeQuarterRound([3, 4, 9, 14], 'diagonal');
    }

    async visualizeQuarterRound(indices, type) {
        // Highlight cells involved in quarter-round
        const cells = indices.map(i => {
            const row = Math.floor(i / 4);
            const col = i % 4;
            return document.getElementById(`cell-${row}-${col}`);
        });

        // Different colors for column vs diagonal rounds
        const color = type === 'column' ? '#4CAF50' : '#2196F3';
        
        // Highlight cells
        cells.forEach(cell => cell.style.backgroundColor = color);
        await this.sleep(this.animationSpeed / 2);
        
        // Simulate quarter-round operation
        this.quarterRound(...indices);
        this.updateDisplay();
        
        await this.sleep(this.animationSpeed / 2);
        cells.forEach(cell => cell.style.backgroundColor = '');
    }

    quarterRound(a, b, c, d) {
        // Actual quarter-round operation
        const rotl = (x, n) => ((x << n) | (x >>> (32 - n))) >>> 0;
        
        this.state[a] = (this.state[a] + this.state[b]) >>> 0;
        this.state[d] = rotl(this.state[d] ^ this.state[a], 16);
        
        this.state[c] = (this.state[c] + this.state[d]) >>> 0;
        this.state[b] = rotl(this.state[b] ^ this.state[c], 12);
        
        this.state[a] = (this.state[a] + this.state[b]) >>> 0;
        this.state[d] = rotl(this.state[d] ^ this.state[a], 8);
        
        this.state[c] = (this.state[c] + this.state[d]) >>> 0;
        this.state[b] = rotl(this.state[b] ^ this.state[c], 7);
    }

    generateRandomInput() {
        // Generate random key and nonce
        for (let i = 4; i < 12; i++) {
            this.state[i] = Math.floor(Math.random() * 0xFFFFFFFF);
        }
        this.state[12] = 0; // counter
        for (let i = 13; i < 16; i++) {
            this.state[i] = Math.floor(Math.random() * 0xFFFFFFFF);
        }
        this.updateDisplay();
    }

    reset() {
        this.isPlaying = false;
        this.currentRound = 0;
        document.getElementById('startVisualization').disabled = false;
        document.getElementById('generateInput').disabled = false;
        document.getElementById('currentStep').textContent = 'Click Start to begin ChaCha20 rounds';
        
        // Reset state matrix colors
        document.querySelectorAll('.matrix-cell')
            .forEach(cell => cell.style.backgroundColor = '');
        
        // Reset state to initial values
        this.initializeState();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize visualizer when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChaCha20Visualizer();
}); 