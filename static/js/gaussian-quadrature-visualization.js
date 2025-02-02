// Gaussian Quadrature Visualization
let canvas, ctx;
let selectedFunction = 'polynomial';
let numPoints = 3;
let steps = [];
let currentStep = 0;
let animationId;
let isAnimating = false;

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
    document.getElementById('pointsSelect').addEventListener('change', (e) => {
        numPoints = parseInt(e.target.value);
        reset();
    });
    
    // Initial setup
    reset();
}

// Function to evaluate
function f(x) {
    switch(selectedFunction) {
        case 'polynomial':
            return x * x;  // x²
        case 'trigonometric':
            return Math.sin(x);  // sin(x)
        case 'exponential':
            return Math.exp(-x * x);  // e^(-x²)
        default:
            return x * x;
    }
}

// Get Gauss-Legendre points and weights
function getGaussPoints(n) {
    // Pre-computed values for n = 2,3,4,5
    const points = {
        2: [-0.5773502692, 0.5773502692],
        3: [-0.7745966692, 0.0000000000, 0.7745966692],
        4: [-0.8611363116, -0.3399810436, 0.3399810436, 0.8611363116],
        5: [-0.9061798459, -0.5384693101, 0.0000000000, 0.5384693101, 0.9061798459]
    };
    
    const weights = {
        2: [1.0000000000, 1.0000000000],
        3: [0.5555555556, 0.8888888889, 0.5555555556],
        4: [0.3478548451, 0.6521451549, 0.6521451549, 0.3478548451],
        5: [0.2369268850, 0.4786286705, 0.5688888889, 0.4786286705, 0.2369268850]
    };
    
    return {
        points: points[n],
        weights: weights[n]
    };
}

// Generate solution steps
function generateSteps() {
    steps = [];
    const {points, weights} = getGaussPoints(numPoints);
    
    // Transform points from [-1,1] to [a,b]
    const a = -2, b = 2;  // Integration interval
    const transformedPoints = points.map(x => ((b-a)*x + (b+a))/2);
    
    // Store initial state
    steps.push({
        points: transformedPoints,
        weights: weights,
        currentPoint: -1,
        sum: 0
    });
    
    // Calculate integral
    let sum = 0;
    for (let i = 0; i < numPoints; i++) {
        const x = transformedPoints[i];
        const w = weights[i] * (b-a)/2;
        sum += w * f(x);
        
        steps.push({
            points: transformedPoints,
            weights: weights,
            currentPoint: i,
            sum: sum
        });
    }
}

// Draw the current state
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw coordinate system
    drawCoordinateSystem();
    
    // Draw function
    drawFunction();
    
    // Draw quadrature points and weights
    const currentState = steps[currentStep];
    drawQuadraturePoints(currentState);
    
    // Update step counter and integral value
    document.getElementById('currentStep').textContent = 
        `Step ${currentStep + 1} of ${steps.length}: Integral ≈ ${currentState.sum.toFixed(6)}`;
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

// Draw quadrature points and weights
function drawQuadraturePoints(state) {
    for (let i = 0; i < state.points.length; i++) {
        const x = state.points[i];
        const y = f(x);
        const w = state.weights[i];
        
        // Draw point
        ctx.fillStyle = i === state.currentPoint ? '#4CAF50' : '#f44336';
        ctx.beginPath();
        ctx.arc(mapX(x), mapY(y), 5, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw weight as rectangle height
        if (i === state.currentPoint) {
            ctx.fillStyle = '#4CAF5088';
            const rectHeight = Math.abs(w) * 50;
            ctx.fillRect(
                mapX(x) - 10,
                mapY(y),
                20,
                y > 0 ? -rectHeight : rectHeight
            );
        }
    }
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