class FibonacciVisualizer {
    constructor() {
        this.input = document.getElementById('fibInput');
        this.calculateBtn = document.getElementById('calculateFib');
        this.visualizationArea = document.getElementById('fibVisualization');
        this.stepDisplay = document.getElementById('currentStep');
        this.isAnimating = false;
        this.animationSpeed = 1000;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.calculateBtn.addEventListener('click', () => this.startVisualization());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.startVisualization();
            }
        });
        
        // Limit input to reasonable numbers to prevent overflow
        this.input.addEventListener('input', () => {
            const value = parseInt(this.input.value);
            if (value > 23) {
                this.input.value = 23;
            }
        });
    }
    
    async startVisualization() {
        if (this.isAnimating) return;
        
        const n = parseInt(this.input.value);
        if (isNaN(n) || n < 0) {
            this.stepDisplay.textContent = 'Please enter a valid non-negative number';
            return;
        }
        
        this.isAnimating = true;
        this.calculateBtn.disabled = true;
        this.visualizationArea.innerHTML = '';
        
        await this.visualizeFibonacci(n);
        
        this.isAnimating = false;
        this.calculateBtn.disabled = false;
    }
    
    async visualizeFibonacci(n) {
        // Create sequence container
        const sequenceContainer = document.createElement('div');
        sequenceContainer.className = 'sequence-container';
        this.visualizationArea.appendChild(sequenceContainer);
        
        if (n === 0) {
            this.addNumber(sequenceContainer, 0, 0);
            this.stepDisplay.textContent = 'F(0) = 0';
            return;
        }
        
        let prev = 0, curr = 1;
        this.addNumber(sequenceContainer, prev, 0);
        
        if (n >= 1) {
            await this.sleep(this.animationSpeed);
            this.addNumber(sequenceContainer, curr, 1);
        }
        
        for (let i = 2; i <= n; i++) {
            await this.sleep(this.animationSpeed);
            
            const next = prev + curr;
            this.addNumber(sequenceContainer, next, i);
            
            // Show calculation step
            this.stepDisplay.textContent = `F(${i}) = F(${i-1}) + F(${i-2}) = ${curr} + ${prev} = ${next}`;
            
            prev = curr;
            curr = next;
        }
    }
    
    addNumber(container, number, index) {
        const numberDiv = document.createElement('div');
        numberDiv.className = 'fib-number';
        numberDiv.innerHTML = `
            <div class="number-value">${number}</div>
            <div class="number-index">F(${index})</div>
        `;
        container.appendChild(numberDiv);
        
        // Scroll to the latest number
        container.scrollLeft = container.scrollWidth;
        
        // Add animation class
        setTimeout(() => numberDiv.classList.add('visible'), 50);
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize visualization when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new FibonacciVisualizer();
}); 