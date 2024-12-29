class QuickSortVisualizer {
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
    
    async quickSort(arr = this.array, low = 0, high = this.array.length - 1) {
        if (low < high && this.isPlaying) {
            // Clear previous highlights
            this.clearHighlights();
            
            // Highlight the current subarray
            this.highlightRange(low, high, 'subarray');
            await this.sleep(this.animationSpeed);
            
            // Choose pivot (last element)
            this.highlightElements([high], 'pivot');
            await this.sleep(this.animationSpeed);
            
            const pivotIndex = await this.partition(arr, low, high);
            
            if (!this.isPlaying) return; // Check if stopped
            
            // Show pivot in its final position
            this.highlightElements([pivotIndex], 'sorted');
            await this.sleep(this.animationSpeed);
            
            // Recursively sort the left and right parts
            await this.quickSort(arr, low, pivotIndex - 1);
            await this.quickSort(arr, pivotIndex + 1, high);
        }
        
        if (low === 0 && high === this.array.length - 1 && this.isPlaying) {
            // Final array is sorted
            this.highlightRange(0, this.array.length - 1, 'sorted');
        }
    }
    
    clearHighlights() {
        this.svg.querySelectorAll('.array-element').forEach(el => {
            el.classList.remove('comparing', 'sorted', 'pivot', 'swapping', 'subarray');
        });
    }
    
    async partition(arr, low, high) {
        if (!this.isPlaying) return low;
        
        const pivot = arr[high];
        let i = low - 1;
        
        for (let j = low; j < high && this.isPlaying; j++) {
            // Highlight current element being compared
            this.highlightElements([j], 'comparing');
            await this.sleep(this.animationSpeed / 2);
            
            if (arr[j] <= pivot) {
                i++;
                // Swap elements
                [arr[i], arr[j]] = [arr[j], arr[i]];
                this.updateElement(i, arr[i]);
                this.updateElement(j, arr[j]);
                
                // Highlight swapped elements
                this.highlightElements([i, j], 'swapping');
                await this.sleep(this.animationSpeed / 2);
            }
        }
        
        if (!this.isPlaying) return i + 1;
        
        // Place pivot in its final position
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        this.updateElement(i + 1, arr[i + 1]);
        this.updateElement(high, arr[high]);
        
        return i + 1;
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
        await this.quickSort();
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
    new QuickSortVisualizer('quickSortVisualization');
}); 