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
    
    // Make canvas responsive
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = Math.min(400, Math.max(250, window.innerHeight * 0.4));
        
        // Redraw if we have data
        if (signal.length > 0) {
            draw();
        }
    }
    
    // Initial canvas sizing
    resizeCanvas();
    
    // Update canvas on window resize
    window.addEventListener('resize', resizeCanvas);
    
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

// Complex number multiplication
function complexMultiply(a, b) {
    return new Complex(
        a.re * b.re - a.im * b.im,
        a.re * b.im + a.im * b.re
    );
}

// Compute FFT
function computeFFT() {
    function fft(x) {
        const N = x.length;
        if (N <= 1) return x;

        const even = fft(x.filter((_, i) => i % 2 === 0));
        const odd = fft(x.filter((_, i) => i % 2 === 1));
        
        const result = new Array(N);
        
        for (let k = 0; k < N/2; k++) {
            // Calculate twiddle factor
            const theta = -2 * Math.PI * k / N;
            const t = complexMultiply(
                odd[k],
                new Complex(Math.cos(theta), Math.sin(theta))
            );
            
            result[k] = new Complex(
                even[k].re + t.re,
                even[k].im + t.im
            );
            result[k + N/2] = new Complex(
                even[k].re - t.re,
                even[k].im - t.im
            );
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
    
    // Check if we're on a mobile device
    const isMobile = window.innerWidth < 768;
    
    // Draw original signal
    ctx.beginPath();
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = isMobile ? 1.5 : 2;
    
    for (let i = 0; i < signal.length; i++) {
        const x = (i / signal.length) * (canvas.width / 2);
        const y = (canvas.height / 4) - signal[i] * (isMobile ? 30 : 50);
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Draw FFT magnitude spectrum
    ctx.beginPath();
    ctx.strokeStyle = '#4CAF50';
    
    for (let i = 0; i < fftResult.length / 2; i++) {
        const magnitude = Math.sqrt(
            fftResult[i].re * fftResult[i].re + 
            fftResult[i].im * fftResult[i].im
        ) / (fftResult.length / 2);
        
        const x = (i / (fftResult.length / 2)) * (canvas.width / 2);
        const y = canvas.height - (magnitude * (isMobile ? 120 : 200));
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Add labels and grid
    ctx.fillStyle = '#fff';
    const fontSize = isMobile ? 12 : 14;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillText('Time Domain Signal', 10, 20);
    ctx.fillText('Frequency Domain (FFT)', 10, canvas.height / 2 + 20);
    
    // Draw frequency grid lines
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 0.5;
    const gridSpacing = isMobile ? 8 : 5;
    for (let i = 0; i < gridSpacing; i++) {
        const x = (i * canvas.width / (gridSpacing * 2));
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
        
        // Add frequency labels more sparsely on mobile
        if (!isMobile || i % 2 === 0) {
            ctx.fillText(`${Math.round(i * 20/gridSpacing)}Hz`, x, canvas.height - 10);
        }
    }
    
    if (isAnimating) {
        updateSignal();
        animationId = requestAnimationFrame(draw);
    }
}

// Update signal for animation
function updateSignal() {
    const phase = Date.now() / 1000;
    const freq1 = 2 + Math.sin(phase * 0.5);  // Frecuencia base que oscila entre 1 y 3 Hz
    const freq2 = 5 + Math.sin(phase * 0.3);  // Segunda frecuencia que oscila entre 4 y 6 Hz
    const freq3 = 10 + Math.sin(phase * 0.2); // Tercera frecuencia que oscila entre 9 y 11 Hz
    
    for (let i = 0; i < signal.length; i++) {
        const t = i / signal.length;
        signal[i] = Math.sin(2 * Math.PI * freq1 * t + phase) + 
                    0.5 * Math.sin(2 * Math.PI * freq2 * t + phase * 0.7) +
                    0.25 * Math.sin(2 * Math.PI * freq3 * t + phase * 0.5);
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