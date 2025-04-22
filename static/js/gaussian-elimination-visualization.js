// Gaussian Elimination Visualization
let canvas, ctx;
let matrix = [];
let steps = [];
let currentStep = 0;
let animationId;
let isAnimating = false;

// Initialize the visualization
function init() {
    canvas = document.getElementById('visualizer');
    ctx = canvas.getContext('2d');
    
    // Make canvas responsive
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = Math.min(400, Math.max(250, window.innerHeight * 0.4));
        
        // Redraw if we have data
        if (steps.length > 0) {
            draw();
        }
    }
    
    // Initial canvas sizing
    resizeCanvas();
    
    // Update canvas on window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Add event listeners
    document.getElementById('startBtn').addEventListener('click', toggleAnimation);
    document.getElementById('resetBtn').addEventListener('click', reset);
    document.getElementById('matrixSize').addEventListener('change', generateRandomMatrix);
    
    // Generate initial matrix
    generateRandomMatrix();
    
    // Initial draw
    draw();
}

// Generate a random matrix
function generateRandomMatrix() {
    const size = parseInt(document.getElementById('matrixSize').value);
    matrix = [];
    
    // Generate random coefficients and constants
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j <= size; j++) {  // +1 for augmented column
            row.push(Math.floor(Math.random() * 10) - 5);  // Random numbers between -5 and 5
        }
        matrix.push(row);
    }
    
    // Generate solution steps
    generateSteps();
    currentStep = 0;
    draw();
}

// Generate solution steps
function generateSteps() {
    steps = [];
    steps.push(JSON.parse(JSON.stringify(matrix)));  // Store initial state
    
    let n = matrix.length;
    let m = matrix[0].length;
    let workingMatrix = JSON.parse(JSON.stringify(matrix));
    
    // Forward elimination
    for (let i = 0; i < n; i++) {
        // Find pivot
        let maxElement = Math.abs(workingMatrix[i][i]);
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(workingMatrix[k][i]) > maxElement) {
                maxElement = Math.abs(workingMatrix[k][i]);
                maxRow = k;
            }
        }
        
        // Swap maximum row with current row
        if (maxRow !== i) {
            for (let k = i; k < m; k++) {
                let temp = workingMatrix[i][k];
                workingMatrix[i][k] = workingMatrix[maxRow][k];
                workingMatrix[maxRow][k] = temp;
            }
            steps.push(JSON.parse(JSON.stringify(workingMatrix)));
        }
        
        // Make all rows below this one 0 in current column
        for (let k = i + 1; k < n; k++) {
            let factor = workingMatrix[k][i] / workingMatrix[i][i];
            for (let j = i; j < m; j++) {
                workingMatrix[k][j] -= factor * workingMatrix[i][j];
            }
            steps.push(JSON.parse(JSON.stringify(workingMatrix)));
        }
    }
    
    // Back substitution
    for (let i = n - 1; i >= 0; i--) {
        for (let k = i - 1; k >= 0; k--) {
            let factor = workingMatrix[k][i] / workingMatrix[i][i];
            for (let j = i; j < m; j++) {
                workingMatrix[k][j] -= factor * workingMatrix[i][j];
            }
            steps.push(JSON.parse(JSON.stringify(workingMatrix)));
        }
    }
}

// Draw the current state
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const currentMatrix = steps[currentStep];
    
    // Check if we're on a mobile device
    const isMobile = window.innerWidth < 768;
    
    // Adjust cell size based on canvas size and matrix size
    const size = currentMatrix.length;
    const maxCellSize = isMobile ? 50 : 60;
    const cellSize = Math.min(maxCellSize, Math.min(canvas.width / (size + 1), canvas.height / size));
    
    const startX = (canvas.width - cellSize * (currentMatrix[0].length)) / 2;
    const startY = (canvas.height - cellSize * currentMatrix.length) / 2;
    
    // Draw matrix
    for (let i = 0; i < currentMatrix.length; i++) {
        for (let j = 0; j < currentMatrix[i].length; j++) {
            const x = startX + j * cellSize;
            const y = startY + i * cellSize;
            
            // Draw cell background
            ctx.fillStyle = '#282a36';
            ctx.fillRect(x, y, cellSize - 2, cellSize - 2);
            
            // Draw value with adjusted font size
            ctx.fillStyle = '#f8f8f2';
            const fontSize = isMobile ? 14 : 20;
            ctx.font = `${fontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(currentMatrix[i][j].toFixed(2), x + cellSize/2, y + cellSize/2);
            
            // Draw separator line for augmented matrix
            if (j === currentMatrix[i].length - 2) {
                ctx.strokeStyle = '#bd93f9';
                ctx.lineWidth = isMobile ? 1 : 2;
                ctx.beginPath();
                ctx.moveTo(x + cellSize, startY);
                ctx.lineTo(x + cellSize, startY + currentMatrix.length * cellSize);
                ctx.stroke();
            }
        }
    }
    
    // Update step counter
    document.getElementById('currentStep').textContent = 
        `Step ${currentStep + 1} of ${steps.length}`;
}

// Animation control
function toggleAnimation() {
    isAnimating = !isAnimating;
    document.getElementById('startBtn').textContent = isAnimating ? 'Pause' : 'Start';
    if (isAnimating) {
        animate();
    } else {
        cancelAnimationFrame(animationId);
    }
}

// Animation loop
function animate() {
    if (!isAnimating) return;
    
    if (currentStep < steps.length - 1) {
        currentStep++;
        draw();
        setTimeout(() => {
            animationId = requestAnimationFrame(animate);
        }, 1000);  // 1 second delay between steps
    } else {
        isAnimating = false;
        document.getElementById('startBtn').textContent = 'Start';
    }
}

// Reset visualization
function reset() {
    isAnimating = false;
    document.getElementById('startBtn').textContent = 'Start';
    cancelAnimationFrame(animationId);
    currentStep = 0;
    generateRandomMatrix();
}

// Initialize when page loads
window.addEventListener('load', init); 