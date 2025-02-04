// Gauss-Legendre Algorithm Visualization
let canvas, ctx;
let steps = [];
let currentStep = 0;
let animationId;
let isAnimating = false;
let precision = 5;

// Initialize the visualization
function init() {
    canvas = document.getElementById('visualizer');
    ctx = canvas.getContext('2d');
    
    // Set canvas size with better dimensions
    canvas.width = 1000;
    canvas.height = 500;
    
    // Add event listeners
    document.getElementById('startBtn').addEventListener('click', toggleAnimation);
    document.getElementById('resetBtn').addEventListener('click', reset);
    document.getElementById('precisionSelect').addEventListener('change', (e) => {
        precision = parseInt(e.target.value);
        reset();
    });
    
    // Initial setup
    reset();
}

// Generate solution steps
function generateSteps() {
    steps = [];
    
    // Initial values
    let a = 1.0;
    let b = 1.0 / Math.sqrt(2);
    let t = 0.25;
    let p = 1.0;
    
    // Store initial state
    steps.push({
        iteration: 0,
        a: a,
        b: b,
        t: t,
        p: p,
        pi: null
    });
    
    // Gauss-Legendre iterations
    for (let i = 0; i < precision; i++) {
        // Store previous a
        let a_prev = a;
        
        // Update variables
        a = (a_prev + b) / 2;
        b = Math.sqrt(a_prev * b);
        t = t - p * Math.pow(a_prev - a, 2);
        p = 2 * p;
        
        // Calculate current π approximation
        let pi = Math.pow(a + b, 2) / (4 * t);
        
        // Store step
        steps.push({
            iteration: i + 1,
            a: a,
            b: b,
            t: t,
            p: p,
            pi: pi
        });
    }
}

// Draw the current state
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const currentState = steps[currentStep];
    const cellSize = 60;
    const startX = 50;
    const startY = 50;
    
    // Draw variables table with modern style
    drawVariablesTable(currentState, startX, startY, cellSize);
    
    // Draw convergence graph with improved styling
    drawConvergenceGraph(startX, startY + 150);
    
    // Update step counter and current π value
    let stepText = `Step ${currentStep + 1} of ${steps.length}`;
    if (currentState.pi !== null) {
        stepText += `\nπ ≈ ${currentState.pi.toFixed(10)}`;
        stepText += `\nError: ${Math.abs(Math.PI - currentState.pi).toFixed(10)}`;
    }
    document.getElementById('currentStep').textContent = stepText;
}

// Draw variables table with modern style
function drawVariablesTable(state, x, y, cellSize) {
    const headers = ['a', 'b', 't', 'p'];
    const values = [state.a, state.b, state.t, state.p];
    
    // Draw table background
    ctx.fillStyle = '#1e1e2e';
    ctx.fillRect(x - 10, y - 30, (cellSize * 4) + 20, cellSize + 50);
    ctx.strokeStyle = '#6272a4';
    ctx.strokeRect(x - 10, y - 30, (cellSize * 4) + 20, cellSize + 50);
    
    // Draw headers with modern style
    ctx.fillStyle = '#bd93f9';
    ctx.font = 'bold 22px "Segoe UI", Arial';
    ctx.textAlign = 'center';
    
    headers.forEach((header, i) => {
        ctx.fillText(header, x + i * cellSize + cellSize/2, y);
    });
    
    // Draw values with improved styling
    values.forEach((value, i) => {
        ctx.fillStyle = '#44475a';
        ctx.fillRect(x + i * cellSize, y + 10, cellSize - 2, cellSize - 2);
        
        ctx.fillStyle = '#50fa7b';
        ctx.font = '18px "Segoe UI", Arial';
        ctx.fillText(value.toFixed(8), x + i * cellSize + cellSize/2, y + cellSize/2 + 10);
    });
}

// Draw convergence graph with improved styling
function drawConvergenceGraph(x, y) {
    const width = canvas.width - 2 * x;
    const height = 250;
    
    // Draw background
    ctx.fillStyle = '#1e1e2e';
    ctx.fillRect(x - 20, y - height - 20, width + 40, height + 40);
    ctx.strokeStyle = '#6272a4';
    ctx.strokeRect(x - 20, y - height - 20, width + 40, height + 40);
    
    // Draw grid
    ctx.strokeStyle = '#44475a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
        const gridY = y - (i / 10) * height;
        ctx.beginPath();
        ctx.moveTo(x, gridY);
        ctx.lineTo(x + width, gridY);
        ctx.stroke();
    }
    
    // Draw axes with improved style
    ctx.strokeStyle = '#f8f8f2';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.moveTo(x, y - height);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Draw π reference line with animation
    ctx.strokeStyle = '#ff79c6';
    ctx.setLineDash([5, 5]);
    const piY = y - (Math.PI / 4) * height;
    ctx.beginPath();
    ctx.moveTo(x, piY);
    ctx.lineTo(x + width, piY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw convergence line with gradient
    if (currentStep > 0) {
        const gradient = ctx.createLinearGradient(x, 0, x + width, 0);
        gradient.addColorStop(0, '#8be9fd');
        gradient.addColorStop(1, '#50fa7b');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let i = 0; i <= currentStep; i++) {
            const step = steps[i];
            if (step.pi !== null) {
                const pointX = x + (i / (steps.length - 1)) * width;
                const pointY = y - (step.pi / 4) * height;
                
                if (i === 0) {
                    ctx.moveTo(pointX, pointY);
                } else {
                    ctx.lineTo(pointX, pointY);
                }
                
                // Draw points
                ctx.fillStyle = '#f1fa8c';
                ctx.beginPath();
                ctx.arc(pointX, pointY, 5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.stroke();
    }
    
    // Add labels with improved style
    ctx.fillStyle = '#f8f8f2';
    ctx.font = 'bold 16px "Segoe UI", Arial';
    ctx.textAlign = 'right';
    ctx.fillText('π', x - 15, piY + 5);
    ctx.textAlign = 'center';
    ctx.fillText('Iterations', x + width/2, y + 30);
    ctx.save();
    ctx.translate(x - 40, y - height/2);
    ctx.rotate(-Math.PI/2);
    ctx.fillText('Value', 0, 0);
    ctx.restore();
}

// Animation control with smoother transitions
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
        
        // Update step counter with styled text
        const currentState = steps[currentStep];
        let stepText = `Iteration ${currentStep} of ${steps.length - 1}`;
        if (currentState.pi !== null) {
            stepText += `\nπ ≈ ${currentState.pi.toFixed(12)}`;
            const error = Math.abs(Math.PI - currentState.pi);
            stepText += `\nError: ${error.toExponential(6)}`;
        }
        document.getElementById('currentStep').innerHTML = stepText.replace(/\n/g, '<br>');
        
        setTimeout(() => {
            animationId = requestAnimationFrame(animate);
        }, 1200);  // Slightly slower animation for better visualization
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
    generateSteps();
    draw();
}

// Initialize when page loads
window.addEventListener('load', init); 