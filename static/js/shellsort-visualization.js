class ShellSortVisualizer {
    constructor(svgId) {
        this.svg = document.getElementById(svgId);
        this.originalArray = [8, 4, 2, 9, 3, 1, 6, 7, 5];
        this.array = [...this.originalArray];
        this.isPlaying = false;
        this.animationSpeed = 1000;
        
        this.width = this.svg.clientWidth;
        this.height = this.svg.clientHeight;
        this.barWidth = this.width / (this.array.length * 2);
        
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
        const maxVal = Math.max(...this.array);
        
        this.array.forEach((val, idx) => {
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute('x', idx * (this.barWidth * 2));
            rect.setAttribute('y', this.height - (val / maxVal * this.height * 0.8));
            rect.setAttribute('width', this.barWidth);
            rect.setAttribute('height', (val / maxVal * this.height * 0.8));
            rect.setAttribute('class', 'array-element');
            
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute('x', idx * (this.barWidth * 2) + this.barWidth/2);
            text.setAttribute('y', this.height - 5);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('class', 'array-label');
            text.textContent = val;
            
            g.appendChild(rect);
            g.appendChild(text);
            this.svg.appendChild(g);
        });
    }

    updateElement(index, value) {
        const g = this.svg.children[index];
        const rect = g.children[0];
        const text = g.children[1];
        
        const maxVal = Math.max(...this.array);
        rect.setAttribute('y', this.height - (value / maxVal * this.height * 0.8));
        rect.setAttribute('height', (value / maxVal * this.height * 0.8));
        text.textContent = value;
    }

    clearHighlights() {
        this.svg.querySelectorAll('.array-element').forEach(el => {
            el.classList.remove('comparing', 'sorted', 'current-gap', 'swapping');
        });
    }

    highlightElements(indices, className) {
        indices.forEach(idx => {
            if (idx >= 0 && idx < this.array.length) {
                const rect = this.svg.children[idx].children[0];
                rect.classList.add(className);
            }
        });
    }

    async shellSort() {
        const n = this.array.length;
        
        // Generate gap sequence (using Shell's original sequence)
        let gap = Math.floor(n/2);
        
        while (gap > 0 && this.isPlaying) {
            document.getElementById('currentStep').textContent = 
                `Current gap size: ${gap}`;

            // Highlight current gap pattern
            for (let i = 0; i < n; i += gap) {
                this.highlightElements([i], 'current-gap');
            }
            await this.sleep(this.animationSpeed);

            // Do a gapped insertion sort
            for (let i = gap; i < n && this.isPlaying; i++) {
                const temp = this.array[i];
                let j = i;

                // Highlight elements being compared
                this.highlightElements([i, j-gap], 'comparing');
                await this.sleep(this.animationSpeed);

                while (j >= gap && this.array[j - gap] > temp && this.isPlaying) {
                    // Show swap
                    this.highlightElements([j, j-gap], 'swapping');
                    await this.sleep(this.animationSpeed/2);

                    this.array[j] = this.array[j - gap];
                    this.updateElement(j, this.array[j]);
                    
                    j -= gap;
                    
                    if (j >= gap) {
                        this.highlightElements([j, j-gap], 'comparing');
                        await this.sleep(this.animationSpeed/2);
                    }
                }

                this.array[j] = temp;
                this.updateElement(j, this.array[j]);
            }

            gap = Math.floor(gap/2);
        }

        // Show final sorted state
        for (let i = 0; i < n; i++) {
            this.highlightElements([i], 'sorted');
            await this.sleep(50);
        }
        
        document.getElementById('currentStep').textContent = 'Array sorted!';
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        document.getElementById('startVisualization').disabled = true;
        await this.shellSort();
        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
    }

    reset() {
        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
        document.getElementById('currentStep').textContent = 'Click Start to begin visualization';
        this.array = [...this.originalArray];
        this.initializeVisualization();
        this.clearHighlights();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ShellSortVisualizer('shellSortVisualization');
}); 