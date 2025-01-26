// FFT Visualization
let canvas, ctx;
let signal = [];
let fftResult = [];
let animationId;
let isAnimating = false;

// Initialize the visualization
function init() {
    canvas = document.getElementById('visualizer');
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;
    
    // Generate initial signal
    generateSignal();
    
    // Add event listeners
    document.getElementById('startBtn').addEventListener('click', toggleAnimation);
    document.getElementById('resetBtn').addEventListener('click', reset);
    
    // Initial draw
    draw();
}

// Generate a sample signal (sum of sinusoids)
function generateSignal() {
    signal = [];
    for (let i = 0; i < 128; i++) {
        const t = i / 128;
        // Create a signal with multiple frequencies
        signal.push(
            Math.sin(2 * Math.PI * 2 * t) + 
            0.5 * Math.sin(2 * Math.PI * 5 * t) +
            0.25 * Math.sin(2 * Math.PI * 10 * t)
        );
    }
    computeFFT();
}

// Compute FFT
function computeFFT() {
    // Implementation of FFT algorithm
    function fft(x) {
        const N = x.length;
        if (N <= 1) return x;

        const even = fft(x.filter((_, i) => i % 2 === 0));
        const odd = fft(x.filter((_, i) => i % 2 === 1));
        
        const result = new Array(N);
        
        for (let k = 0; k < N/2; k++) {
            const t = odd[k] * Math.exp(-2 * Math.PI * k * new Complex(0, 1) / N);
            result[k] = even[k] + t;
            result[k + N/2] = even[k] - t;
        }
        
        return result;
    }

    // Convert signal to complex numbers
    const complexSignal = signal.map(x => new Complex(x, 0));
    fftResult = fft(complexSignal);
}

// Draw function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw original signal
    ctx.beginPath();
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < signal.length; i++) {
        const x = (i / signal.length) * (canvas.width / 2);
        const y = (canvas.height / 4) - signal[i] * 50;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Draw FFT magnitude
    ctx.beginPath();
    ctx.strokeStyle = '#4CAF50';
    
    for (let i = 0; i < fftResult.length / 2; i++) {
        const magnitude = Math.sqrt(
            fftResult[i].re * fftResult[i].re + 
            fftResult[i].im * fftResult[i].im
        );
        
        const x = (i / (fftResult.length / 2)) * (canvas.width / 2);
        const y = canvas.height - (magnitude * 20);
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Add labels
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText('Time Domain Signal', 10, 20);
    ctx.fillText('Frequency Domain (FFT)', 10, canvas.height / 2 + 20);
    
    if (isAnimating) {
        updateSignal();
        animationId = requestAnimationFrame(draw);
    }
}

// Update signal for animation
function updateSignal() {
    const phase = Date.now() / 1000;
    for (let i = 0; i < signal.length; i++) {
        const t = i / signal.length;
        signal[i] = Math.sin(2 * Math.PI * 2 * t + phase) + 
                    0.5 * Math.sin(2 * Math.PI * 5 * t + phase) +
                    0.25 * Math.sin(2 * Math.PI * 10 * t + phase);
    }
    computeFFT();
}

// Toggle animation
function toggleAnimation() {
    isAnimating = !isAnimating;
    document.getElementById('startBtn').textContent = isAnimating ? 'Stop' : 'Start';
    if (isAnimating) {
        draw();
    } else {
        cancelAnimationFrame(animationId);
    }
}

// Reset visualization
function reset() {
    isAnimating = false;
    document.getElementById('startBtn').textContent = 'Start';
    cancelAnimationFrame(animationId);
    generateSignal();
    draw();
}

// Complex number helper class
class Complex {
    constructor(re, im) {
        this.re = re;
        this.im = im;
    }
}

// Initialize when page loads
window.addEventListener('load', init); 