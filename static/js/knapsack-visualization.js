class KnapsackVisualizer {
    constructor(svgId) {
        this.svg = document.getElementById(svgId);
        this.items = [
            { weight: 2, value: 3 },
            { weight: 3, value: 4 },
            { weight: 4, value: 5 },
            { weight: 5, value: 6 }
        ];
        this.capacity = 10;
        this.dpTable = [];
        this.cellSize = 50;
        this.padding = 40;
        this.isPlaying = false;
        this.animationSpeed = 1000;
        
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
        
        // Calculate required viewBox dimensions
        const totalWidth = this.padding * 2 + (this.capacity + 1) * this.cellSize;
        const itemsHeight = this.cellSize + this.padding * 2; // Approx height for items area
        const tableHeight = (this.items.length + 1) * this.cellSize + this.padding * 2; // Approx height for DP table
        const totalHeight = itemsHeight + tableHeight; // Total calculated height

        // Set viewBox
        this.svg.setAttribute('viewBox', `0 0 ${totalWidth} ${totalHeight}`);
        this.svg.setAttribute('preserveAspectRatio', 'xMidYMin meet'); // Adjust aspect ratio handling if needed

        // Create main groups
        const itemsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        itemsGroup.setAttribute('class', 'items-group');
        
        const dpGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        dpGroup.setAttribute('class', 'dp-grid');
        dpGroup.setAttribute('transform', `translate(0, ${this.padding * 3})`);
        
        // Draw items
        this.items.forEach((item, i) => {
            const itemG = document.createElementNS("http://www.w3.org/2000/svg", "g");
            itemG.setAttribute('transform', `translate(${this.padding + i * this.cellSize * 2}, ${this.padding})`);
            
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute('width', this.cellSize);
            rect.setAttribute('height', this.cellSize);
            rect.setAttribute('class', 'item-rect');
            
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute('x', this.cellSize/2);
            text.setAttribute('y', this.cellSize/2);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('alignment-baseline', 'middle');
            text.setAttribute('class', 'item-text');
            text.textContent = `${item.value}/$${item.weight}`;
            
            itemG.appendChild(rect);
            itemG.appendChild(text);
            itemsGroup.appendChild(itemG);
        });
        
        // Draw DP table
        for(let i = 0; i <= this.items.length; i++) {
            this.dpTable[i] = Array(this.capacity + 1).fill(0);
            for(let w = 0; w <= this.capacity; w++) {
                const cell = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                cell.setAttribute('x', this.padding + w * this.cellSize);
                cell.setAttribute('y', this.padding + i * this.cellSize);
                cell.setAttribute('width', this.cellSize);
                cell.setAttribute('height', this.cellSize);
                cell.setAttribute('class', 'dp-cell');
                cell.setAttribute('id', `cell-${i}-${w}`);
                
                const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text.setAttribute('x', this.padding + w * this.cellSize + this.cellSize/2);
                text.setAttribute('y', this.padding + i * this.cellSize + this.cellSize/2);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('alignment-baseline', 'middle');
                text.setAttribute('class', 'cell-text');
                text.setAttribute('id', `text-${i}-${w}`);
                text.textContent = '0';
                
                dpGroup.appendChild(cell);
                dpGroup.appendChild(text);
            }
        }
        
        // Add labels
        const weightLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        weightLabel.setAttribute('x', this.padding);
        weightLabel.setAttribute('y', this.padding * 2.5);
        weightLabel.setAttribute('class', 'axis-label');
        weightLabel.textContent = 'Weight →';
        
        const itemLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        itemLabel.setAttribute('x', this.padding/2);
        itemLabel.setAttribute('y', this.padding * 4);
        itemLabel.setAttribute('class', 'axis-label');
        itemLabel.setAttribute('transform', `rotate(-90, ${this.padding/2}, ${this.padding * 4})`);
        itemLabel.textContent = 'Items →';
        
        this.svg.appendChild(itemsGroup);
        this.svg.appendChild(dpGroup);
        this.svg.appendChild(weightLabel);
        this.svg.appendChild(itemLabel);
    }

    async highlightCell(i, w, className) {
        const cell = document.getElementById(`cell-${i}-${w}`);
        const text = document.getElementById(`text-${i}-${w}`);
        if (cell) cell.setAttribute('class', `dp-cell ${className}`);
        if (text) text.setAttribute('class', `cell-text ${className}`);
        await this.sleep(this.animationSpeed / 2);
        if (cell) cell.setAttribute('class', 'dp-cell');
        if (text) text.setAttribute('class', 'cell-text');
        await this.sleep(this.animationSpeed / 2);
    }

    updateCell(i, w, value) {
        const text = document.getElementById(`text-${i}-${w}`);
        text.textContent = value;
        this.dpTable[i][w] = value;
    }

    async solve() {
        document.getElementById('currentStep').textContent = 'Initializing DP table...';
        
        // Fill the DP table
        for(let i = 1; i <= this.items.length && this.isPlaying; i++) {
            const item = this.items[i-1];
            for(let w = 0; w <= this.capacity && this.isPlaying; w++) {
                await this.highlightCell(i, w, 'current');
                
                if(item.weight <= w) {
                    const include = this.dpTable[i-1][w-item.weight] + item.value;
                    const exclude = this.dpTable[i-1][w];
                    
                    if(include > exclude) {
                        this.updateCell(i, w, include);
                        await this.highlightCell(i, w, 'include');
                    } else {
                        this.updateCell(i, w, exclude);
                        await this.highlightCell(i, w, 'exclude');
                    }
                } else {
                    this.updateCell(i, w, this.dpTable[i-1][w]);
                    await this.highlightCell(i, w, 'exclude');
                }
            }
        }
        
        // Trace the solution
        await this.traceSolution();
    }

    async traceSolution() {
        document.getElementById('currentStep').textContent = 'Finding selected items...';
        
        let i = this.items.length;
        let w = this.capacity;
        const selected = [];
        
        while(i > 0 && w > 0 && this.isPlaying) {
            if(this.dpTable[i][w] !== this.dpTable[i-1][w]) {
                selected.unshift(i-1);
                w -= this.items[i-1].weight;
                await this.highlightCell(i, w, 'selected');
            }
            i--;
        }
        
        const totalValue = this.dpTable[this.items.length][this.capacity];
        document.getElementById('currentStep').textContent = 
            `Solution found! Total value: ${totalValue}, Selected items: ${selected.map(i => i+1).join(', ')}`;
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
    new KnapsackVisualizer('knapsackVisualization');
}); 