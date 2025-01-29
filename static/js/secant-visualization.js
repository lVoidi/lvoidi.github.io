// Secant Method Visualization
let canvas, ctx;
let x0, x1;  // Previous points
let steps = [];
let currentStep = 0;
let animationId;
let isAnimating = false;
let selectedFunction = 'polynomial';

// Initialize the visualization
function init() {
    canvas = document.getElementById('visualizer');
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;
    
    // Add event listeners
    document.getElementById('startBtn').addEventListener('click', toggleAnimation);
    document.getElementById('resetBtn').addEventListener('click', reset);
    document.getElementById('functionSelect').addEventListener('change', (e) => {
        selectedFunction = e.target.value;
        reset();
    });
    
    // Initial setup
    reset();
}

// Function to evaluate
function f(x) {
    switch(selectedFunction) {
        case 'polynomial':
            return x * x * x - x - 2;  // x³ - x - 2
        case 'trigonometric':
            return Math.sin(x) - 0.5;  // sin(x) - 0.5
        case 'exponential':
            return Math.exp(x) - 4;    // e^x - 4
        default:
            return x * x * x - x - 2;
    }
}

// Generate solution steps
function generateSteps() {
    steps = [];
    
    // Initial guesses
    x0 = 1;
    x1 = 2;
    
    // Store initial state
    steps.push({x0: x0, x1: x1, fx0: f(x0), fx1: f(x1)});
    
    // Secant iterations
    const MAX_ITERATIONS = 20;
    const TOLERANCE = 1e-6;
    
    for (let i = 0; i < MAX_ITERATIONS; i++) {
        // Calculate next x using secant formula
        const fx0 = f(x0);
        const fx1 = f(x1);
        const x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0);
        
        steps.push({
            x0: x1,
            x1: x2,
            fx0: fx1,
            fx1: f(x2),
            secantX0: x0,
            secantX1: x1
        });
        
        if (Math.abs(x2 - x1) < TOLERANCE) break;
        
        x0 = x1;
        x1 = x2;
    }
}

// Draw the current state
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw coordinate system
    drawCoordinateSystem();
    
    // Draw function
    drawFunction();
    
    // Draw current secant line and points
    const currentState = steps[currentStep];
    drawSecantLine(currentState);
    
    // Update step counter
    document.getElementById('currentStep').textContent = 
        `Step ${currentStep + 1} of ${steps.length}: x = ${currentState.x1.toFixed(6)}`;
}

// Draw coordinate system
function drawCoordinateSystem() {
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(0, canvas.height/2);
    ctx.lineTo(canvas.width, canvas.height/2);
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    
    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let x = -10; x <= 10; x++) {
        let screenX = mapX(x);
        ctx.beginPath();
        ctx.moveTo(screenX, 0);
        ctx.lineTo(screenX, canvas.height);
        ctx.stroke();
        
        // Add x-axis labels
        ctx.fillStyle = '#fff';
        ctx.fillText(x, screenX - 10, canvas.height/2 + 20);
    }
}

// Draw the function
function drawFunction() {
    ctx.beginPath();
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < canvas.width; i++) {
        let x = unmapX(i);
        let y = f(x);
        let screenY = mapY(y);
        
        if (i === 0) {
            ctx.moveTo(i, screenY);
        } else {
            ctx.lineTo(i, screenY);
        }
    }
    ctx.stroke();
}

// Draw secant line and points
function drawSecantLine(state) {
    // Draw secant line
    if (state.secantX0 !== undefined) {
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(mapX(state.secantX0), mapY(f(state.secantX0)));
        ctx.lineTo(mapX(state.secantX1), mapY(f(state.secantX1)));
        ctx.stroke();
    }
    
    // Draw points
    ctx.fillStyle = '#f44336';
    
    // Previous point
    ctx.beginPath();
    ctx.arc(mapX(state.x0), mapY(state.fx0), 5, 0, 2 * Math.PI);
    ctx.fill();
    
    // Current point
    ctx.fillStyle = '#9c27b0';
    ctx.beginPath();
    ctx.arc(mapX(state.x1), mapY(state.fx1), 5, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw vertical line to x-axis for current point
    ctx.strokeStyle = '#9c27b0';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(mapX(state.x1), mapY(state.fx1));
    ctx.lineTo(mapX(state.x1), mapY(0));
    ctx.stroke();
    ctx.setLineDash([]);
}

// Map x from math coordinates to screen coordinates
function mapX(x) {
    return (x + 10) * canvas.width/20;
}

// Map y from math coordinates to screen coordinates
function mapY(y) {
    return canvas.height/2 - y * canvas.height/10;
}

// Unmap x from screen coordinates to math coordinates
function unmapX(screenX) {
    return screenX * 20/canvas.width - 10;
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
    generateSteps();
    draw();
}

// Initialize when page loads
window.addEventListener('load', init); 