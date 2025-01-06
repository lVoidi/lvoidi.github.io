class HeapSortVisualizer {
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
            el.classList.remove('comparing', 'sorted', 'pivot', 'swapping', 'heap-parent', 'heap-child');
        });
    }

    highlightElements(indices, className) {
        this.clearHighlights();
        indices.forEach(idx => {
            if (idx >= 0 && idx < this.array.length) {
                const rect = this.svg.children[idx].children[0];
                rect.classList.add(className);
            }
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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

    async heapify(n, i) {
        if (!this.isPlaying) return;

        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        // Update step description
        document.getElementById('currentStep').textContent = 
            `Heapifying at index ${i}, comparing with children at ${left} and ${right}`;

        // Highlight parent and children
        this.highlightElements([i], 'heap-parent');
        await this.sleep(this.animationSpeed / 2);
        
        if (left < n) this.highlightElements([i, left], 'comparing');
        await this.sleep(this.animationSpeed / 2);

        if (left < n && this.array[left] > this.array[largest]) {
            largest = left;
        }

        if (right < n) this.highlightElements([i, right], 'comparing');
        await this.sleep(this.animationSpeed / 2);

        if (right < n && this.array[right] > this.array[largest]) {
            largest = right;
        }

        if (largest !== i) {
            // Swap elements
            this.highlightElements([i, largest], 'swapping');
            await this.sleep(this.animationSpeed);
            
            [this.array[i], this.array[largest]] = [this.array[largest], this.array[i]];
            this.updateElement(i, this.array[i]);
            this.updateElement(largest, this.array[largest]);
            
            await this.sleep(this.animationSpeed);
            await this.heapify(n, largest);
        }
    }

    async heapSort() {
        // Build max heap
        document.getElementById('currentStep').textContent = 'Building max heap...';
        for (let i = Math.floor(this.array.length / 2) - 1; i >= 0 && this.isPlaying; i--) {
            await this.heapify(this.array.length, i);
        }

        // Extract elements from heap one by one
        for (let i = this.array.length - 1; i > 0 && this.isPlaying; i--) {
            document.getElementById('currentStep').textContent = 
                `Extracting maximum element and placing at position ${i}`;

            // Move current root to end
            this.highlightElements([0, i], 'swapping');
            await this.sleep(this.animationSpeed);
            
            [this.array[0], this.array[i]] = [this.array[i], this.array[0]];
            this.updateElement(0, this.array[0]);
            this.updateElement(i, this.array[i]);
            
            // Mark the last element as sorted
            this.highlightElements([i], 'sorted');
            await this.sleep(this.animationSpeed);

            // Call max heapify on the reduced heap
            await this.heapify(i, 0);
        }

        // Mark the first element as sorted
        this.highlightElements([0], 'sorted');
        document.getElementById('currentStep').textContent = 'Array sorted!';
    }

    async start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        document.getElementById('startVisualization').disabled = true;
        await this.heapSort();
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

// Initialize visualization when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new HeapSortVisualizer('heapSortVisualization');
}); 