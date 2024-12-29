class MergeSortVisualizer {
    constructor(svgId) {
        this.svg = document.getElementById(svgId);
        this.array = [8, 4, 2, 9, 3, 1, 6, 7, 5];
        this.steps = [];
        this.currentStep = 0;
        this.animationSpeed = 1000;
        this.isPlaying = false;
        
        this.width = this.svg.clientWidth;
        this.height = this.svg.clientHeight;
        this.barWidth = this.width / (this.array.length * 2);
        
        this.setupControls();
        this.initializeVisualization();
    }
    
    setupControls() {
        document.getElementById('startVisualization').addEventListener('click', () => this.start());
        document.getElementById('resetVisualization').addEventListener('click', () => this.reset());
        document.getElementById('speedControl').addEventListener('input', (e) => {
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
    
    async mergeSort(arr, start = 0, end = this.array.length - 1) {
        if (start >= end) return;
        
        const mid = Math.floor((start + end) / 2);
        await this.mergeSort(arr, start, mid);
        await this.mergeSort(arr, mid + 1, end);
        await this.merge(arr, start, mid, end);
    }
    
    async merge(arr, start, mid, end) {
        const left = arr.slice(start, mid + 1);
        const right = arr.slice(mid + 1, end + 1);
        
        let i = 0, j = 0, k = start;
        
        while (i < left.length && j < right.length) {
            this.highlightElements([k, mid + 1 + j], 'comparing');
            await this.sleep(this.animationSpeed);
            
            if (left[i] <= right[j]) {
                arr[k] = left[i];
                i++;
            } else {
                arr[k] = right[j];
                j++;
            }
            
            this.updateElement(k, arr[k]);
            this.highlightElements([k], 'sorted');
            k++;
        }
        
        while (i < left.length) {
            arr[k] = left[i];
            this.updateElement(k, arr[k]);
            this.highlightElements([k], 'sorted');
            i++;
            k++;
        }
        
        while (j < right.length) {
            arr[k] = right[j];
            this.updateElement(k, arr[k]);
            this.highlightElements([k], 'sorted');
            j++;
            k++;
        }
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
        this.svg.querySelectorAll('.array-element').forEach(el => {
            el.classList.remove('comparing', 'sorted');
        });
        
        indices.forEach(idx => {
            const rect = this.svg.children[idx].children[0];
            rect.classList.add(className);
        });
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        document.getElementById('startVisualization').disabled = true;
        await this.mergeSort([...this.array]);
        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
    }
    
    reset() {
        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
        this.initializeVisualization();
    }
}

// Initialize visualization when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MergeSortVisualizer('mergeSortVisualization');
}); 