// Gauss-Newton Algorithm Visualization
let canvas, ctx;
let data = [];  // Puntos de datos observados
let parameters = [1, 1];  // Parámetros iniciales [a, b] para el modelo y = a*exp(-b*x)
let steps = [];
let currentStep = 0;
let animationId;
let isAnimating = false;
let selectedModel = 'polynomial';


// Initialize the visualization
function init() {
    canvas = document.getElementById('visualizer');
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 1000;
    canvas.height = 500;
    
    // Add event listeners
    document.getElementById('startBtn').addEventListener('click', toggleAnimation);
    document.getElementById('resetBtn').addEventListener('click', reset);
    document.getElementById('modelSelect').addEventListener('change', (e) => {
        selectedModel = e.target.value;
        reset();
    });
    
    // Initial setup
    generateData();
    reset();
}

// Generate sample data points
function generateData() {
    data = [];
    const trueParams = {
        exponential: [2, 0.5],  // a*exp(-b*x)
        polynomial: [1, 2],     // ax² + b
        sinusoidal: [2, 1]      // a*sin(b*x)
    }[selectedModel];
    
    // Generate 20 points with some noise
    for (let i = 0; i < 20; i++) {
        const x = i * 0.5;
        let y = modelFunction(x, trueParams);
        y += (Math.random() - 0.5) * 0.2;  // Add noise
        data.push({x, y});
    }
}

// Model function to fit
function modelFunction(x, params) {
    switch(selectedModel) {
        case 'exponential':
            return params[0] * Math.exp(-params[1] * x);
        case 'polynomial':
            return params[0] * x * x + params[1];
        case 'sinusoidal':
            return params[0] * Math.sin(params[1] * x);
        default:
            return params[0] * Math.exp(-params[1] * x);
    }
}

// Compute Jacobian matrix
function computeJacobian(params) {
    const J = [];
    for (let point of data) {
        const row = [];
        switch(selectedModel) {
            case 'exponential':
                row.push(Math.exp(-params[1] * point.x));  // ∂f/∂a
                row.push(-params[0] * point.x * Math.exp(-params[1] * point.x));  // ∂f/∂b
                break;
            case 'polynomial':
                row.push(point.x * point.x);  // ∂f/∂a
                row.push(1);  // ∂f/∂b
                break;
            case 'sinusoidal':
                row.push(Math.sin(params[1] * point.x));  // ∂f/∂a
                row.push(params[0] * point.x * Math.cos(params[1] * point.x));  // ∂f/∂b
                break;
        }
        J.push(row);
    }
    return J;
}

// Compute residuals
function computeResiduals(params) {
    return data.map(point => 
        point.y - modelFunction(point.x, params)
    );
}

// Generate solution steps
function generateSteps() {
    steps = [];
    let currentParams = [...parameters];
    
    // Store initial state
    steps.push({
        parameters: [...currentParams],
        residuals: computeResiduals(currentParams),
        rss: computeRSS(currentParams)
    });
    
    // Gauss-Newton iterations
    const MAX_ITERATIONS = 10;
    const TOLERANCE = 1e-6;
    
    for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
        // Compute Jacobian and residuals
        const J = computeJacobian(currentParams);
        const r = computeResiduals(currentParams);
        
        // Compute J^T * J and J^T * r
        const JtJ = matrixMultiply(transpose(J), J);
        const Jtr = matrixMultiply(transpose(J), r);
        
        // Solve normal equations
        const delta = solveLinearSystem(JtJ, Jtr);
        
        // Update parameters
        for (let i = 0; i < currentParams.length; i++) {
            currentParams[i] += delta[i];
        }
        
        // Store step
        steps.push({
            parameters: [...currentParams],
            residuals: computeResiduals(currentParams),
            rss: computeRSS(currentParams)
        });
        
        // Check convergence
        if (Math.max(...delta.map(Math.abs)) < TOLERANCE) break;
    }
}

// Compute Residual Sum of Squares
function computeRSS(params) {
    const residuals = computeResiduals(params);
    return residuals.reduce((sum, r) => sum + r * r, 0);
}

