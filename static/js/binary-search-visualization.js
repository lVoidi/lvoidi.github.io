class BinarySearchVisualizer {
    constructor(svgId) {
        this.svg = document.getElementById(svgId);
        this.originalArray = [1, 3, 5, 7, 9, 11, 13, 15, 17];
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
        const searchBtn = document.getElementById('startVisualization');
        const resetBtn = document.getElementById('resetVisualization');
        const speedControl = document.getElementById('speedControl');
        const searchInput = document.getElementById('searchTarget');

        searchBtn.addEventListener('click', () => {
            const target = parseInt(searchInput.value);
            if (!isNaN(target)) {
                this.start(target);
            }
        });
        
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
    
    async binarySearch(target) {
        let left = 0;
        let right = this.array.length - 1;
        
        while (left <= right && this.isPlaying) {
            this.clearHighlights();
            
            // Highlight current search range
            this.highlightRange(left, right, 'search-range');
            await this.sleep(this.animationSpeed);
            
            const mid = Math.floor((left + right) / 2);
            
            // Highlight middle element
            this.highlightElements([mid], 'comparing');
            await this.sleep(this.animationSpeed);
            
            document.getElementById('currentStep').textContent = 
                `Comparing ${this.array[mid]} with target ${target}`;
            
            if (this.array[mid] === target) {
                this.highlightElements([mid], 'found');
                document.getElementById('currentStep').textContent = 
                    `Found ${target} at index ${mid}!`;
                return mid;
            }
            
            if (this.array[mid] < target) {
                left = mid + 1;
                document.getElementById('currentStep').textContent = 
                    `${target} is greater than ${this.array[mid]}, searching right half`;
            } else {
                right = mid - 1;
                document.getElementById('currentStep').textContent = 
                    `${target} is less than ${this.array[mid]}, searching left half`;
            }
            
            await this.sleep(this.animationSpeed);
        }
        
        document.getElementById('currentStep').textContent = 
            `${target} not found in the array`;
        return -1;
    }
    
    clearHighlights() {
        this.svg.querySelectorAll('.array-element').forEach(el => {
            el.classList.remove('comparing', 'found', 'search-range');
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
    
    highlightRange(start, end, className) {
        for (let i = start; i <= end; i++) {
            if (i >= 0 && i < this.array.length) {
                const rect = this.svg.children[i].children[0];
                rect.classList.add(className);
            }
        }
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async start(target) {
        if (this.isPlaying) return;
        this.isPlaying = true;
        document.getElementById('startVisualization').disabled = true;
        await this.binarySearch(target);
        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
    }
    
    reset() {
        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
        document.getElementById('searchTarget').value = '';
        document.getElementById('currentStep').textContent = 'Enter a number and click Search to begin';
        this.array = [...this.originalArray];
        this.initializeVisualization();
        this.clearHighlights();
    }
}

// Initialize visualization when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BinarySearchVisualizer('binarySearchVisualization');
}); 