class RadixSortVisualizer {
    constructor(svgId) {
        this.svg = document.getElementById(svgId);
        this.originalArray = [170, 45, 75, 90, 802, 24, 2, 66];
        this.array = [...this.originalArray];
        this.isPlaying = false;
        this.animationSpeed = 1000;
        
        this.width = this.svg.clientWidth;
        this.height = this.svg.clientHeight;
        this.mainHeight = this.height * 0.7; // Main array takes 70% of height
        this.bucketHeight = this.height * 0.2; // Buckets take 20% of height
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
        
        // Create main array group
        const mainGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        mainGroup.setAttribute('class', 'main-array');
        
        // Create buckets group (0-9)
        const bucketsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        bucketsGroup.setAttribute('class', 'buckets');
        bucketsGroup.setAttribute('transform', `translate(0, ${this.mainHeight + 20})`);
        
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
        
        // Initialize buckets (0-9)
        for(let i = 0; i < 10; i++) {
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.setAttribute('class', `bucket-${i}`);
            
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute('x', (i * this.width/10) + this.width/20);
            text.setAttribute('y', -5);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('class', 'bucket-label');
            text.textContent = i;
            
            g.appendChild(text);
            bucketsGroup.appendChild(g);
        }
        
        this.svg.appendChild(mainGroup);
        this.svg.appendChild(bucketsGroup);
    }

    updateElement(index, value) {
        const g = this.svg.querySelector('.main-array').children[index];
        const rect = g.children[0];
        const text = g.children[1];
        
        const maxVal = Math.max(...this.array);
        rect.setAttribute('y', this.mainHeight - (value / maxVal * this.mainHeight * 0.8));
        rect.setAttribute('height', (value / maxVal * this.mainHeight * 0.8));
        text.textContent = value;
    }

    clearHighlights() {
        this.svg.querySelectorAll('.array-element').forEach(el => {
            el.classList.remove('comparing', 'sorted', 'current-digit');
        });
        this.clearBuckets();
    }

    clearBuckets() {
        for(let i = 0; i < 10; i++) {
            const bucket = this.svg.querySelector(`.bucket-${i}`);
            while(bucket.children.length > 1) {
                bucket.removeChild(bucket.lastChild);
            }
        }
    }

    highlightElements(indices, className) {
        indices.forEach(idx => {
            if (idx >= 0 && idx < this.array.length) {
                const rect = this.svg.querySelector('.main-array').children[idx].children[0];
                rect.classList.add(className);
            }
        });
    }

    async addToBucket(value, bucketIndex, position) {
        const bucket = this.svg.querySelector(`.bucket-${bucketIndex}`);
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute('x', (bucketIndex * this.width/10) + this.width/40);
        rect.setAttribute('y', position * 20);
        rect.setAttribute('width', this.width/20);
        rect.setAttribute('height', 15);
        rect.setAttribute('class', 'bucket-element');
        
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute('x', (bucketIndex * this.width/10) + this.width/20);
        text.setAttribute('y', position * 20 + 12);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('class', 'bucket-label');
        text.textContent = value;
        
        g.appendChild(rect);
        g.appendChild(text);
        bucket.appendChild(g);
    }

    getDigit(num, place) {
        return Math.floor(Math.abs(num) / Math.pow(10, place)) % 10;
    }

    async radixSort() {
        const maxNum = Math.max(...this.array);
        const maxDigits = Math.floor(Math.log10(maxNum)) + 1;
        
        for(let digit = 0; digit < maxDigits && this.isPlaying; digit++) {
            document.getElementById('currentStep').textContent = 
                `Sorting by ${digit === 0 ? 'ones' : digit === 1 ? 'tens' : digit === 2 ? 'hundreds' : 'thousands'} place`;
            
            const buckets = Array.from({length: 10}, () => []);
            
            // Distribute numbers into buckets
            for(let i = 0; i < this.array.length && this.isPlaying; i++) {
                const currentDigit = this.getDigit(this.array[i], digit);
                this.highlightElements([i], 'current-digit');
                await this.sleep(this.animationSpeed/2);
                
                buckets[currentDigit].push(this.array[i]);
                await this.addToBucket(this.array[i], currentDigit, buckets[currentDigit].length - 1);
                await this.sleep(this.animationSpeed/2);
            }
            
            // Collect numbers from buckets
            let arrayIndex = 0;
            for(let i = 0; i < 10 && this.isPlaying; i++) {
                for(let j = 0; j < buckets[i].length && this.isPlaying; j++) {
                    this.array[arrayIndex] = buckets[i][j];
                    this.updateElement(arrayIndex, buckets[i][j]);
                    this.highlightElements([arrayIndex], 'sorted');
                    arrayIndex++;
                    await this.sleep(this.animationSpeed/2);
                }
            }
            
            await this.sleep(this.animationSpeed);
            this.clearBuckets();
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
        await this.radixSort();
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
    new RadixSortVisualizer('radixSortVisualization');
}); 