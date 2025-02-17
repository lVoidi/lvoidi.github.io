// Configuración del canvas
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
const width = canvas.width = 600;
const height = canvas.height = 400;
const padding = 40;

// Variables globales
let data = [];
let labels = [];
let svm = null;
let isTraining = false;
let selectedKernel = 'rbf';

// Colores y estilos
const colors = {
    positive: '#50fa7b',
    negative: '#ff5555',
    line: '#bd93f9',
    background: '#282a36',
    grid: '#44475a',
    regionPositive: 'rgba(80, 250, 123, 0.3)',  // Aumentada aún más la opacidad
    regionNegative: 'rgba(255, 85, 85, 0.3)',   // Aumentada aún más la opacidad
    supportVector: '#f1fa8c'
};

// Inicialización
function init() {
    // Limpiar datos y estado
    data = [];
    labels = [];
    svm = null;
    isTraining = false;
    
    // Limpiar canvas
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, width, height);
    
    // Restablecer mensaje
    document.getElementById('currentStep').textContent = 
        'Select kernel function and click Start';
    
    // Generar datos de ejemplo
    generateSampleData();
    
    // Dibujar estado inicial
    draw();
}

// Generar datos de ejemplo
function generateSampleData() {
    // Generar dos clusters de puntos
    for(let i = 0; i < 20; i++) {
        // Cluster positivo
        data.push([
            Math.random() * 0.4 + 0.3,
            Math.random() * 0.4 + 0.3
        ]);
        labels.push(1);
        
        // Cluster negativo
        data.push([
            Math.random() * 0.4 - 0.7,
            Math.random() * 0.4 - 0.7
        ]);
        labels.push(-1);
    }
}

// Transformar coordenadas del canvas a coordenadas del modelo
function canvasToModel(x, y) {
    return [
        (x - padding) / (width - 2 * padding) * 4 - 2,
        (height - y - padding) / (height - 2 * padding) * 4 - 2
    ];
}

// Transformar coordenadas del modelo a coordenadas del canvas
function modelToCanvas(x, y) {
    return [
        ((x + 2) / 4) * (width - 2 * padding) + padding,
        height - (((y + 2) / 4) * (height - 2 * padding) + padding)
    ];
}

