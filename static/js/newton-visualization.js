class NewtonVisualizer {
    constructor() {
        this.functionInput = document.getElementById('functionInput');
        this.initialGuessInput = document.getElementById('initialGuess');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.speedControl = document.getElementById('speedControl');
        this.currentStep = document.getElementById('currentStep');
        this.canvas = document.getElementById('newtonCanvas');
        
        this.chart = null;
        this.isRunning = false;
        this.speed = 1000;
        this.maxIterations = 20;
        this.epsilon = 0.0001;
        
        this.setupEventListeners();
        this.initializeChart();
        
        // Make visualization responsive
        window.addEventListener('resize', () => {
            if (this.chart) {
                this.chart.resize();
                this.updateChartStyles();
            }
        });
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.speedControl.addEventListener('input', (e) => {
            this.speed = 1000 / e.target.value;
        });
    }

    updateChartStyles() {
        const isMobile = window.innerWidth < 768;
        if (this.chart) {
            // Update font sizes
            this.chart.options.scales.x.ticks.font = {
                size: isMobile ? 10 : 12
            };
            this.chart.options.scales.y.ticks.font = {
                size: isMobile ? 10 : 12
            };
            
            // Update point sizes
            this.chart.data.datasets[2].pointRadius = isMobile ? 3 : 5;
            this.chart.data.datasets[2].pointHoverRadius = isMobile ? 5 : 7;
            
            // Update line widths
            this.chart.data.datasets[0].borderWidth = isMobile ? 1.5 : 2;
            this.chart.data.datasets[1].borderWidth = isMobile ? 1.5 : 2;
            
            // Update padding
            this.chart.options.layout.padding = isMobile ? 10 : 20;
            
            this.chart.update();
        }
    }

    initializeChart() {
        const isMobile = window.innerWidth < 768;
        
        this.chart = new Chart(this.canvas, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Function',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: isMobile ? 1.5 : 2,
                    fill: false,
                    data: []
                }, {
                    label: 'Tangent Line',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: isMobile ? 1.5 : 2,
                    fill: false,
                    data: []
                }, {
                    label: 'Points',
                    backgroundColor: 'rgba(75, 192, 192, 1)',
                    pointRadius: isMobile ? 3 : 5,
                    pointHoverRadius: isMobile ? 5 : 7,
                    showLine: false,
                    data: []
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                layout: {
                    padding: isMobile ? 10 : 20
                },
                scales: {
                    x: {
                        type: 'linear',
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#fff',
                            font: {
                                size: isMobile ? 10 : 12
                            },
                            maxRotation: 0
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#fff',
                            font: {
                                size: isMobile ? 10 : 12
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff',
                            font: {
                                size: isMobile ? 10 : 12
                            },
                            boxWidth: isMobile ? 12 : 16
                        }
                    }
                }
            }
        });
    }

    evaluateFunction(x, expression) {
        try {
            const scope = { x: x };
            return math.evaluate(expression, scope);
        } catch (error) {
            throw new Error('Invalid function expression');
        }
    }

    evaluateDerivative(x, expression) {
        try {
            const h = 0.0001;
            const y1 = this.evaluateFunction(x - h, expression);
            const y2 = this.evaluateFunction(x + h, expression);
            return (y2 - y1) / (2 * h);
        } catch (error) {
            throw new Error('Could not compute derivative');
        }
    }

    generateFunctionPoints(expression, xMin, xMax, points = 200) {
        const data = [];
        const isMobile = window.innerWidth < 768;
        const numPoints = isMobile ? 100 : 200; // Fewer points on mobile for better performance
        const step = (xMax - xMin) / numPoints;
        
        for (let x = xMin; x <= xMax; x += step) {
            try {
                const y = this.evaluateFunction(x, expression);
                if (Math.abs(y) < 1000) { // Prevent extreme values
                    data.push({x, y});
                }
            } catch (error) {
                continue;
            }
        }
        
        return data;
    }

    generateTangentLine(x0, y0, slope, width = 2) {
        const isMobile = window.innerWidth < 768;
        const lineWidth = isMobile ? 1.5 : width;
        
        const x1 = x0 - lineWidth;
        const x2 = x0 + lineWidth;
        const y1 = y0 - slope * lineWidth;
        const y2 = y0 + slope * lineWidth;
        
        return [{x: x1, y: y1}, {x: x2, y: y2}];
    }

    async start() {
        if (this.isRunning) return;
        
        const expression = this.functionInput.value;
        const x0 = parseFloat(this.initialGuessInput.value);
        
        if (!expression || isNaN(x0)) {
            this.currentStep.textContent = 'Please enter a valid function and initial guess';
            return;
        }

        this.isRunning = true;
        this.startBtn.disabled = true;
        
        try {
            // Generate function points
            const isMobile = window.innerWidth < 768;
            const xRange = isMobile ? 6 : 10; // Smaller range on mobile
            const functionPoints = this.generateFunctionPoints(expression, x0 - xRange, x0 + xRange);
            this.chart.data.datasets[0].data = functionPoints;
            
            let x = x0;
            let iteration = 0;
            
            while (iteration < this.maxIterations) {
                const fx = this.evaluateFunction(x, expression);
                const fpx = this.evaluateDerivative(x, expression);
                
                // Generate tangent line
                const tangentPoints = this.generateTangentLine(x, fx, fpx);
                this.chart.data.datasets[1].data = tangentPoints;
                
                // Add current point
                this.chart.data.datasets[2].data = [{x: x, y: fx}];
                this.chart.update();
                
                // Calculate next x
                const nextX = x - fx / fpx;
                
                this.currentStep.textContent = 
                    `Iteration ${iteration + 1}: x = ${x.toFixed(6)}, f(x) = ${fx.toFixed(6)}`;
                
                await this.sleep(this.speed);
                
                if (Math.abs(nextX - x) < this.epsilon) {
                    this.currentStep.textContent = 
                        `Root found at x = ${nextX.toFixed(6)} after ${iteration + 1} iterations`;
                    break;
                }
                
                x = nextX;
                iteration++;
            }
            
            if (iteration >= this.maxIterations) {
                this.currentStep.textContent = 'Maximum iterations reached without convergence';
            }
            
        } catch (error) {
            this.currentStep.textContent = `Error: ${error.message}`;
        }
        
        this.isRunning = false;
        this.startBtn.disabled = false;
    }

    reset() {
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.functionInput.value = '';
        this.initialGuessInput.value = '';
        this.currentStep.textContent = 'Enter a function and initial guess to begin';
        
        this.chart.data.datasets.forEach(dataset => {
            dataset.data = [];
        });
        this.chart.update();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize visualization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NewtonVisualizer();
}); 