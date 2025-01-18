class SubsetSumVisualizer {
    constructor() {
        this.numbers = [3, 7, 4, 2, 6];
        this.targetSum = 13;
        this.currentSubset = [];
        this.isPlaying = false;
        this.animationSpeed = 500;
        this.shouldStop = false;
        
        this.setupControls();
        this.drawVisualization();
    }
    
    setupControls() {
        document.getElementById('startVisualization').addEventListener('click', () => this.start());
        document.getElementById('resetVisualization').addEventListener('click', () => this.reset());
        document.getElementById('numbersInput').addEventListener('change', (e) => {
            this.numbers = e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
            this.drawVisualization();
        });
        document.getElementById('targetInput').addEventListener('change', (e) => {
            this.targetSum = parseInt(e.target.value);
            this.drawVisualization();
        });
        
        document.getElementById('speedControl').addEventListener('input', (e) => {
            this.animationSpeed = 500 - (e.target.value * 50);
        });
    }
    
    drawVisualization() {
        const container = document.getElementById('subsetContainer');
        container.innerHTML = '';
        
        // Draw numbers
        const numbersDiv = document.createElement('div');
        numbersDiv.className = 'numbers-container';
        this.numbers.forEach((num, idx) => {
            const numDiv = document.createElement('div');
            numDiv.className = 'number-cell';
            numDiv.textContent = num;
            if (this.currentSubset.includes(idx)) {
                numDiv.classList.add('selected');
            }
            numbersDiv.appendChild(numDiv);
        });
        container.appendChild(numbersDiv);
        
        // Draw current sum
        const sumDiv = document.createElement('div');
        sumDiv.className = 'sum-display';
        const currentSum = this.currentSubset.reduce((sum, idx) => sum + this.numbers[idx], 0);
        sumDiv.textContent = `Current Sum: ${currentSum} / Target: ${this.targetSum}`;
        container.appendChild(sumDiv);
    }
    
    async start() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.shouldStop = false;
        document.getElementById('startVisualization').disabled = true;
        
        this.currentSubset = [];
        const found = await this.findSubsetSum(0, 0);
        
        if (!this.shouldStop) {
            this.isPlaying = false;
            document.getElementById('startVisualization').disabled = false;
            document.getElementById('currentStep').textContent = 
                found ? 'Solution found!' : 'No solution exists!';
        }
    }
    
    reset() {
        this.shouldStop = true;
        this.isPlaying = false;
        this.currentSubset = [];
        this.drawVisualization();
        document.getElementById('startVisualization').disabled = false;
        document.getElementById('currentStep').textContent = 'Enter numbers and target sum, then click Start';
    }
    
    async findSubsetSum(index, currentSum) {
        if (this.shouldStop) return false;
        
        if (currentSum === this.targetSum) {
            return true;
        }
        
        if (index >= this.numbers.length || currentSum > this.targetSum) {
            return false;
        }
        
        document.getElementById('currentStep').textContent = 
            `Trying number ${this.numbers[index]} at position ${index + 1}`;
        
        // Include current number
        this.currentSubset.push(index);
        this.drawVisualization();
        await this.sleep(this.animationSpeed);
        
        if (await this.findSubsetSum(index + 1, currentSum + this.numbers[index])) {
            return true;
        }
        
        // Exclude current number
        this.currentSubset.pop();
        this.drawVisualization();
        await this.sleep(this.animationSpeed);
        
        return await this.findSubsetSum(index + 1, currentSum);
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SubsetSumVisualizer();
}); 