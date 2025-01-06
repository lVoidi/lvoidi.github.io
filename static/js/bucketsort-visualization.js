class BucketSortVisualizer {
    constructor(svgId) {
        this.svg = document.getElementById(svgId);
        this.originalArray = [0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68];
        this.array = [...this.originalArray];
        this.buckets = [];
        this.numBuckets = 5;
        this.isPlaying = false;
        this.animationSpeed = 1000;
        
        this.width = this.svg.clientWidth;
        this.height = this.svg.clientHeight;
        this.mainHeight = this.height * 0.4; // Main array takes 40% of height
        this.bucketHeight = this.height * 0.5; // Buckets take 50% of height
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
        
        // Create main array group
        const mainGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        mainGroup.setAttribute('class', 'main-array');
        
        // Create buckets group
        const bucketsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        bucketsGroup.setAttribute('class', 'buckets');
        bucketsGroup.setAttribute('transform', `translate(0, ${this.mainHeight + 20})`);
        
        // Initialize main array visualization
        this.array.forEach((val, idx) => {
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute('x', idx * (this.barWidth * 2));
            rect.setAttribute('y', this.mainHeight - (val * this.mainHeight * 0.9));
            rect.setAttribute('width', this.barWidth);
            rect.setAttribute('height', val * this.mainHeight * 0.9);
            rect.setAttribute('class', 'array-element');
            
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute('x', idx * (this.barWidth * 2) + this.barWidth/2);
            text.setAttribute('y', this.mainHeight - 5);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('class', 'array-label');
            text.textContent = val.toFixed(2);
            
            g.appendChild(rect);
            g.appendChild(text);
            mainGroup.appendChild(g);
        });
        
        // Initialize buckets
        for(let i = 0; i < this.numBuckets; i++) {
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.setAttribute('class', `bucket-${i}`);
            
            const bucketRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            bucketRect.setAttribute('x', (i * this.width/this.numBuckets));
            bucketRect.setAttribute('y', 0);
            bucketRect.setAttribute('width', this.width/this.numBuckets - 5);
            bucketRect.setAttribute('height', this.bucketHeight);
            bucketRect.setAttribute('class', 'bucket-container');
            
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute('x', (i * this.width/this.numBuckets) + (this.width/this.numBuckets)/2);
            text.setAttribute('y', -5);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('class', 'bucket-label');
            text.textContent = `${(i/this.numBuckets).toFixed(2)}-${((i+1)/this.numBuckets).toFixed(2)}`;
            
            g.appendChild(bucketRect);
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
        
        rect.setAttribute('y', this.mainHeight - (value * this.mainHeight * 0.9));
        rect.setAttribute('height', value * this.mainHeight * 0.9);
        text.textContent = value.toFixed(2);
    }

    clearHighlights() {
        this.svg.querySelectorAll('.array-element').forEach(el => {
            el.classList.remove('comparing', 'sorted', 'distributing');
        });
        this.clearBuckets();
    }

    clearBuckets() {
        for(let i = 0; i < this.numBuckets; i++) {
            const bucket = this.svg.querySelector(`.bucket-${i}`);
            while(bucket.children.length > 2) {
                bucket.removeChild(bucket.lastChild);
            }
        }
    }

    async addToBucket(value, bucketIndex, position) {
        const bucket = this.svg.querySelector(`.bucket-${bucketIndex}`);
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        const bucketWidth = this.width/this.numBuckets - 5;
        rect.setAttribute('x', 5);
        rect.setAttribute('y', this.bucketHeight - (position + 1) * 25);
        rect.setAttribute('width', bucketWidth - 10);
        rect.setAttribute('height', 20);
        rect.setAttribute('class', 'bucket-element');
        
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute('x', bucketWidth/2);
        text.setAttribute('y', this.bucketHeight - (position + 1) * 25 + 15);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('class', 'bucket-label');
        text.textContent = value.toFixed(2);
        
        g.appendChild(rect);
        g.appendChild(text);
        bucket.appendChild(g);
    }

    async bucketSort() {
        // Create buckets
        this.buckets = Array.from({length: this.numBuckets}, () => []);
        
        // Distribute elements into buckets
        document.getElementById('currentStep').textContent = 'Distributing elements into buckets...';
        for(let i = 0; i < this.array.length && this.isPlaying; i++) {
            const bucketIndex = Math.floor(this.array[i] * this.numBuckets);
            this.highlightElements([i], 'distributing');
            await this.sleep(this.animationSpeed/2);
            
            this.buckets[bucketIndex].push(this.array[i]);
            await this.addToBucket(this.array[i], bucketIndex, this.buckets[bucketIndex].length - 1);
            await this.sleep(this.animationSpeed/2);
        }
        
        // Sort individual buckets
        document.getElementById('currentStep').textContent = 'Sorting individual buckets...';
        for(let i = 0; i < this.numBuckets && this.isPlaying; i++) {
            this.buckets[i].sort((a, b) => a - b);
            await this.sleep(this.animationSpeed);
            
            // Update bucket visualization
            const bucket = this.svg.querySelector(`.bucket-${i}`);
            while(bucket.children.length > 2) bucket.removeChild(bucket.lastChild);
            for(let j = 0; j < this.buckets[i].length; j++) {
                await this.addToBucket(this.buckets[i][j], i, j);
            }
        }
        
        // Concatenate all buckets
        document.getElementById('currentStep').textContent = 'Combining sorted buckets...';
        let index = 0;
        for(let i = 0; i < this.numBuckets && this.isPlaying; i++) {
            for(let j = 0; j < this.buckets[i].length && this.isPlaying; j++) {
                this.array[index] = this.buckets[i][j];
                this.updateElement(index, this.buckets[i][j]);
                this.highlightElements([index], 'sorted');
                index++;
                await this.sleep(this.animationSpeed/2);
            }
        }
        
        document.getElementById('currentStep').textContent = 'Array sorted!';
    }

    highlightElements(indices, className) {
        indices.forEach(idx => {
            if (idx >= 0 && idx < this.array.length) {
                const rect = this.svg.querySelector('.main-array').children[idx].children[0];
                rect.classList.add(className);
            }
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        document.getElementById('startVisualization').disabled = true;
        await this.bucketSort();
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
    new BucketSortVisualizer('bucketSortVisualization');
}); 