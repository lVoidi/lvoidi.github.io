class EditDistanceVisualizer {
    constructor(svgId) {
        this.svg = document.getElementById(svgId);
        this.str1 = "INTENTION";
        this.str2 = "EXECUTION";
        this.dpTable = [];
        this.cellSize = 50;
        this.padding = 40;
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
        const str1Input = document.getElementById('string1');
        const str2Input = document.getElementById('string2');

        startBtn.addEventListener('click', () => this.start());
        resetBtn.addEventListener('click', () => this.reset());
        speedControl.addEventListener('input', (e) => {
            this.animationSpeed = 1500 - (e.target.value * 250);
        });

        if (str1Input && str2Input) {
            str1Input.value = this.str1;
            str2Input.value = this.str2;
            str1Input.addEventListener('change', (e) => {
                this.str1 = e.target.value.toUpperCase();
                this.reset();
            });
            str2Input.addEventListener('change', (e) => {
                this.str2 = e.target.value.toUpperCase();
                this.reset();
            });
        }
    }

    initializeVisualization() {
        this.svg.innerHTML = '';
        
        // Calculate dimensions based on input strings
        const totalRows = this.str2.length + 2;    // +2 for headers
        const totalCols = this.str1.length + 2;    // +2 for headers
        const requiredWidth = (totalCols * this.cellSize) + (this.padding * 3);
        const requiredHeight = (totalRows * this.cellSize) + (this.padding * 3);
        
        // Set SVG viewBox to ensure all content is visible
        this.svg.setAttribute('viewBox', `0 0 ${requiredWidth} ${requiredHeight}`);
        this.svg.setAttribute('width', '100%');
        this.svg.setAttribute('height', '100%');
        this.svg.style.maxWidth = '100%';
        
        // Create main group for the grid with adjusted positioning
        const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        gridGroup.setAttribute('class', 'dp-grid');
        gridGroup.setAttribute('transform', `translate(${this.padding * 2}, ${this.padding * 2})`);
        
        // Add string labels
        for(let i = 0; i <= this.str1.length; i++) {
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute('x', (i + 1) * this.cellSize);
            text.setAttribute('y', this.padding);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('class', 'sequence-label');
            text.textContent = i === 0 ? '' : this.str1[i-1];
            gridGroup.appendChild(text);
        }
        
        for(let i = 0; i <= this.str2.length; i++) {
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute('x', this.padding);
            text.setAttribute('y', (i + 1) * this.cellSize);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('class', 'sequence-label');
            text.textContent = i === 0 ? '' : this.str2[i-1];
            gridGroup.appendChild(text);
        }
        
        // Initialize and draw DP table
        this.dpTable = Array(this.str2.length + 1).fill().map(() => 
            Array(this.str1.length + 1).fill(0));
        
        // Fill first row and column
        for(let i = 0; i <= this.str2.length; i++) {
            this.dpTable[i][0] = i;
        }
        for(let j = 0; j <= this.str1.length; j++) {
            this.dpTable[0][j] = j;
        }
        
        // Draw grid cells
        for(let i = 0; i <= this.str2.length; i++) {
            for(let j = 0; j <= this.str1.length; j++) {
                const cell = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                cell.setAttribute('x', j * this.cellSize);
                cell.setAttribute('y', i * this.cellSize);
                cell.setAttribute('width', this.cellSize);
                cell.setAttribute('height', this.cellSize);
                cell.setAttribute('class', 'dp-cell');
                cell.setAttribute('id', `cell-${i}-${j}`);
                
                const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text.setAttribute('x', j * this.cellSize + this.cellSize/2);
                text.setAttribute('y', i * this.cellSize + this.cellSize/2);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('alignment-baseline', 'middle');
                text.setAttribute('class', 'cell-text');
                text.setAttribute('id', `text-${i}-${j}`);
                text.textContent = this.dpTable[i][j];
                
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

    async solve() {
        document.getElementById('currentStep').textContent = 'Filling DP table...';
        
        // Fill the DP table
        for(let i = 1; i <= this.str2.length && this.isPlaying; i++) {
            for(let j = 1; j <= this.str1.length && this.isPlaying; j++) {
                await this.highlightCell(i, j, 'current');
                
                if(this.str2[i-1] === this.str1[j-1]) {
                    this.updateCell(i, j, this.dpTable[i-1][j-1]);
                    await this.highlightCell(i, j, 'match');
                } else {
                    const insert = this.dpTable[i][j-1] + 1;
                    const delete_ = this.dpTable[i-1][j] + 1;
                    const replace = this.dpTable[i-1][j-1] + 1;
                    
                    this.updateCell(i, j, Math.min(insert, delete_, replace));
                    await this.highlightCell(i, j, 'no-match');
                }
            }
        }
        
        await this.traceSolution();
    }

    async traceSolution() {
        document.getElementById('currentStep').textContent = 'Tracing solution path...';
        
        let i = this.str2.length;
        let j = this.str1.length;
        const operations = [];
        
        while(i > 0 || j > 0) {
            await this.highlightCell(i, j, 'path');
            
            if(i > 0 && j > 0 && this.str2[i-1] === this.str1[j-1]) {
                i--; j--;
                operations.unshift('match');
            } else if(i > 0 && j > 0 && this.dpTable[i][j] === this.dpTable[i-1][j-1] + 1) {
                i--; j--;
                operations.unshift('replace');
            } else if(j > 0 && this.dpTable[i][j] === this.dpTable[i][j-1] + 1) {
                j--;
                operations.unshift('insert');
            } else {
                i--;
                operations.unshift('delete');
            }
        }
        
        document.getElementById('currentStep').textContent = 
            `Edit Distance: ${this.dpTable[this.str2.length][this.str1.length]}`;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        document.getElementById('startVisualization').disabled = true;
        await this.solve();
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
    new EditDistanceVisualizer('editDistanceVisualization');
}); 