class CountingSortVisualizer {
    constructor(svgId) {
        this.svg = document.getElementById(svgId);
        this.originalArray = [4, 2, 8, 3, 1, 9, 6, 7, 5];
        this.array = [...this.originalArray];
        this.countArray = [];
        this.isPlaying = false;
        this.animationSpeed = 1000;
        
        // Calculate dimensions for both arrays
        this.width = this.svg.clientWidth;
        this.height = this.svg.clientHeight;
        this.mainHeight = this.height * 0.6; // Main array takes 60% of height
        this.countHeight = this.height * 0.3; // Count array takes 30% of height
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
        
        // Create group for main array
        const mainGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        mainGroup.setAttribute('class', 'main-array');
        
        // Create group for count array
        const countGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        countGroup.setAttribute('class', 'count-array');
        countGroup.setAttribute('transform', `translate(0, ${this.mainHeight + 20})`);
        
        // Initialize main array visualization
        this.array.forEach((val, idx) => {
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute('x', idx * (this.barWidth * 2));
            rect.setAttribute('y', this.mainHeight - (val / maxVal * this.mainHeight * 0.8));
            rect.setAttribute('width', this.barWidth);
            rect.setAttribute('height', (val / maxVal * this.mainHeight * 0.8));
            rect.setAttribute('class', 'array-element');
            
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute('x', idx * (this.barWidth * 2) + this.barWidth/2);
            text.setAttribute('y', this.mainHeight - 5);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('class', 'array-label');
            text.textContent = val;
            
            g.appendChild(rect);
            g.appendChild(text);
            mainGroup.appendChild(g);
        });
        
        // Initialize count array (empty initially)
        this.countArray = new Array(Math.max(...this.array) + 1).fill(0);
        this.countArray.forEach((val, idx) => {
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute('x', idx * (this.barWidth * 2));
            rect.setAttribute('y', this.countHeight);
            rect.setAttribute('width', this.barWidth);
            rect.setAttribute('height', 0);
            rect.setAttribute('class', 'count-element');
            
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute('x', idx * (this.barWidth * 2) + this.barWidth/2);
            text.setAttribute('y', this.countHeight - 5);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('class', 'count-label');
            text.textContent = val;
            
            g.appendChild(rect);
            g.appendChild(text);
            countGroup.appendChild(g);
        });
        
        this.svg.appendChild(mainGroup);
        this.svg.appendChild(countGroup);
    }

    updateMainElement(index, value) {
        const g = this.svg.querySelector('.main-array').children[index];
        const rect = g.children[0];
        const text = g.children[1];
        
        const maxVal = Math.max(...this.array);
        rect.setAttribute('y', this.mainHeight - (value / maxVal * this.mainHeight * 0.8));
        rect.setAttribute('height', (value / maxVal * this.mainHeight * 0.8));
        text.textContent = value;
    }

    updateCountElement(index, value) {
        const g = this.svg.querySelector('.count-array').children[index];
        const rect = g.children[0];
        const text = g.children[1];
        
        const maxCount = Math.max(...this.countArray);
        rect.setAttribute('y', this.countHeight - (value / maxCount * this.countHeight * 0.8));
        rect.setAttribute('height', (value / maxCount * this.countHeight * 0.8));
        text.textContent = value;
    }

    clearHighlights() {
        this.svg.querySelectorAll('.array-element, .count-element').forEach(el => {
            el.classList.remove('comparing', 'counting', 'placing', 'sorted');
        });
    }

    highlightElements(indices, className, isCount = false) {
        const selector = isCount ? '.count-array' : '.main-array';
        indices.forEach(idx => {
            if (idx >= 0 && idx < (isCount ? this.countArray.length : this.array.length)) {
                const rect = this.svg.querySelector(selector).children[idx].children[0];
                rect.classList.add(className);
            }
        });
    }

    async countingSort() {
        const n = this.array.length;
        const max = Math.max(...this.array);
        this.countArray = new Array(max + 1).fill(0);
        
        // Step 1: Count occurrences
        document.getElementById('currentStep').textContent = 'Counting occurrences of each element...';
        for (let i = 0; i < n && this.isPlaying; i++) {
            this.highlightElements([i], 'comparing');
            await this.sleep(this.animationSpeed/2);
            
            this.countArray[this.array[i]]++;
            this.updateCountElement(this.array[i], this.countArray[this.array[i]]);
            this.highlightElements([this.array[i]], 'counting', true);
            
            await this.sleep(this.animationSpeed/2);
        }
        
        // Step 2: Calculate cumulative count
        document.getElementById('currentStep').textContent = 'Calculating cumulative count...';
        for (let i = 1; i <= max && this.isPlaying; i++) {
            this.highlightElements([i, i-1], 'comparing', true);
            await this.sleep(this.animationSpeed/2);
            
            this.countArray[i] += this.countArray[i - 1];
            this.updateCountElement(i, this.countArray[i]);
            
            await this.sleep(this.animationSpeed/2);
        }
        
        // Step 3: Build output array
        const output = new Array(n);
        document.getElementById('currentStep').textContent = 'Building sorted array...';
        for (let i = n - 1; i >= 0 && this.isPlaying; i--) {
            this.highlightElements([i], 'comparing');
            await this.sleep(this.animationSpeed/2);
            
            const currentElement = this.array[i];
            const position = this.countArray[currentElement] - 1;
            output[position] = currentElement;
            
            this.countArray[currentElement]--;
            this.updateCountElement(currentElement, this.countArray[currentElement]);
            
            this.highlightElements([position], 'placing');
            await this.sleep(this.animationSpeed/2);
        }
        
        // Update original array
        for (let i = 0; i < n && this.isPlaying; i++) {
            this.array[i] = output[i];
            this.updateMainElement(i, this.array[i]);
            this.highlightElements([i], 'sorted');
            await this.sleep(this.animationSpeed/4);
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
        await this.countingSort();
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
    new CountingSortVisualizer('countingSortVisualization');
}); 