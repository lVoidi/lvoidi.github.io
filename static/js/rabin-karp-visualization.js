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
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;
    
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
    const cellSize = 40;
    const startX = 50;
    const startY = 100;
    
    // Draw text
    for (let i = 0; i < text.length; i++) {
        const x = startX + i * cellSize;
        const y = startY;
        
        // Draw cell background
        ctx.fillStyle = i >= currentState.windowStart && i < currentState.windowEnd
            ? (currentState.match ? '#4CAF50' : '#f44336')
            : '#282a36';
        ctx.fillRect(x, y, cellSize - 2, cellSize - 2);
        
        // Draw character
        ctx.fillStyle = '#f8f8f2';
        ctx.font = '20px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text[i], x + cellSize/2, y + cellSize/2);
    }
    
    // Draw pattern
    const patternY = startY + cellSize * 2;
    for (let i = 0; i < pattern.length; i++) {
        const x = startX + (currentState.windowStart + i) * cellSize;
        const y = patternY;
        
        // Draw cell background
        ctx.fillStyle = currentState.match ? '#4CAF50' : '#282a36';
        ctx.fillRect(x, y, cellSize - 2, cellSize - 2);
        
        // Draw character
        ctx.fillStyle = '#f8f8f2';
        ctx.fillText(pattern[i], x + cellSize/2, y + cellSize/2);
    }
    
    // Draw hash values
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    if (!currentState.error) {
        ctx.fillText(`Window Hash: ${currentState.windowHash}`, startX, startY - 30);
        ctx.fillText(`Pattern Hash: ${currentState.patternHash}`, startX, patternY - 30);
    } else {
        ctx.fillText(currentState.error, startX, startY - 30);
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
    generateSteps();
    draw();
}

// Initialize when page loads
window.addEventListener('load', init); 