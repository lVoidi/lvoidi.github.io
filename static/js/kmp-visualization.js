class KMPVisualizer {
    constructor() {
        this.textInput = document.getElementById('textInput');
        this.patternInput = document.getElementById('patternInput');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.speedControl = document.getElementById('speedControl');
        this.currentStep = document.getElementById('currentStep');
        this.visualizationArea = document.getElementById('kmpVisualization');
        
        this.speed = 1000;
        this.isRunning = false;
        
        this.setupEventListeners();
        this.reset();
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.speedControl.addEventListener('input', (e) => {
            this.speed = 1000 / e.target.value;
        });
    }

    createCharacterElement(char, className = '') {
        const element = document.createElement('div');
        element.className = `char-box ${className}`;
        element.textContent = char;
        return element;
    }

    updateVisualization() {
        this.visualizationArea.innerHTML = `
            <div class="visualization-row">
                <div class="row-label">Text:</div>
                <div class="char-container text-row" id="textRow"></div>
                <div class="row-index" id="textIndex"></div>
            </div>
            <div class="visualization-row">
                <div class="row-label">Pattern:</div>
                <div class="char-container pattern-row" id="patternRow"></div>
                <div class="row-index" id="patternIndex"></div>
            </div>
            <div class="visualization-row">
                <div class="row-label">LPS:</div>
                <div class="char-container lps-row" id="lpsRow"></div>
            </div>
        `;
    }

    computeLPSArray(pattern) {
        const lps = new Array(pattern.length).fill(0);
        let len = 0;
        let i = 1;

        while (i < pattern.length) {
            if (pattern[i] === pattern[len]) {
                len++;
                lps[i] = len;
                i++;
            } else {
                if (len !== 0) {
                    len = lps[len - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }

        return lps;
    }

    async visualizeLPSComputation(pattern) {
        const lpsRow = document.getElementById('lpsRow');
        const lps = new Array(pattern.length).fill(0);
        
        // Display initial LPS array
        for (let i = 0; i < pattern.length; i++) {
            lpsRow.appendChild(this.createCharacterElement(lps[i]));
        }

        let len = 0;
        let i = 1;

        while (i < pattern.length) {
            this.currentStep.textContent = `Computing LPS: comparing pattern[${i}] with pattern[${len}]`;
            
            if (pattern[i] === pattern[len]) {
                len++;
                lps[i] = len;
                lpsRow.children[i].textContent = len;
                lpsRow.children[i].classList.add('highlight');
                await this.sleep(this.speed);
                lpsRow.children[i].classList.remove('highlight');
                i++;
            } else {
                if (len !== 0) {
                    len = lps[len - 1];
                } else {
                    lps[i] = 0;
                    lpsRow.children[i].classList.add('highlight');
                    await this.sleep(this.speed);
                    lpsRow.children[i].classList.remove('highlight');
                    i++;
                }
            }
        }

        return lps;
    }

    async searchPattern(text, pattern, lps) {
        const textRow = document.getElementById('textRow');
        const patternRow = document.getElementById('patternRow');
        const textIndex = document.getElementById('textIndex');
        const patternIndex = document.getElementById('patternIndex');

        let i = 0; // index for text
        let j = 0; // index for pattern
        
        while (i < text.length) {
            // Update current positions
            textRow.children[i].classList.add('current');
            if (j < pattern.length) {
                patternRow.children[j].classList.add('current');
            }

            this.currentStep.textContent = `Comparing text[${i}] with pattern[${j}]`;
            await this.sleep(this.speed);

            if (pattern[j] === text[i]) {
                textRow.children[i].classList.add('match');
                patternRow.children[j].classList.add('match');
                i++;
                j++;
            } else {
                textRow.children[i].classList.add('mismatch');
                if (j < pattern.length) {
                    patternRow.children[j].classList.add('mismatch');
                }
                await this.sleep(this.speed);

                if (j !== 0) {
                    j = lps[j - 1];
                    this.currentStep.textContent = `Mismatch! Moving pattern index to ${j}`;
                } else {
                    i++;
                }
            }

            // Clear current positions
            textRow.children[i-1].classList.remove('current');
            if (j > 0) patternRow.children[j-1].classList.remove('current');
            await this.sleep(this.speed/2);

            if (j === pattern.length) {
                this.currentStep.textContent = `Pattern found at index ${i - j}!`;
                await this.sleep(this.speed);
                j = lps[j - 1];
            }
        }
    }

    async start() {
        if (this.isRunning) return;
        
        const text = this.textInput.value;
        const pattern = this.patternInput.value;

        if (!text || !pattern) {
            this.currentStep.textContent = 'Please enter both text and pattern';
            return;
        }

        this.isRunning = true;
        this.startBtn.disabled = true;
        this.updateVisualization();

        // Display text and pattern
        const textRow = document.getElementById('textRow');
        const patternRow = document.getElementById('patternRow');

        text.split('').forEach(char => {
            textRow.appendChild(this.createCharacterElement(char));
        });

        pattern.split('').forEach(char => {
            patternRow.appendChild(this.createCharacterElement(char));
        });

        // Compute and visualize LPS array
        this.currentStep.textContent = 'Computing LPS array...';
        const lps = await this.visualizeLPSComputation(pattern);

        // Search for pattern
        this.currentStep.textContent = 'Starting pattern search...';
        await this.sleep(this.speed);
        await this.searchPattern(text, pattern, lps);

        this.isRunning = false;
        this.startBtn.disabled = false;
    }

    reset() {
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.textInput.value = '';
        this.patternInput.value = '';
        this.currentStep.textContent = 'Enter text and pattern to begin';
        this.updateVisualization();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Add CSS styles dynamically
const style = document.createElement('style');
style.textContent = `
    .visualization-row {
        display: flex;
        align-items: center;
        margin: 10px 0;
        gap: 10px;
        width: 100%;
        overflow-x: auto;
        padding-bottom: 10px;
    }

    .row-label {
        min-width: 80px;
        color: var(--text-color);
        flex-shrink: 0;
    }

    .char-container {
        display: flex;
        gap: 2px;
        flex-wrap: nowrap;
        overflow-x: auto;
        padding-bottom: 5px;
        scrollbar-width: thin;
        -webkit-overflow-scrolling: touch;
    }

    .char-box {
        min-width: 40px;
        width: 40px;
        height: 40px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.2);
        color: var(--text-color);
        font-family: monospace;
        transition: all 0.3s ease;
        flex-shrink: 0;
    }

    .char-box.current {
        background: rgba(255, 255, 255, 0.1);
        border-color: var(--accent-color);
    }

    .char-box.match {
        background: rgba(40, 167, 69, 0.3);
    }

    .char-box.mismatch {
        background: rgba(220, 53, 69, 0.3);
    }

    .char-box.highlight {
        background: rgba(255, 193, 7, 0.3);
    }

    /* Custom scrollbar styles */
    .char-container::-webkit-scrollbar {
        height: 6px;
    }

    .char-container::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
    }

    .char-container::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
    }

    .char-container::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
    }
`;

document.head.appendChild(style);

// Initialize visualization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KMPVisualizer();
}); 