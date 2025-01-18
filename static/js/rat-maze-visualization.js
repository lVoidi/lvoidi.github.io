class RatMazeVisualizer {
    constructor() {
        this.size = 8; // Default maze size
        this.maze = [];
        this.solution = [];
        this.isPlaying = false;
        this.animationSpeed = 100;
        this.shouldStop = false;
        
        this.setupControls();
        this.initializeMaze();
        this.drawMaze();
    }
    
    setupControls() {
        document.getElementById('startVisualization').addEventListener('click', () => this.start());
        document.getElementById('resetVisualization').addEventListener('click', () => this.reset());
        document.getElementById('generateMaze').addEventListener('click', () => this.generateRandomMaze());
        document.getElementById('mazeSize').addEventListener('change', (e) => {
            this.size = parseInt(e.target.value);
            this.reset();
        });
        
        document.getElementById('speedControl').addEventListener('input', (e) => {
            this.animationSpeed = 500 - (e.target.value * 50);
        });
    }
    
    initializeMaze() {
        this.maze = Array(this.size).fill().map(() => Array(this.size).fill(1));
        this.solution = Array(this.size).fill().map(() => Array(this.size).fill(0));
        // Ensure start and end points are accessible
        this.maze[0][0] = 1;
        this.maze[this.size-1][this.size-1] = 1;
    }
    
    generateRandomMaze() {
        this.initializeMaze();
        // Add random obstacles (30% of cells)
        for(let i = 0; i < this.size; i++) {
            for(let j = 0; j < this.size; j++) {
                if((i !== 0 || j !== 0) && (i !== this.size-1 || j !== this.size-1)) {
                    this.maze[i][j] = Math.random() < 0.3 ? 0 : 1;
                }
            }
        }
        this.drawMaze();
    }
    
    drawMaze() {
        const mazeContainer = document.getElementById('mazeContainer');
        mazeContainer.innerHTML = '';
        mazeContainer.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
        
        for(let i = 0; i < this.size; i++) {
            for(let j = 0; j < this.size; j++) {
                const cell = document.createElement('div');
                cell.className = 'maze-cell';
                
                if(this.maze[i][j] === 0) {
                    cell.classList.add('wall');
                }
                if(this.solution[i][j] === 1) {
                    cell.classList.add('path');
                }
                if(i === 0 && j === 0) {
                    cell.classList.add('start');
                }
                if(i === this.size-1 && j === this.size-1) {
                    cell.classList.add('end');
                }
                
                cell.addEventListener('click', () => this.toggleCell(i, j));
                mazeContainer.appendChild(cell);
            }
        }
    }
    
    toggleCell(i, j) {
        if(this.isPlaying) return;
        if((i === 0 && j === 0) || (i === this.size-1 && j === this.size-1)) return;
        
        this.maze[i][j] = this.maze[i][j] === 0 ? 1 : 0;
        this.drawMaze();
    }
    
    async start() {
        if(this.isPlaying) return;
        
        this.isPlaying = true;
        this.shouldStop = false;
        document.getElementById('startVisualization').disabled = true;
        document.getElementById('mazeSize').disabled = true;
        
        // Clear previous solution
        this.solution = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.drawMaze();
        
        const result = await this.solveMaze(0, 0);
        
        if(!this.shouldStop) {
            this.isPlaying = false;
            document.getElementById('startVisualization').disabled = false;
            document.getElementById('mazeSize').disabled = false;
            document.getElementById('currentStep').textContent = 
                result ? 'Path found!' : 'No path exists!';
        }
    }
    
    reset() {
        this.shouldStop = true;
        this.isPlaying = false;
        this.initializeMaze();
        this.drawMaze();
        document.getElementById('startVisualization').disabled = false;
        document.getElementById('mazeSize').disabled = false;
        document.getElementById('currentStep').textContent = 'Click on cells to toggle walls, then click Start';
    }
    
    isSafe(x, y) {
        return (x >= 0 && x < this.size && 
                y >= 0 && y < this.size && 
                this.maze[x][y] === 1);
    }
    
    async solveMaze(x, y) {
        if(this.shouldStop) return false;
        
        // Si llegamos al destino
        if(x === this.size-1 && y === this.size-1) {
            this.solution[x][y] = 1;
            this.drawMaze();
            return true;
        }
        
        // Si la posición es válida y no ha sido visitada
        if(this.isSafe(x, y) && this.solution[x][y] === 0) {
            document.getElementById('currentStep').textContent = 
                `Exploring position (${x+1}, ${y+1})`;
            
            // Marcar como parte del camino
            this.solution[x][y] = 1;
            this.drawMaze();
            await this.sleep(this.animationSpeed);
            
            // Movimientos posibles: derecha, abajo, izquierda, arriba
            const moves = [
                [0, 1],  // derecha
                [1, 0],  // abajo
                [0, -1], // izquierda
                [-1, 0]  // arriba
            ];
            
            // Intentar cada movimiento
            for(const [dx, dy] of moves) {
                const nextX = x + dx;
                const nextY = y + dy;
                
                if(await this.solveMaze(nextX, nextY)) {
                    return true;
                }
            }
            
            // Si ningún movimiento funciona, retroceder
            this.solution[x][y] = 0;
            this.drawMaze();
            await this.sleep(this.animationSpeed/2);
        }
        
        return false;
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize visualization when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RatMazeVisualizer();
}); 