class MonteCarloVisualizer {
    constructor() {
        this.canvas = document.getElementById('monteCarloCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.pointsInput = document.getElementById('pointsInput');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.speedControl = document.getElementById('speedControl');
        this.currentStep = document.getElementById('currentStep');
        
        // Stats elements
        this.pointsInsideElement = document.getElementById('pointsInside');
        this.totalPointsElement = document.getElementById('totalPoints');
        this.piEstimateElement = document.getElementById('piEstimate');
        this.errorElement = document.getElementById('error');
        
        // Visualization state
        this.isRunning = false;
        this.pointsInside = 0;
        this.totalPoints = 0;
        this.speed = 1000;
        this.points = [];
        
        this.setupCanvas();
        this.setupEventListeners();
        this.drawInitialState();
    }

    setupCanvas() {
        // Make canvas square and responsive
        const size = Math.min(
            this.canvas.parentElement.clientWidth,
            window.innerHeight * 0.6
        );
        this.canvas.width = size;
        this.canvas.height = size;
        this.radius = (size * 0.8) / 2;
        this.center = size / 2;
        
        // Set up scaling
        this.scale = this.radius;
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.speedControl.addEventListener('input', (e) => {
            this.speed = 1000 / e.target.value;
        });
        
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.drawInitialState();
            this.redrawPoints();
        });
    }

    drawInitialState() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set up coordinate system
        this.ctx.save();
        this.ctx.translate(this.center - this.radius, this.center - this.radius);
        
        // Draw square
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, this.radius * 2, this.radius * 2);
        
        // Draw quarter circle in top-right corner
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.radius * 2, 0, Math.PI/2);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.stroke();
        
        this.ctx.restore();
    }

    drawPoint(x, y, isInside) {
        const screenX = this.center - this.radius + x * this.scale * 2;
        const screenY = this.center - this.radius + y * this.scale * 2;
        
        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY, 2, 0, Math.PI * 2);
        this.ctx.fillStyle = isInside ? 
            'rgba(46, 204, 113, 0.8)' : // Green for inside
            'rgba(231, 76, 60, 0.8)';   // Red for outside
        this.ctx.fill();
    }

    isPointInQuarterCircle(x, y) {
        // Check if point is in top-left quarter circle
        return Math.sqrt((x) * (x) + (y) * (y)) <= 1;
    }

    redrawPoints() {
        this.drawInitialState();
        for (const point of this.points) {
            this.drawPoint(point.x, point.y, point.inside);
        }
    }

    updateStats() {
        const piEstimate = (this.pointsInside / this.totalPoints) * 4;
        const error = Math.abs((Math.PI - piEstimate) / Math.PI) * 100;
        
        this.pointsInsideElement.textContent = this.pointsInside;
        this.totalPointsElement.textContent = this.totalPoints;
        this.piEstimateElement.textContent = piEstimate.toFixed(6);
        this.errorElement.textContent = error.toFixed(2) + '%';
    }

    async start() {
        if (this.isRunning) return;
        
        const numPoints = parseInt(this.pointsInput.value);
        if (isNaN(numPoints) || numPoints < 100) {
            this.currentStep.textContent = 'Please enter a valid number of points (≥ 100)';
            return;
        }

        this.isRunning = true;
        this.startBtn.disabled = true;
        this.points = [];
        this.pointsInside = 0;
        this.totalPoints = 0;
        this.drawInitialState();

        const batchSize = Math.max(1, Math.floor(numPoints / 100));
        
        for (let i = 0; i < numPoints; i += batchSize) {
            for (let j = 0; j < batchSize && i + j < numPoints; j++) {
                const x = Math.random();
                const y = Math.random();
                const inside = this.isPointInQuarterCircle(x, y);
                
                this.points.push({ x, y, inside });
                this.drawPoint(x, y, inside);
                
                if (inside) this.pointsInside++;
                this.totalPoints++;
            }
            
            this.updateStats();
            this.currentStep.textContent = 
                `Generated ${this.totalPoints} of ${numPoints} points...`;
            
            await this.sleep(this.speed);
        }

        this.isRunning = false;
        this.startBtn.disabled = false;
        this.currentStep.textContent = 'Simulation complete!';
    }

    reset() {
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.points = [];
        this.pointsInside = 0;
        this.totalPoints = 0;
        this.drawInitialState();
        this.updateStats();
        this.currentStep.textContent = 'Enter number of points and click Start';
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize visualization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MonteCarloVisualizer();
}); 