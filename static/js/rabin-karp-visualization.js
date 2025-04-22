// Rabin-Karp Visualization
let canvas, ctx;
let text = "AABAACAADAABAAABAA";
let pattern = "AABA";
let steps = [];
let currentStep = 0;
let animationId;
let isAnimating = false;

// Initialize the visualization
function init() {
    canvas = document.getElementById('visualizer');
    ctx = canvas.getContext('2d');
    
    // Set canvas size based on container
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Add event listeners
    document.getElementById('startBtn').addEventListener('click', toggleAnimation);
    document.getElementById('resetBtn').addEventListener('click', reset);
    document.getElementById('textInput').addEventListener('input', (e) => {
        text = e.target.value;
        reset();
    });
    document.getElementById('patternInput').addEventListener('input', (e) => {
        pattern = e.target.value;
        reset();
    });
    
    // Initial setup
    reset();
}

// Resize canvas and redraw
function resizeCanvas() {
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Set minimum dimensions to ensure visibility
    canvas.width = Math.max(containerWidth, 400);
    canvas.height = Math.max(containerHeight, 400);
    
    if (steps.length > 0) {
        draw();
    }
}

// Calculate cell size based on canvas size and text length
function getCellSize() {
    const maxWidth = canvas.width - 120; // More padding for better visibility
    const maxHeight = canvas.height / 3; // More vertical space
    const cellSize = Math.min(maxWidth / text.length, maxHeight, 50); // Increased max cell size
    return Math.max(cellSize, 30); // Ensure minimum cell size
}

// Calculate hash value
function calculateHash(str, start, end) {
    let hash = 0;
    const prime = 101;
    const base = 256;
    
    for (let i = start; i < end; i++) {
        hash = (hash * base + str.charCodeAt(i)) % prime;
    }
    
    return hash;
}

// Generate solution steps
function generateSteps() {
    steps = [];
    const n = text.length;
    const m = pattern.length;
    
    if (m > n) {
        steps.push({
            windowStart: 0,
            windowEnd: 0,
            patternHash: null,
            windowHash: null,
            match: false,
            error: "Pattern longer than text"
        });
        return;
    }
    
    const prime = 101;
    const base = 256;
    let patternHash = calculateHash(pattern, 0, m);
    let windowHash = calculateHash(text, 0, m);
    
    // Store initial state
    steps.push({
        windowStart: 0,
        windowEnd: m,
        patternHash: patternHash,
        windowHash: windowHash,
        match: patternHash === windowHash && text.substring(0, m) === pattern
    });
    
    // Calculate base^(m-1) for rolling hash
    let basePower = 1;
    for (let i = 0; i < m - 1; i++) {
        basePower = (basePower * base) % prime;
    }
    
    // Slide window
    for (let i = 1; i <= n - m; i++) {
        // Remove leading digit
        windowHash = windowHash - (text.charCodeAt(i - 1) * basePower) % prime;
        if (windowHash < 0) windowHash += prime;
        
        // Add trailing digit
        windowHash = (windowHash * base + text.charCodeAt(i + m - 1)) % prime;
        
        // Check for match
        const isMatch = windowHash === patternHash && 
                       text.substring(i, i + m) === pattern;
        
        steps.push({
            windowStart: i,
            windowEnd: i + m,
            patternHash: patternHash,
            windowHash: windowHash,
            match: isMatch
        });
    }
}

// Draw the current state
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const currentState = steps[currentStep];
    const cellSize = getCellSize();
    const startX = (canvas.width - text.length * cellSize) / 2; // Center horizontally
    const startY = canvas.height / 2 - cellSize * 2; // Position higher for better spacing
    
    // Draw hash values with larger font
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    if (!currentState.error) {
        ctx.fillText(`Window Hash: ${currentState.windowHash}`, startX, startY - 40);
        ctx.fillText(`Pattern Hash: ${currentState.patternHash}`, startX, startY - 10);
    } else {
        ctx.fillText(currentState.error, startX, startY - 40);
    }
    
    // Draw text with larger cells
    for (let i = 0; i < text.length; i++) {
        const x = startX + i * cellSize;
        const y = startY;
        
        // Draw cell background with spacing
        ctx.fillStyle = i >= currentState.windowStart && i < currentState.windowEnd
            ? (currentState.match ? '#4CAF50' : '#f44336')
            : '#282a36';
        ctx.fillRect(x, y, cellSize - 4, cellSize - 4);
        
        // Draw character with larger font
        ctx.fillStyle = '#f8f8f2';
        ctx.font = `${Math.min(cellSize * 0.7, 24)}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text[i], x + cellSize/2, y + cellSize/2);
    }
    
    // Draw pattern with more vertical spacing
    const patternY = startY + cellSize * 1.5;
    for (let i = 0; i < pattern.length; i++) {
        const x = startX + (currentState.windowStart + i) * cellSize;
        const y = patternY;
        
        // Draw cell background with spacing
        ctx.fillStyle = currentState.match ? '#4CAF50' : '#282a36';
        ctx.fillRect(x, y, cellSize - 4, cellSize - 4);
        
        // Draw character
        ctx.fillStyle = '#f8f8f2';
        ctx.fillText(pattern[i], x + cellSize/2, y + cellSize/2);
    }
    
    // Update step counter with larger font
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
    generateSteps();
    draw();
}

// Initialize when page loads
window.addEventListener('load', init); 