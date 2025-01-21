class WordBreakVisualizer {
    constructor() {
        this.dictionary = new Set(['apple', 'pen', 'pine', 'pineapple', 'cat', 'cats', 'and', 'sand', 'dog']);
        this.input = 'pineappleanddog';
        this.currentBreaks = [];
        this.isPlaying = false;
        this.animationSpeed = 500;
        this.shouldStop = false;
        
        this.setupControls();
        this.drawVisualization();
    }
    
    setupControls() {
        document.getElementById('startVisualization').addEventListener('click', () => this.start());
        document.getElementById('resetVisualization').addEventListener('click', () => this.reset());
        document.getElementById('inputString').addEventListener('change', (e) => {
            this.input = e.target.value.toLowerCase().trim();
            this.drawVisualization();
        });
        document.getElementById('dictionaryInput').addEventListener('change', (e) => {
            this.dictionary = new Set(
                e.target.value.toLowerCase()
                    .split(',')
                    .map(word => word.trim())
                    .filter(word => word.length > 0)
            );
            this.drawVisualization();
        });
        
        document.getElementById('speedControl').addEventListener('input', (e) => {
            this.animationSpeed = 500 - (e.target.value * 50);
        });
    }
    
    drawVisualization() {
        const container = document.getElementById('wordContainer');
        container.innerHTML = '';
        
        // Create letter containers
        const wordDiv = document.createElement('div');
        wordDiv.className = 'word-container';
        
        for(let i = 0; i < this.input.length; i++) {
            const letterDiv = document.createElement('div');
            letterDiv.className = 'letter';
            letterDiv.textContent = this.input[i];
            
            // Add break if needed
            if(this.currentBreaks.includes(i)) {
                letterDiv.classList.add('break');
            }
            
            wordDiv.appendChild(letterDiv);
        }
        container.appendChild(wordDiv);
        
        // Show current segmentation
        const segmentationDiv = document.createElement('div');
        segmentationDiv.className = 'segmentation';
        const segments = this.getSegments();
        segmentationDiv.textContent = segments.join(' ');
        container.appendChild(segmentationDiv);
    }
    
    getSegments() {
        const breaks = [0, ...this.currentBreaks, this.input.length];
        const segments = [];
        for(let i = 0; i < breaks.length - 1; i++) {
            segments.push(this.input.slice(breaks[i], breaks[i + 1]));
        }
        return segments;
    }
    
    async start() {
        if(this.isPlaying) return;
        
        this.isPlaying = true;
        this.shouldStop = false;
        document.getElementById('startVisualization').disabled = true;
        
        this.currentBreaks = [];
        const found = await this.wordBreak(0);
        
        if(!this.shouldStop) {
            this.isPlaying = false;
            document.getElementById('startVisualization').disabled = false;
            document.getElementById('currentStep').textContent = 
                found ? 'Solution found!' : 'No solution exists!';
        }
    }
    
    reset() {
        this.shouldStop = true;
        this.isPlaying = false;
        this.currentBreaks = [];
        this.drawVisualization();
        document.getElementById('startVisualization').disabled = false;
        document.getElementById('currentStep').textContent = 'Enter a string and dictionary words, then click Start';
    }
    
    async wordBreak(start) {
        if(this.shouldStop) return false;
        
        if(start === this.input.length) {
            return true;
        }
        
        for(let end = start + 1; end <= this.input.length; end++) {
            const word = this.input.slice(start, end);
            document.getElementById('currentStep').textContent = 
                `Checking word: "${word}"`;
            
            if(this.dictionary.has(word)) {
                if(end < this.input.length) {
                    this.currentBreaks.push(end);
                }
                this.drawVisualization();
                await this.sleep(this.animationSpeed);
                
                if(await this.wordBreak(end)) {
                    return true;
                }
                
                if(end < this.input.length) {
                    this.currentBreaks.pop();
                }
                this.drawVisualization();
                await this.sleep(this.animationSpeed/2);
            }
        }
        
        return false;
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WordBreakVisualizer();
}); 