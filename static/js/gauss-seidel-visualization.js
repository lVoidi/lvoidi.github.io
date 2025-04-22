// Gauss-Seidel Visualization
let canvas, ctx;
let matrix = [];
let solution = [];
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

// Generate a random diagonally dominant matrix
function generateRandomMatrix() {
    const size = parseInt(document.getElementById('matrixSize').value);
    matrix = [];
    solution = new Array(size).fill(0);  // Initial guess
    
    // Generate random coefficients
    for (let i = 0; i < size; i++) {
        let row = [];
        let sum = 0;
        for (let j = 0; j < size; j++) {
            if (i !== j) {
                let val = Math.floor(Math.random() * 10) - 5;
                row.push(val);
                sum += Math.abs(val);
            } else {
                row.push(0);  // Placeholder for diagonal
            }
        }
        // Make matrix diagonally dominant
        row[i] = sum + Math.floor(Math.random() * 5) + 1;
        // Add constants vector (b)
        row.push(Math.floor(Math.random() * 20) - 10);
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
    const n = matrix.length;
    let currentSolution = [...solution];
    
    // Store initial state
    steps.push({
        solution: [...currentSolution],
        activeRow: -1,
        error: calculateError(currentSolution)
    });
    
    // Gauss-Seidel iterations
    const MAX_ITERATIONS = 20;
    const TOLERANCE = 1e-6;
    
    for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
        let maxDiff = 0;
        
        for (let i = 0; i < n; i++) {
            let sum = matrix[i][n];  // b[i]
            
            for (let j = 0; j < n; j++) {
                if (j !== i) {
                    sum -= matrix[i][j] * currentSolution[j];
                }
            }
            
            let newValue = sum / matrix[i][i];
            maxDiff = Math.max(maxDiff, Math.abs(newValue - currentSolution[i]));
            currentSolution[i] = newValue;
            
            // Store intermediate step
            steps.push({
                solution: [...currentSolution],
                activeRow: i,
                error: calculateError(currentSolution)
            });
        }
        
        if (maxDiff < TOLERANCE) break;
    }
}

// Calculate error (residual)
function calculateError(solution) {
    let maxError = 0;
    const n = matrix.length;
    
    for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < n; j++) {
            sum += matrix[i][j] * solution[j];
        }
        maxError = Math.max(maxError, Math.abs(sum - matrix[i][n]));
    }
    
    return maxError;
}

// Draw the current state
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const isMobile = window.innerWidth < 768;
    const currentState = steps[currentStep];
    
    // Adjust cell size based on canvas width and matrix size
    const cellSize = Math.min(
        60,
        Math.floor(canvas.width / (matrix.length + 3)),
        Math.floor(canvas.height / (matrix.length + 3))
    );
    
    // Center the matrix horizontally
    const startX = Math.max(10, (canvas.width - (matrix.length + 2) * cellSize) / 2);
    const startY = 50;
    
    // Draw matrix
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j <= matrix.length; j++) {
            const x = startX + j * cellSize;
            const y = startY + i * cellSize;
            
            // Draw cell background
            ctx.fillStyle = currentState.activeRow === i ? '#4CAF50' : '#282a36';
            ctx.fillRect(x, y, cellSize - 2, cellSize - 2);
            
            // Draw value
            ctx.fillStyle = '#f8f8f2';
            // Adjust font size for readability
            ctx.font = `${isMobile ? cellSize / 3 : cellSize / 2}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // For smaller screens, round to fewer decimals
            const valueText = isMobile ? matrix[i][j].toFixed(0) : matrix[i][j].toFixed(2);
            ctx.fillText(valueText, x + cellSize/2, y + cellSize/2);
            
            // Draw separator line for augmented matrix
            if (j === matrix.length - 1) {
                ctx.strokeStyle = '#bd93f9';
                ctx.beginPath();
                ctx.moveTo(x + cellSize, startY);
                ctx.lineTo(x + cellSize, startY + matrix.length * cellSize);
                ctx.stroke();
            }
        }
    }
    
    // Draw current solution
    // On mobile, position solution vector below the matrix instead of to the right
    if (isMobile && matrix.length > 2) {
        const vectorY = startY + (matrix.length + 1) * cellSize;
        const vectorX = startX + cellSize;
        
        ctx.fillStyle = '#fff';
        ctx.font = `${cellSize / 2}px Arial`;
        ctx.textAlign = 'left';
        ctx.fillText('x = ', vectorX - cellSize/2, vectorY);
        
        for (let i = 0; i < currentState.solution.length; i++) {
            const x = vectorX + i * cellSize * 1.5;
            ctx.fillStyle = currentState.activeRow === i ? '#4CAF50' : '#f8f8f2';
            ctx.fillText(currentState.solution[i].toFixed(2), x, vectorY);
        }
        
        // Draw error below solution vector
        ctx.fillStyle = '#fff';
        ctx.font = `${cellSize / 2.5}px Arial`;
        ctx.fillText(`Error: ${currentState.error.toFixed(6)}`, vectorX, vectorY + cellSize);
    } else {
        // Standard desktop layout
        const solutionX = startX + (matrix.length + 1.5) * cellSize;
        ctx.fillStyle = '#fff';
        ctx.font = `${cellSize / 2}px Arial`;
        ctx.textAlign = 'left';
        ctx.fillText('x = ', solutionX - cellSize/2, startY + cellSize);
        
        for (let i = 0; i < currentState.solution.length; i++) {
            const y = startY + i * cellSize;
            ctx.fillStyle = currentState.activeRow === i ? '#4CAF50' : '#f8f8f2';
            ctx.fillText(currentState.solution[i].toFixed(2), solutionX, y + cellSize/2);
        }
        
        // Draw error
        ctx.fillStyle = '#fff';
        ctx.font = `${cellSize / 2.5}px Arial`;
        ctx.fillText(`Error: ${currentState.error.toFixed(6)}`, startX, startY + (matrix.length + 1) * cellSize);
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