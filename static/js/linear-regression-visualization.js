class LinearRegressionVisualizer {
    constructor() {
        this.chart = null;
        this.data = [];
        this.weights = 0;
        this.bias = 0;
        this.learningRate = 0.01;
        this.isTraining = false;

        // DOM elements
        this.canvas = document.getElementById('regressionPlot');
        this.generateBtn = document.getElementById('generateData');
        this.fitBtn = document.getElementById('fitLine');
        this.resetBtn = document.getElementById('reset');
        this.learningRateInput = document.getElementById('learningRate');
        this.currentStepText = document.getElementById('currentStep');
        
        // Deshabilitar el botón de fit inicialmente
        this.fitBtn.disabled = true;

        this.setupEventListeners();
        this.initializeChart();

        // Manejar redimensionamiento
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleResize() {
        if (this.chart) {
            this.chart.resize();
        }
    }

    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateData());
        this.fitBtn.addEventListener('click', () => this.startTraining());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.learningRateInput.addEventListener('input', (e) => {
            this.learningRate = e.target.value / 1000;
            this.currentStepText.textContent = `Learning Rate: ${this.learningRate}`;
        });
    }

    initializeChart() {
        const ctx = this.canvas.getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Data Points',
                    data: [],
                    backgroundColor: 'rgba(80, 250, 123, 0.5)', // Verde Dracula
                }, {
                    label: 'Regression Line',
                    data: [],
                    type: 'line',
                    borderColor: 'rgba(189, 147, 249, 1)', // Púrpura Dracula
                    pointRadius: 0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 0 // Desactivar animaciones para mejor rendimiento
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#f8f8f2' // Color texto Dracula
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#f8f8f2' // Color texto Dracula
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#f8f8f2', // Color texto Dracula
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            }
        });
    }

    generateData(numPoints = 50) {
        // Generate random data points with some linear correlation
        this.data = [];
        const slope = Math.random() * 2 - 1; // Random slope between -1 and 1
        const intercept = Math.random() * 4 - 2; // Random intercept between -2 and 2

        for (let i = 0; i < numPoints; i++) {
            const x = Math.random() * 10 - 5; // x between -5 and 5
            const y = slope * x + intercept + (Math.random() - 0.5) * 2; // Add some noise
            this.data.push({x, y});
        }

        this.updateChart();
        this.currentStepText.textContent = 'Data generated! Click "Fit Line" to start training.';
        this.fitBtn.disabled = false;
    }

    async startTraining(epochs = 100) {
        if (this.isTraining) return;
        this.isTraining = true;
        this.fitBtn.disabled = true;
        this.generateBtn.disabled = true;

        // Initialize parameters
        this.weights = 0;
        this.bias = 0;

        for (let epoch = 0; epoch < epochs; epoch++) {
            // Compute gradients
            let dw = 0;
            let db = 0;
            
            for (const point of this.data) {
                const prediction = this.weights * point.x + this.bias;
                const error = prediction - point.y;
                dw += error * point.x;
                db += error;
            }

            // Update parameters
            dw /= this.data.length;
            db /= this.data.length;
            
            this.weights -= this.learningRate * dw;
            this.bias -= this.learningRate * db;

            // Update visualization every few epochs
            if (epoch % 5 === 0) {
                this.updateRegressionLine();
                this.currentStepText.textContent = `Training... Epoch ${epoch + 1}/${epochs}`;
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }

        this.isTraining = false;
        this.fitBtn.disabled = false;
        this.generateBtn.disabled = false;
        this.currentStepText.textContent = `Training complete! Final equation: y = ${this.weights.toFixed(2)}x + ${this.bias.toFixed(2)}`;
    }

    updateChart() {
        this.chart.data.datasets[0].data = this.data;
        this.updateRegressionLine();
        this.chart.update();
    }

    updateRegressionLine() {
        // Create line points
        const xMin = Math.min(...this.data.map(p => p.x));
        const xMax = Math.max(...this.data.map(p => p.x));
        
        this.chart.data.datasets[1].data = [
            {x: xMin, y: this.weights * xMin + this.bias},
            {x: xMax, y: this.weights * xMax + this.bias}
        ];
        
        this.chart.update();
    }

    reset() {
        this.data = [];
        this.weights = 0;
        this.bias = 0;
        this.isTraining = false;
        this.fitBtn.disabled = true;
        this.generateBtn.disabled = false;
        this.updateChart();
        this.currentStepText.textContent = 'Click "Generate Data" to begin';
    }
}

// Initialize visualization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LinearRegressionVisualizer();
}); 