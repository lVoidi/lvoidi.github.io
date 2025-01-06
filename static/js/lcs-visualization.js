class LCSVisualizer {
    constructor(svgId) {
        this.svg = document.getElementById(svgId);
        this.sequence1 = "ABCDGH";
        this.sequence2 = "AEDFHR";
        this.dpTable = [];
        this.cellSize = 50;
        this.padding = 30;
        this.isPlaying = false;
        this.animationSpeed = 1000;
        
        this.width = this.svg.clientWidth;
        this.height = this.svg.clientHeight;
        
        this.setupControls();
        this.initializeVisualization();
    }

    setupControls() {
        const startBtn = document.getElementById('startVisualization');
        const resetBtn = document.getElementById('resetVisualization');
        const speedControl = document.getElementById('speedControl');

        startBtn.addEventListener('click', () => this.start());
        resetBtn.addEventListener('click', () => this.reset());
        speedControl.addEventListener('input', (e) => {
            this.animationSpeed = 1500 - (e.target.value * 250);
        });
    }

    initializeVisualization() {
        this.svg.innerHTML = '';
        
        // Draw grid
        const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        gridGroup.setAttribute('class', 'dp-grid');
        
        // Draw column headers (sequence1)
        for(let i = 0; i <= this.sequence1.length; i++) {
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute('x', this.padding + (i + 1) * this.cellSize);
            text.setAttribute('y', this.padding - 10);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('class', 'sequence-label');
            text.textContent = i === 0 ? '' : this.sequence1[i-1];
            gridGroup.appendChild(text);
        }
        
        // Draw row headers (sequence2)
        for(let i = 0; i <= this.sequence2.length; i++) {
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute('x', this.padding - 10);
            text.setAttribute('y', this.padding + (i + 1) * this.cellSize - 15);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('class', 'sequence-label');
            text.textContent = i === 0 ? '' : this.sequence2[i-1];
            gridGroup.appendChild(text);
        }
        
        // Draw grid cells
        for(let i = 0; i <= this.sequence2.length; i++) {
            this.dpTable[i] = Array(this.sequence1.length + 1).fill(0);
            for(let j = 0; j <= this.sequence1.length; j++) {
                const cell = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                cell.setAttribute('x', this.padding + j * this.cellSize);
                cell.setAttribute('y', this.padding + i * this.cellSize);
                cell.setAttribute('width', this.cellSize);
                cell.setAttribute('height', this.cellSize);
                cell.setAttribute('class', 'dp-cell');
                cell.setAttribute('id', `cell-${i}-${j}`);
                
                const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text.setAttribute('x', this.padding + j * this.cellSize + this.cellSize/2);
                text.setAttribute('y', this.padding + i * this.cellSize + this.cellSize/2 + 5);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('class', 'cell-text');
                text.setAttribute('id', `text-${i}-${j}`);
                text.textContent = '0';
                
                gridGroup.appendChild(cell);
                gridGroup.appendChild(text);
            }
        }
        
        this.svg.appendChild(gridGroup);
    }

    async highlightCell(i, j, className) {
        const cell = document.getElementById(`cell-${i}-${j}`);
        cell.setAttribute('class', `dp-cell ${className}`);
        await this.sleep(this.animationSpeed);
    }

    updateCell(i, j, value) {
        const text = document.getElementById(`text-${i}-${j}`);
        text.textContent = value;
        this.dpTable[i][j] = value;
    }

    async findLCS() {
        // Initialize first row and column with zeros
        document.getElementById('currentStep').textContent = 'Initializing DP table...';
        for(let i = 0; i <= this.sequence2.length; i++) {
            await this.highlightCell(i, 0, 'current');
            this.updateCell(i, 0, 0);
        }
        for(let j = 0; j <= this.sequence1.length; j++) {
            await this.highlightCell(0, j, 'current');
            this.updateCell(0, j, 0);
        }
        
        // Fill the DP table
        document.getElementById('currentStep').textContent = 'Filling DP table...';
        for(let i = 1; i <= this.sequence2.length && this.isPlaying; i++) {
            for(let j = 1; j <= this.sequence1.length && this.isPlaying; j++) {
                await this.highlightCell(i, j, 'current');
                await this.highlightCell(i-1, j-1, 'comparing');
                
                if(this.sequence2[i-1] === this.sequence1[j-1]) {
                    this.updateCell(i, j, this.dpTable[i-1][j-1] + 1);
                    await this.highlightCell(i, j, 'match');
                } else {
                    this.updateCell(i, j, Math.max(this.dpTable[i-1][j], this.dpTable[i][j-1]));
                    await this.highlightCell(i, j, 'no-match');
                }
            }
        }
        
        // Highlight the LCS path
        document.getElementById('currentStep').textContent = 'Highlighting LCS path...';
        await this.traceLCS();
    }

    async traceLCS() {
        let i = this.sequence2.length;
        let j = this.sequence1.length;
        let lcs = '';
        
        while(i > 0 && j > 0 && this.isPlaying) {
            await this.highlightCell(i, j, 'path');
            if(this.sequence2[i-1] === this.sequence1[j-1]) {
                lcs = this.sequence2[i-1] + lcs;
                i--;
                j--;
            } else if(this.dpTable[i-1][j] > this.dpTable[i][j-1]) {
                i--;
            } else {
                j--;
            }
        }
        
        document.getElementById('currentStep').textContent = `LCS found: ${lcs}`;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        document.getElementById('startVisualization').disabled = true;
        await this.findLCS();
        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
    }

    reset() {
        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
        document.getElementById('currentStep').textContent = 'Click Start to begin visualization';
        this.initializeVisualization();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LCSVisualizer('lcsVisualization');
}); 