// Dibujar grid
function drawGrid() {
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 0.5;
    
    // Líneas verticales
    for(let x = padding; x <= width - padding; x += (width - 2 * padding) / 8) {
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
    }
    
    // Líneas horizontales
    for(let y = padding; y <= height - padding; y += (height - 2 * padding) / 8) {
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
}

// Dibujar puntos
function drawPoints() {
    data.forEach((point, i) => {
        const [x, y] = modelToCanvas(point[0], point[1]);
        ctx.fillStyle = labels[i] === 1 ? colors.positive : colors.negative;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Función principal de dibujo
function draw() {
    console.log('Dibujando...', { svm, data: data.length, labels: labels.length });
    
    // Limpiar canvas
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, width, height);
    
    // Dibujar elementos en orden correcto
    drawGrid();
    
    // Solo dibujar el límite de decisión si tenemos un modelo entrenado
    if(svm && svm.supportVectors.length > 0) {
        console.log('Dibujando límite de decisión con', svm.supportVectors.length, 'vectores de soporte');
        
        // Dibujar regiones con menor opacidad
        const resolution = 50;
        const stepX = (width - 2 * padding) / resolution;
        const stepY = (height - 2 * padding) / resolution;

        // Encontrar valores máximo y mínimo para normalización
        let maxVal = -Infinity;
        let minVal = Infinity;
        const predictions = [];
        
        for(let i = 0; i < resolution; i++) {
            predictions[i] = [];
            for(let j = 0; j < resolution; j++) {
                const x = padding + i * stepX;
                const y = padding + j * stepY;
                const [modelX, modelY] = canvasToModel(x, y);
                const prediction = svm.predict([modelX, modelY]);
                predictions[i][j] = prediction;
                maxVal = Math.max(maxVal, prediction);
                minVal = Math.min(minVal, prediction);
            }
        }

        // Dibujar regiones normalizadas
        for(let i = 0; i < resolution; i++) {
            for(let j = 0; j < resolution; j++) {
                const x = padding + i * stepX;
                const y = padding + j * stepY;
                const prediction = predictions[i][j];
                
                // Normalizar la predicción entre -1 y 1
                const normalizedPred = (prediction - minVal) / (maxVal - minVal) * 2 - 1;
                
                if(normalizedPred > 0) {
                    ctx.fillStyle = `rgba(80, 250, 123, ${Math.min(0.3, normalizedPred * 0.3)})`;
                } else {
                    ctx.fillStyle = `rgba(255, 85, 85, ${Math.min(0.3, -normalizedPred * 0.3)})`;
                }
                
                ctx.fillRect(x, y, stepX + 1, stepY + 1);
            }
        }
        
        // Dibujar línea de decisión
        ctx.strokeStyle = '#bd93f9';
        ctx.lineWidth = 2;
        ctx.beginPath();

        for(let i = 0; i < resolution; i++) {
            for(let j = 0; j < resolution; j++) {
                if(Math.abs(predictions[i][j]) < 0.1) {
                    const x = padding + i * stepX;
                    const y = padding + j * stepY;
                    if(ctx.beginPath.called) {
                        ctx.lineTo(x, y);
                    } else {
                        ctx.moveTo(x, y);
                        ctx.beginPath.called = true;
                    }
                }
            }
        }
        ctx.stroke();
    }
    
    // Dibujar puntos de datos
    drawPoints();
    
    // Dibujar vectores de soporte al final
    if(svm && svm.supportVectors.length > 0) {
        svm.supportVectors.forEach((sv, i) => {
            const [x, y] = modelToCanvas(sv[0], sv[1]);
            
            // Círculo exterior amarillo
            ctx.strokeStyle = colors.supportVector;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y, 12, 0, Math.PI * 2);
            ctx.stroke();
            
            // Círculo interior del color de la clase
            ctx.fillStyle = svm.supportVectorLabels[i] === 1 ? colors.positive : colors.negative;
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

// Entrenar el modelo
async function train() {
    console.log('Iniciando entrenamiento...');
    isTraining = true;
    document.getElementById('currentStep').textContent = 'Training SVM...';
    
    // Crear y entrenar el modelo
    svm = new SVM(selectedKernel);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('Entrenando con datos:', { 
        puntos: data.length, 
        etiquetas: labels.length,
        kernel: selectedKernel 
    });
    
    svm.fit(data, labels);
    
    console.log('Entrenamiento completado:', {
        vectoresSoporte: svm.supportVectors.length,
        bias: svm.bias
    });
    
    // Probar predicciones
    const testPoint = data[0];
    const prediction = svm.predict(testPoint);
    console.log('Prueba de predicción:', {
        punto: testPoint,
        prediccion: prediction,
        esperado: labels[0]
    });
    
    isTraining = false;
    document.getElementById('currentStep').textContent = 
        'Training complete! Click to add positive points, Ctrl+click for negative points';
    
    // Forzar redibujado
    draw();
}

class SVM {
    constructor(kernel = 'rbf', C = 1.0) {
        this.kernel = kernel;
        this.C = C;
        this.weights = [];
        this.bias = 0;
        this.supportVectors = [];
        this.supportVectorLabels = [];
        this.supportVectorWeights = [];
        this.tolerance = 1e-3;  // Tolerancia para considerar un peso como no-cero
    }

    // RBF (Gaussian) kernel function
    rbfKernel(x1, x2, gamma = 0.1) {
        const diff = x1.map((val, i) => val - x2[i]);
        const squaredNorm = diff.reduce((sum, val) => sum + val * val, 0);
        return Math.exp(-gamma * squaredNorm);
    }

    // Linear kernel function
    linearKernel(x1, x2) {
        return x1.reduce((sum, val, i) => sum + val * x2[i], 0);
    }

    // Polynomial kernel function
    polyKernel(x1, x2, degree = 2) {
        const dot = x1.reduce((sum, val, i) => sum + val * x2[i], 0);
        return Math.pow(dot + 1, degree);
    }

    // Calculate kernel based on selected type
    kernelFunction(x1, x2) {
        switch(this.kernel) {
            case 'rbf':
                return this.rbfKernel(x1, x2);
            case 'linear':
                return this.linearKernel(x1, x2);
            case 'poly':
                return this.polyKernel(x1, x2);
            default:
                return this.rbfKernel(x1, x2);
        }
    }

    fit(X, y, maxIterations = 1000) {  // Aumentado el número de iteraciones
        const n = X.length;
        this.weights = new Array(n).fill(0);
        let alphas = new Array(n).fill(0);
        this.bias = 0;
        
        let iteration = 0;
        let numChanged = 0;
        let examineAll = true;

        while((numChanged > 0 || examineAll) && iteration < maxIterations) {
            numChanged = 0;
            
            if(examineAll) {
                // Examinar todos los ejemplos
                for(let i = 0; i < n; i++) {
                    numChanged += this.examineExample(i, X, y, alphas);
                }
            } else {
                // Examinar ejemplos con 0 < alpha < C
                for(let i = 0; i < n; i++) {
                    if(alphas[i] > 0 && alphas[i] < this.C) {
                        numChanged += this.examineExample(i, X, y, alphas);
                    }
                }
            }
            
            if(examineAll) {
                examineAll = false;
            } else if(numChanged === 0) {
                examineAll = true;
            }
            
            iteration++;
        }

        console.log('Entrenamiento terminado después de', iteration, 'iteraciones');

        // Guardar vectores de soporte
        this.supportVectors = [];
        this.supportVectorLabels = [];
        this.supportVectorWeights = [];
        
        for(let i = 0; i < n; i++) {
            if(alphas[i] > this.tolerance) {  // Usar tolerancia para identificar vectores de soporte
                this.supportVectors.push(X[i]);
                this.supportVectorLabels.push(y[i]);
                this.supportVectorWeights.push(alphas[i]);
            }
        }

        console.log('Vectores de soporte encontrados:', this.supportVectors.length);
    }

    examineExample(i, X, y, alphas) {
        const yi = y[i];
        const alph = alphas[i];
        const Ei = this.calculateError(i, X, y, alphas);
        const r = yi * Ei;

        // Comprobar las condiciones KKT
        if((r < -this.tolerance && alph < this.C) || (r > this.tolerance && alph > 0)) {
            // Buscar el segundo ejemplo
            let j = this.findSecondExample(i, X.length);
            if(j >= 0) {
                return this.takeStep(i, j, X, y, alphas);
            }
        }

        return 0;
    }

    calculateError(i, X, y, alphas) {
        let f = this.bias;
        for(let j = 0; j < X.length; j++) {
            f += alphas[j] * y[j] * this.kernelFunction(X[i], X[j]);
        }
        return f - y[i];
    }

    findSecondExample(i, n) {
        // Seleccionar un índice aleatorio diferente de i
        let j;
        do {
            j = Math.floor(Math.random() * n);
        } while(j === i);
        return j;
    }

    takeStep(i, j, X, y, alphas) {
        if(i === j) return 0;

        const alph1 = alphas[i];
        const alph2 = alphas[j];
        const y1 = y[i];
        const y2 = y[j];
        const E1 = this.calculateError(i, X, y, alphas);
        const E2 = this.calculateError(j, X, y, alphas);
        const s = y1 * y2;

        // Calcular L y H
        let L, H;
        if(y1 !== y2) {
            L = Math.max(0, alph2 - alph1);
            H = Math.min(this.C, this.C + alph2 - alph1);
        } else {
            L = Math.max(0, alph2 + alph1 - this.C);
            H = Math.min(this.C, alph2 + alph1);
        }

        if(L === H) return 0;

        const k11 = this.kernelFunction(X[i], X[i]);
        const k12 = this.kernelFunction(X[i], X[j]);
        const k22 = this.kernelFunction(X[j], X[j]);
        const eta = 2 * k12 - k11 - k22;

        let a2;
        if(eta < 0) {
            a2 = alph2 - y2 * (E1 - E2) / eta;
            if(a2 < L) a2 = L;
            else if(a2 > H) a2 = H;
        } else {
            return 0;
        }

        if(Math.abs(a2 - alph2) < this.tolerance * (a2 + alph2 + this.tolerance)) {
            return 0;
        }

        const a1 = alph1 + s * (alph2 - a2);
        
        // Actualizar bias
        const b1 = E1 + y1 * (a1 - alph1) * k11 + y2 * (a2 - alph2) * k12 + this.bias;
        const b2 = E2 + y1 * (a1 - alph1) * k12 + y2 * (a2 - alph2) * k22 + this.bias;
        
        this.bias = (b1 + b2) / 2;
        alphas[i] = a1;
        alphas[j] = a2;

        return 1;
    }

    predict(x) {
        if(!this.supportVectors || this.supportVectors.length === 0) {
            console.warn('No hay vectores de soporte para predicción');
            return 0;
        }
        
        // Calcular la suma ponderada de las contribuciones de los vectores de soporte
        const f = this.supportVectors.reduce((sum, sv, i) => {
            return sum + this.supportVectorWeights[i] * 
                   this.supportVectorLabels[i] * 
                   this.kernelFunction(x, sv);
        }, 0);
        
        // Normalizar el resultado
        return f + this.bias;
    }
}

// Event Listeners
document.getElementById('startBtn').addEventListener('click', () => {
    if(!isTraining) train();
});

document.getElementById('resetBtn').addEventListener('click', init);

document.getElementById('kernelSelect').addEventListener('change', (e) => {
    selectedKernel = e.target.value;
    if(svm) train();
});

canvas.addEventListener('click', (e) => {
    if(isTraining) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const [modelX, modelY] = canvasToModel(x, y);
    
    // Alternar entre clases positiva y negativa
    const label = e.ctrlKey ? -1 : 1;
    
    data.push([modelX, modelY]);
    labels.push(label);
    
    if(svm) train();
    else draw();
});

// Inicializar visualización
init(); 