// Matrix operations
function transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function matrixMultiply(A, B) {
    if (Array.isArray(B[0])) {  // Matrix * Matrix
        return A.map(row => 
            B[0].map((_, j) => 
                row.reduce((sum, val, i) => sum + val * B[i][j], 0)
            )
        );
    } else {  // Matrix * Vector
        return A.map(row =>
            row.reduce((sum, val, i) => sum + val * B[i], 0)
        );
    }
}

// Solve 2x2 linear system using Cramer's rule
function solveLinearSystem(A, b) {
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    return [
        (b[0] * A[1][1] - b[1] * A[0][1]) / det,
        (A[0][0] * b[1] - A[1][0] * b[0]) / det
    ];
}

// Draw the current state
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const currentState = steps[currentStep];
    const margin = 50;
    const plotWidth = canvas.width - 2 * margin;
    const plotHeight = canvas.height - 2 * margin;
    
    // Draw coordinate system
    drawCoordinateSystem(margin, plotWidth, plotHeight);
    
    // Draw data points
    drawDataPoints(margin, plotWidth, plotHeight);
    
    // Draw current fit
    drawModelFit(currentState.parameters, margin, plotWidth, plotHeight);
    
    // Draw parameter values and RSS
    drawInfo(currentState, margin);
}

// Draw coordinate system
function drawCoordinateSystem(margin, width, height) {
    ctx.strokeStyle = '#6272a4';
    ctx.lineWidth = 1;
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, margin + height);
    ctx.lineTo(margin + width, margin + height);
    ctx.stroke();
    
    // Draw grid
    ctx.strokeStyle = '#44475a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
        const x = margin + (i / 10) * width;
        const y = margin + (i / 10) * height;
        
        ctx.beginPath();
        ctx.moveTo(x, margin);
        ctx.lineTo(x, margin + height);
        ctx.moveTo(margin, y);
        ctx.lineTo(margin + width, y);
        ctx.stroke();
    }
}

// Draw data points
function drawDataPoints(margin, width, height) {
    const xScale = width / 10;
    const yScale = height / 4;
    
    ctx.fillStyle = '#ff79c6';
    for (let point of data) {
        const x = margin + point.x * xScale;
        const y = margin + height - point.y * yScale;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// Draw model fit
function drawModelFit(params, margin, width, height) {
    const xScale = width / 10;
    const yScale = height / 4;
    
    ctx.strokeStyle = '#50fa7b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i <= 100; i++) {
        const x = i * 0.1;
        const y = modelFunction(x, params);
        
        const screenX = margin + x * xScale;
        const screenY = margin + height - y * yScale;
        
        if (i === 0) ctx.moveTo(screenX, screenY);
        else ctx.lineTo(screenX, screenY);
    }
    ctx.stroke();
}

// Draw information
function drawInfo(state, margin) {
    ctx.fillStyle = '#f8f8f2';
    ctx.font = 'bold 16px "Segoe UI", Arial';
    ctx.textAlign = 'left';
    
    const paramNames = {
        exponential: ['a', 'b'],
        polynomial: ['a', 'b'],
        sinusoidal: ['A', 'ω']
    }[selectedModel];
    
    ctx.fillText(`${paramNames[0]} = ${state.parameters[0].toFixed(4)}`, margin, margin - 20);
    ctx.fillText(`${paramNames[1]} = ${state.parameters[1].toFixed(4)}`, margin + 200, margin - 20);
    ctx.fillText(`RSS = ${state.rss.toFixed(6)}`, margin + 400, margin - 20);
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
        
        // Update step counter
        document.getElementById('currentStep').innerHTML = 
            `Iteration ${currentStep} of ${steps.length - 1}<br>` +
            `RSS: ${steps[currentStep].rss.toFixed(6)}`;
        
        setTimeout(() => {
            animationId = requestAnimationFrame(animate);
        }, 1000);
    } else {
        isAnimating = false;
        document.getElementById('startBtn').textContent = 'Restart';
    }
}

// Reset visualization
function reset() {
    isAnimating = false;
    document.getElementById('startBtn').textContent = 'Start';
    cancelAnimationFrame(animationId);
    currentStep = 0;
    parameters = [1, 1];
    generateData();
    generateSteps();
    draw();
}

// Initialize when page loads
window.addEventListener('load', init); 