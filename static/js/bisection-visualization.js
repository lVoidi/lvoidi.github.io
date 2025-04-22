// Bisection Method Visualization
let canvas, ctx;
let a, b, c;  // Interval endpoints and midpoint
let steps = [];
let currentStep = 0;
let animationId;
let isAnimating = false;
let selectedFunction = 'polynomial';

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
    let left = -2;
    let right = 2;
    
    // Find initial interval with root
    while (f(left) * f(right) > 0) {
        left--;
        right++;
    }
    
    a = left;
    b = right;
    
    // Store initial state
    steps.push({a: a, b: b, c: null, fa: f(a), fb: f(b), fc: null});
    
    // Bisection iterations
    const MAX_ITERATIONS = 20;
    const TOLERANCE = 1e-6;
    
    for (let i = 0; i < MAX_ITERATIONS; i++) {
        c = (a + b) / 2;
        let fc = f(c);
        
        steps.push({a: a, b: b, c: c, fa: f(a), fb: f(b), fc: fc});
        
        if (Math.abs(fc) < TOLERANCE) break;
        
        if (f(a) * fc < 0) {
            b = c;
        } else {
            a = c;
        }
    }
}

// Draw the current state
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Check if we're on a mobile device
    const isMobile = window.innerWidth < 768;
    
    // Draw coordinate system
    drawCoordinateSystem(isMobile);
    
    // Draw function
    drawFunction();
    
    // Draw current interval and midpoint
    const currentState = steps[currentStep];
    drawInterval(currentState, isMobile);
    
    // Update step counter
    document.getElementById('currentStep').textContent = 
        `Step ${currentStep + 1} of ${steps.length}: [${currentState.a.toFixed(4)}, ${currentState.b.toFixed(4)}]`;
}

// Draw coordinate system
function drawCoordinateSystem(isMobile) {
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(0, canvas.height/2);
    ctx.lineTo(canvas.width, canvas.height/2);
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    
    // Draw grid with appropriate scaling for mobile
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    
    // Adjust grid spacing for mobile
    const spacing = isMobile ? 2 : 1;
    const axisLabelSize = isMobile ? 8 : 10;
    const maxGrid = isMobile ? 4 : 10;
    
    for (let x = -maxGrid; x <= maxGrid; x += spacing) {
        let screenX = mapX(x);
        ctx.beginPath();
        ctx.moveTo(screenX, 0);
        ctx.lineTo(screenX, canvas.height);
        ctx.stroke();
        
        // Add x-axis labels more sparsely on mobile
        if (x % (isMobile ? 2 : 1) === 0) {
            ctx.fillStyle = '#fff';
            ctx.font = `${axisLabelSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText(x, screenX, canvas.height/2 + 15);
        }
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

// Draw current interval and midpoint
function drawInterval(state, isMobile) {
    // Adjust point size and line width for mobile
    const pointRadius = isMobile ? 3 : 5;
    const lineWidth = isMobile ? 1 : 2;
    
    // Draw interval endpoints
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(mapX(state.a), mapY(state.fa));
    ctx.lineTo(mapX(state.a), mapY(0));
    ctx.stroke();
    
    ctx.strokeStyle = '#f44336';
    ctx.beginPath();
    ctx.moveTo(mapX(state.b), mapY(state.fb));
    ctx.lineTo(mapX(state.b), mapY(0));
    ctx.stroke();
    
    if (state.c !== null) {
        ctx.strokeStyle = '#9c27b0';
        ctx.beginPath();
        ctx.moveTo(mapX(state.c), mapY(state.fc));
        ctx.lineTo(mapX(state.c), mapY(0));
        ctx.stroke();
        
        // Draw point at (c, f(c))
        ctx.fillStyle = '#9c27b0';
        ctx.beginPath();
        ctx.arc(mapX(state.c), mapY(state.fc), pointRadius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// Map x from math coordinates to screen coordinates
function mapX(x) {
    // Get scale from window size (smaller on mobile)
    const scale = window.innerWidth < 768 ? 4 : 10;
    return (x + scale) * canvas.width/(2*scale);
}

// Map y from math coordinates to screen coordinates
function mapY(y) {
    // Get scale from window size (smaller on mobile)
    const scale = window.innerWidth < 768 ? 4 : 10;
    return canvas.height/2 - y * canvas.height/(2*scale);
}

// Unmap x from screen coordinates to math coordinates
function unmapX(screenX) {
    const scale = window.innerWidth < 768 ? 4 : 10;
    return screenX * (2*scale)/canvas.width - scale;
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