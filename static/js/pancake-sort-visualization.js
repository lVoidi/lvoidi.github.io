class PancakeSortVisualizer {
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

    async findMax(start, end) {
        let maxIdx = start;
        for (let i = start; i <= end && this.isPlaying; i++) {
            this.highlightElements([i], 'comparing');
            await this.sleep(this.animationSpeed / 2);
            
            if (this.array[i] > this.array[maxIdx]) {
                maxIdx = i;
            }
        }
        return maxIdx;
    }

    async flip(end) {
        let start = 0;
        while (start < end && this.isPlaying) {
            this.highlightElements([start, end], 'swapping');
            await this.sleep(this.animationSpeed);
            
            [this.array[start], this.array[end]] = [this.array[end], this.array[start]];
            this.updateElement(start, this.array[start]);
            this.updateElement(end, this.array[end]);
            
            start++;
            end--;
        }
    }
    
    async pancakeSort() {
        const n = this.array.length;
        
        for (let currSize = n; currSize > 1 && this.isPlaying; currSize--) {
            // Find maximum element in the unsorted portion
            const maxIdx = await this.findMax(0, currSize - 1);
            
            if (maxIdx !== currSize - 1) {
                // If maximum is not at the end
                if (maxIdx !== 0) {
                    // Bring maximum to top
                    await this.flip(maxIdx);
                }
                // Move maximum to its final position
                await this.flip(currSize - 1);
            }
            
            // Mark the last element as sorted
            this.highlightElements([currSize - 1], 'sorted');
            await this.sleep(this.animationSpeed);
        }
        
        if (this.isPlaying) {
            // Final array is sorted
            this.highlightRange(0, this.array.length - 1, 'sorted');
        }
    }
    
    clearHighlights() {
        this.svg.querySelectorAll('.array-element').forEach(el => {
            el.classList.remove('comparing', 'sorted', 'swapping');
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
    
    highlightElements(indices, className) {
        this.clearHighlights();
        indices.forEach(idx => {
            const rect = this.svg.children[idx].children[0];
            rect.classList.add(className);
        });
    }
    
    highlightRange(start, end, className) {
        for (let i = start; i <= end; i++) {
            const rect = this.svg.children[i].children[0];
            rect.classList.add(className);
        }
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        document.getElementById('startVisualization').disabled = true;
        await this.pancakeSort();
        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
    }
    
    reset() {
        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
        this.array = [...this.originalArray];
        this.initializeVisualization();
        this.clearHighlights();
    }
}

// Initialize visualization when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PancakeSortVisualizer('quickSortVisualization');
});
