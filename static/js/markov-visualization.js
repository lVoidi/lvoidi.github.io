class MarkovChainVisualizer {
    constructor() {
        this.trainingText = document.getElementById('trainingText');
        this.chainLength = document.getElementById('chainLength');
        this.outputLength = document.getElementById('outputLength');
        this.generateBtn = document.getElementById('generateBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.outputArea = document.getElementById('markovOutput');
        
        this.transitions = new Map();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generate());
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    train(text, order) {
        this.transitions.clear();
        const padded = ' '.repeat(order) + text + ' '.repeat(order);
        
        for (let i = 0; i < padded.length - order; i++) {
            const state = padded.slice(i, i + order);
            const nextChar = padded[i + order];
            
            if (!this.transitions.has(state)) {
                this.transitions.set(state, []);
            }
            this.transitions.get(state).push(nextChar);
        }
    }

    generateText(length, order) {
        if (this.transitions.size === 0) {
            return 'Please provide training text first.';
        }

        const states = Array.from(this.transitions.keys());
        let current = states[Math.floor(Math.random() * states.length)];
        let result = current;

        for (let i = 0; i < length - order; i++) {
            const possibleNextChars = this.transitions.get(current);
            if (!possibleNextChars || possibleNextChars.length === 0) {
                break;
            }

            const nextChar = possibleNextChars[Math.floor(Math.random() * possibleNextChars.length)];
            result += nextChar;
            current = result.slice(-order);
        }

        return result.trim();
    }

    generate() {
        const text = this.trainingText.value;
        const order = parseInt(this.chainLength.value);
        const length = parseInt(this.outputLength.value);

        if (!text) {
            this.showError('Please provide training text.');
            return;
        }

        // Train the model
        this.train(text, order);

        // Generate and display text with typing animation
        const generatedText = this.generateText(length, order);
        this.animateText(generatedText);
    }

    animateText(text) {
        this.outputArea.innerHTML = '';
        let index = 0;

        const animate = () => {
            if (index < text.length) {
                this.outputArea.textContent += text[index];
                index++;
                setTimeout(animate, 20);
            }
        };

        animate();
    }

    showError(message) {
        this.outputArea.innerHTML = `<span class="text-danger">${message}</span>`;
    }

    reset() {
        this.trainingText.value = '';
        this.chainLength.value = '2';
        this.outputLength.value = '100';
        this.outputArea.innerHTML = '';
        this.transitions.clear();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MarkovChainVisualizer();
}); 