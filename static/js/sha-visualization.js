class SHAVisualizer {
    constructor() {
        this.messageBlocks = document.querySelector('.message-blocks');
        this.hashState = document.querySelector('.hash-state');
        this.currentStep = document.getElementById('currentStep');
        this.isPlaying = false;
        this.animationSpeed = 1000;
        
        // Initial hash values (SHA-256)
        this.hashValues = [
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
            0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
        ];
        
        this.initializeControls();
        this.createVisualization();
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

    createVisualization() {
        // Create message blocks display
        this.messageBlocks.innerHTML = `
            <h3>Message Blocks</h3>
            <div class="block-container"></div>
        `;

        // Create hash state display
        this.hashState.innerHTML = `
            <h3>Hash State</h3>
            <div class="state-container">
                ${this.hashValues.map((value, i) => `
                    <div class="state-word" id="state-${i}">
                        ${value.toString(16).padStart(8, '0')}
                    </div>
                `).join('')}
            </div>
        `;
    }

    async start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        
        document.getElementById('startVisualization').disabled = true;
        document.getElementById('generateInput').disabled = true;

        await this.visualizeMessagePadding();
        await this.visualizeBlockProcessing();
        
        this.currentStep.textContent = 'Hash computation complete!';
        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
        document.getElementById('generateInput').disabled = false;
    }

    async visualizeMessagePadding() {
        this.currentStep.textContent = 'Step 1: Message Padding';
        
        const blockContainer = this.messageBlocks.querySelector('.block-container');
        blockContainer.innerHTML = '';
        
        // Create and animate message blocks
        for (let i = 0; i < 4; i++) {
            const block = document.createElement('div');
            block.className = 'message-block';
            block.textContent = `Block ${i + 1}`;
            blockContainer.appendChild(block);
            
            block.style.backgroundColor = '#4CAF50';
            await this.sleep(this.animationSpeed);
            block.style.backgroundColor = '';
        }
    }

    async visualizeBlockProcessing() {
        const blocks = this.messageBlocks.querySelectorAll('.message-block');
        const stateWords = this.hashState.querySelectorAll('.state-word');
        
        for (let i = 0; i < blocks.length; i++) {
            this.currentStep.textContent = `Step 2: Processing Block ${i + 1}`;
            
            // Highlight current block
            blocks[i].style.backgroundColor = '#2196F3';
            
            // Simulate compression function
            for (let j = 0; j < 8; j++) {
                stateWords[j].style.backgroundColor = '#FFC107';
                await this.sleep(this.animationSpeed / 2);
                
                // Update hash value
                this.hashValues[j] = Math.floor(Math.random() * 0xFFFFFFFF);
                stateWords[j].textContent = this.hashValues[j].toString(16).padStart(8, '0');
                
                await this.sleep(this.animationSpeed / 2);
                stateWords[j].style.backgroundColor = '';
            }
            
            blocks[i].style.backgroundColor = '#4CAF50';
            await this.sleep(this.animationSpeed);
            blocks[i].style.backgroundColor = '';
        }
    }

    generateRandomInput() {
        // Reset hash values
        this.hashValues = [
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
            0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
        ];
        
        // Update display
        const stateWords = this.hashState.querySelectorAll('.state-word');
        stateWords.forEach((word, i) => {
            word.textContent = this.hashValues[i].toString(16).padStart(8, '0');
        });
        
        this.currentStep.textContent = 'New random input generated. Click Start to begin.';
    }

    reset() {
        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
        document.getElementById('generateInput').disabled = false;
        
        // Reset hash values to initial state
        this.hashValues = [
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
            0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
        ];
        
        // Reset displays
        const stateWords = this.hashState.querySelectorAll('.state-word');
        stateWords.forEach((word, i) => {
            word.textContent = this.hashValues[i].toString(16).padStart(8, '0');
            word.style.backgroundColor = '';
        });
        
        const blocks = this.messageBlocks.querySelectorAll('.message-block');
        blocks.forEach(block => {
            block.style.backgroundColor = '';
        });
        
        this.currentStep.textContent = 'Click Start to begin SHA hashing';
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize visualizer when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SHAVisualizer();
}); 