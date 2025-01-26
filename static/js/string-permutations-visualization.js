class StringPermutationsVisualizer {
    constructor() {
        this.input = 'ABC';
        this.currentPermutation = [];
        this.used = [];
        this.allPermutations = [];
        this.isPlaying = false;
        this.animationSpeed = 500;
        this.shouldStop = false;
        
        this.setupControls();
        this.initializeVisualization();
    }
    
    setupControls() {
        document.getElementById('startVisualization').addEventListener('click', () => this.start());
        document.getElementById('resetVisualization').addEventListener('click', () => this.reset());
        document.getElementById('inputString').addEventListener('change', (e) => {
            this.input = e.target.value.toUpperCase();
            if(this.input.length > 8) {
                this.input = this.input.slice(0, 8);
                e.target.value = this.input;
            }
            this.initializeVisualization();
        });
        
        document.getElementById('speedControl').addEventListener('input', (e) => {
            this.animationSpeed = 500 - (e.target.value * 45);
        });
    }
    
    initializeVisualization() {
        this.currentPermutation = Array(this.input.length).fill('');
        this.used = Array(this.input.length).fill(false);
        this.allPermutations = [];
        this.drawVisualization();
    }
    
    drawVisualization() {
        const container = document.getElementById('permutationsContainer');
        container.innerHTML = '';
        
        // Draw current permutation being built
        const currentDiv = document.createElement('div');
        currentDiv.className = 'current-permutation';
        
        for(let i = 0; i < this.input.length; i++) {
            const charDiv = document.createElement('div');
            charDiv.className = 'char-cell' + (this.currentPermutation[i] ? ' filled' : '');
            charDiv.textContent = this.currentPermutation[i] || '_';
            currentDiv.appendChild(charDiv);
        }
        container.appendChild(currentDiv);
        
        // Draw available characters
        const availableDiv = document.createElement('div');
        availableDiv.className = 'available-chars';
        for(let i = 0; i < this.input.length; i++) {
            const charDiv = document.createElement('div');
            charDiv.className = 'char-cell' + (this.used[i] ? ' used' : '');
            charDiv.textContent = this.input[i];
            availableDiv.appendChild(charDiv);
        }
        container.appendChild(availableDiv);
        
        // Draw found permutations
        const permutationsDiv = document.createElement('div');
        permutationsDiv.className = 'found-permutations';
        this.allPermutations.forEach(perm => {
            const permDiv = document.createElement('div');
            permDiv.className = 'permutation';
            permDiv.textContent = perm;
            permutationsDiv.appendChild(permDiv);
        });
        container.appendChild(permutationsDiv);
    }
    
    async start() {
        if(this.isPlaying) return;
        
        this.isPlaying = true;
        this.shouldStop = false;
        document.getElementById('startVisualization').disabled = true;
        
        this.initializeVisualization();
        await this.generatePermutations(0);
        
        if(!this.shouldStop) {
            this.isPlaying = false;
            document.getElementById('startVisualization').disabled = false;
            document.getElementById('currentStep').textContent = 
                `Found ${this.allPermutations.length} permutations!`;
        }
    }
    
    reset() {
        this.shouldStop = true;
        this.isPlaying = false;
        this.initializeVisualization();
        document.getElementById('startVisualization').disabled = false;
        document.getElementById('currentStep').textContent = 'Enter a string and click Start';
    }
    
    async generatePermutations(pos) {
        if(this.shouldStop) return;
        
        if(pos === this.input.length) {
            this.allPermutations.push(this.currentPermutation.join(''));
            this.drawVisualization();
            await this.sleep(this.animationSpeed);
            return;
        }
        
        for(let i = 0; i < this.input.length; i++) {
            if(!this.used[i]) {
                this.used[i] = true;
                this.currentPermutation[pos] = this.input[i];
                
                document.getElementById('currentStep').textContent = 
                    `Trying ${this.input[i]} at position ${pos + 1}`;
                
                this.drawVisualization();
                await this.sleep(this.animationSpeed);
                
                await this.generatePermutations(pos + 1);
                
                this.used[i] = false;
                this.currentPermutation[pos] = '';
                this.drawVisualization();
                await this.sleep(this.animationSpeed/2);
            }
        }
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new StringPermutationsVisualizer();
}); 