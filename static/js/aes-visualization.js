class AESVisualizer {
    constructor() {
        this.svg = document.getElementById('aesVisualization');
        this.currentState = Array(16).fill(0);
        this.roundKeys = [];
        this.currentRound = 0;
        this.isPlaying = false;
        this.animationSpeed = 1000;
        
        // Initialize controls
        this.initializeControls();
        
        // Create initial state matrix display
        this.createStateMatrix();
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
        const grid = document.createElement('div');
        grid.className = 'aes-state-matrix';
        
        // Create 4x4 grid for state matrix
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const cell = document.createElement('div');
                cell.className = 'matrix-cell';
                cell.id = `cell-${i}-${j}`;
                cell.textContent = '00';
                grid.appendChild(cell);
            }
        }
        
        this.svg.appendChild(grid);
    }

    async start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        
        document.getElementById('startVisualization').disabled = true;
        document.getElementById('generateInput').disabled = true;

        // Simulate AES rounds
        await this.initialRound();
        
        for (let round = 1; round <= 10; round++) {
            this.currentRound = round;
            await this.executeRound(round);
        }

        document.getElementById('currentStep').textContent = 'Encryption complete!';
        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
        document.getElementById('generateInput').disabled = false;
    }

    async initialRound() {
        document.getElementById('currentStep').textContent = 'Initial Round: AddRoundKey';
        await this.visualizeAddRoundKey(0);
        await this.sleep(this.animationSpeed);
    }

    async executeRound(round) {
        // SubBytes
        document.getElementById('currentStep').textContent = `Round ${round}: SubBytes`;
        await this.visualizeSubBytes();
        await this.sleep(this.animationSpeed);

        // ShiftRows
        document.getElementById('currentStep').textContent = `Round ${round}: ShiftRows`;
        await this.visualizeShiftRows();
        await this.sleep(this.animationSpeed);

        // MixColumns (except in final round)
        if (round < 10) {
            document.getElementById('currentStep').textContent = `Round ${round}: MixColumns`;
            await this.visualizeMixColumns();
            await this.sleep(this.animationSpeed);
        }

        // AddRoundKey
        document.getElementById('currentStep').textContent = `Round ${round}: AddRoundKey`;
        await this.visualizeAddRoundKey(round);
        await this.sleep(this.animationSpeed);
    }

    async visualizeSubBytes() {
        // Highlight cells being substituted
        const cells = document.querySelectorAll('.matrix-cell');
        for (const cell of cells) {
            cell.style.backgroundColor = '#4CAF50';
            await this.sleep(100);
            cell.style.backgroundColor = '';
        }
    }

    async visualizeShiftRows() {
        // Animate row shifting
        for (let row = 1; row < 4; row++) {
            const cells = Array.from(document.querySelectorAll(`.matrix-cell`))
                .filter(cell => parseInt(cell.id.split('-')[1]) === row);
            
            cells.forEach(cell => cell.style.backgroundColor = '#2196F3');
            await this.sleep(this.animationSpeed / 2);
            cells.forEach(cell => cell.style.backgroundColor = '');
        }
    }

    async visualizeMixColumns() {
        // Highlight columns being mixed
        for (let col = 0; col < 4; col++) {
            const cells = Array.from(document.querySelectorAll(`.matrix-cell`))
                .filter(cell => parseInt(cell.id.split('-')[2]) === col);
            
            cells.forEach(cell => cell.style.backgroundColor = '#FFC107');
            await this.sleep(this.animationSpeed / 2);
            cells.forEach(cell => cell.style.backgroundColor = '');
        }
    }

    async visualizeAddRoundKey(round) {
        // Highlight XOR operation with round key
        const cells = document.querySelectorAll('.matrix-cell');
        cells.forEach(cell => cell.style.backgroundColor = '#9C27B0');
        await this.sleep(this.animationSpeed / 2);
        cells.forEach(cell => cell.style.backgroundColor = '');
    }

    generateRandomInput() {
        // Generate random 16-byte input
        this.currentState = Array(16).fill(0)
            .map(() => Math.floor(Math.random() * 256));
        
        // Update display
        this.updateStateMatrix();
    }

    updateStateMatrix() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const cell = document.getElementById(`cell-${i}-${j}`);
                const value = this.currentState[i * 4 + j];
                cell.textContent = value.toString(16).padStart(2, '0');
            }
        }
    }

    reset() {
        this.isPlaying = false;
        this.currentRound = 0;
        document.getElementById('startVisualization').disabled = false;
        document.getElementById('generateInput').disabled = false;
        document.getElementById('currentStep').textContent = 
            'Click Start to begin AES encryption';
        
        // Reset state matrix colors
        document.querySelectorAll('.matrix-cell')
            .forEach(cell => cell.style.backgroundColor = '');
        
        // Reset state to initial values
        this.currentState = Array(16).fill(0);
        this.updateStateMatrix();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize visualizer when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AESVisualizer();
}); 