class AStarVisualizer {
    constructor(gridId) {
        this.grid = document.getElementById(gridId);
        this.cells = [];
        this.startCell = null;
        this.endCell = null;
        this.isDrawing = false;
        this.isPlaying = false;
        this.animationSpeed = 10;
        
        this.GRID_SIZE = 25;
        this.setupGrid();
        this.setupControls();
    }
    
    setupGrid() {
        for (let row = 0; row < this.GRID_SIZE; row++) {
            this.cells[row] = [];
            for (let col = 0; col < this.GRID_SIZE; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // Setup cell event listeners
                cell.addEventListener('mousedown', (e) => this.handleCellMouseDown(e));
                cell.addEventListener('mouseenter', (e) => this.handleCellMouseEnter(e));
                cell.addEventListener('mouseup', () => this.handleCellMouseUp());
                
                this.grid.appendChild(cell);
                this.cells[row][col] = {
                    element: cell,
                    isWall: false,
                    row,
                    col,
                    f: 0,
                    g: 0,
                    h: 0,
                    parent: null
                };
            }
        }
        
        // Prevent dragging issues
        this.grid.addEventListener('mouseleave', () => this.isDrawing = false);
    }
    
    setupControls() {
        document.getElementById('startVisualization').addEventListener('click', () => this.start());
        document.getElementById('resetVisualization').addEventListener('click', () => this.reset());
        document.getElementById('generateMaze').addEventListener('click', () => this.generateMaze());
        document.getElementById('speedControl').addEventListener('input', (e) => {
            this.animationSpeed = 50 - (e.target.value * 8);
        });
    }
    
    handleCellMouseDown(e) {
        const cell = this.cells[e.target.dataset.row][e.target.dataset.col];
        
        if (!this.startCell && !cell.isWall) {
            this.setStartCell(cell);
        } else if (!this.endCell && !cell.isWall && cell !== this.startCell) {
            this.setEndCell(cell);
        } else {
            this.isDrawing = true;
            this.toggleWall(cell);
        }
    }
    
    handleCellMouseEnter(e) {
        if (this.isDrawing) {
            const cell = this.cells[e.target.dataset.row][e.target.dataset.col];
            if (cell !== this.startCell && cell !== this.endCell) {
                this.toggleWall(cell);
            }
        }
    }
    
    handleCellMouseUp() {
        this.isDrawing = false;
    }
    
    setStartCell(cell) {
        this.startCell = cell;
        cell.element.classList.add('start');
        document.getElementById('currentStep').textContent = 'Select end point';
    }
    
    setEndCell(cell) {
        this.endCell = cell;
        cell.element.classList.add('end');
        document.getElementById('currentStep').textContent = 'Draw walls (click and drag) or click Start';
        document.getElementById('startVisualization').disabled = false;
    }
    
    toggleWall(cell) {
        if (cell !== this.startCell && cell !== this.endCell) {
            cell.isWall = !cell.isWall;
            cell.element.classList.toggle('wall');
        }
    }
    
    async start() {
        if (!this.startCell || !this.endCell || this.isPlaying) return;
        
        this.isPlaying = true;
        document.getElementById('startVisualization').disabled = true;
        document.getElementById('generateMaze').disabled = true;
        
        const path = await this.findPath();
        
        if (path) {
            await this.animatePath(path);
            document.getElementById('currentStep').textContent = 'Path found!';
        } else {
            document.getElementById('currentStep').textContent = 'No path exists!';
        }
        
        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
        document.getElementById('generateMaze').disabled = false;
    }
    
    async findPath() {
        const openSet = [this.startCell];
        const closedSet = new Set();
        
        while (openSet.length > 0 && this.isPlaying) {
            const current = this.getLowestFScoreNode(openSet);
            
            if (current === this.endCell) {
                return this.reconstructPath(current);
            }
            
            openSet.splice(openSet.indexOf(current), 1);
            closedSet.add(current);
            
            if (current !== this.startCell) {
                current.element.classList.add('visited');
            }
            
            const neighbors = this.getNeighbors(current);
            
            for (const neighbor of neighbors) {
                if (closedSet.has(neighbor)) continue;
                
                const tentativeG = current.g + 1;
                
                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                    if (neighbor !== this.endCell) {
                        neighbor.element.classList.add('considering');
                    }
                } else if (tentativeG >= neighbor.g) {
                    continue;
                }
                
                neighbor.parent = current;
                neighbor.g = tentativeG;
                neighbor.h = this.heuristic(neighbor, this.endCell);
                neighbor.f = neighbor.g + neighbor.h;
                
                await this.sleep(this.animationSpeed);
            }
        }
        
        return null;
    }
    
    getLowestFScoreNode(openSet) {
        return openSet.reduce((min, cell) => 
            cell.f < min.f ? cell : min
        );
    }
    
    getNeighbors(cell) {
        const neighbors = [];
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1]  // Up, Down, Left, Right
        ];
        
        for (const [dx, dy] of directions) {
            const newRow = cell.row + dx;
            const newCol = cell.col + dy;
            
            if (this.isValidCell(newRow, newCol)) {
                const neighbor = this.cells[newRow][newCol];
                if (!neighbor.isWall) {
                    neighbors.push(neighbor);
                }
            }
        }
        
        return neighbors;
    }
    
    isValidCell(row, col) {
        return row >= 0 && row < this.GRID_SIZE && 
               col >= 0 && col < this.GRID_SIZE;
    }
    
    heuristic(a, b) {
        return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
    }
    
    async reconstructPath(cell) {
        const path = [];
        let current = cell;
        
        while (current.parent) {
            path.unshift(current);
            current = current.parent;
        }
        
        return path;
    }
    
    async animatePath(path) {
        for (const cell of path) {
            if (cell !== this.endCell) {
                cell.element.classList.add('path');
                await this.sleep(50);
            }
        }
    }
    
    generateMaze() {
        // Recursive Division Maze Generation
        this.reset();
        this.recursiveDivision(0, 0, this.GRID_SIZE, this.GRID_SIZE);
    }
    
    recursiveDivision(startRow, startCol, height, width) {
        if (height <= 2 || width <= 2) return;
        
        const horizontal = height < width;
        
        // Find wall position
        const wallRow = startRow + (horizontal ? Math.floor(height/2) : 0);
        const wallCol = startCol + (horizontal ? 0 : Math.floor(width/2));
        
        // Find passage position
        const passagePos = horizontal ? 
            wallCol + Math.floor(Math.random() * width) :
            wallRow + Math.floor(Math.random() * height);
        
        // Draw wall
        if (horizontal) {
            for (let col = wallCol; col < wallCol + width; col++) {
                if (col !== passagePos) {
                    const cell = this.cells[wallRow][col];
                    if (cell !== this.startCell && cell !== this.endCell) {
                        cell.isWall = true;
                        cell.element.classList.add('wall');
                    }
                }
            }
        } else {
            for (let row = wallRow; row < wallRow + height; row++) {
                if (row !== passagePos) {
                    const cell = this.cells[row][wallCol];
                    if (cell !== this.startCell && cell !== this.endCell) {
                        cell.isWall = true;
                        cell.element.classList.add('wall');
                    }
                }
            }
        }
        
        // Recursively divide sub-chambers
        if (horizontal) {
            this.recursiveDivision(startRow, startCol, wallRow - startRow, width);
            this.recursiveDivision(wallRow + 1, startCol, height - (wallRow - startRow + 1), width);
        } else {
            this.recursiveDivision(startRow, startCol, height, wallCol - startCol);
            this.recursiveDivision(startRow, wallCol + 1, height, width - (wallCol - startCol + 1));
        }
    }
    
    reset() {
        this.isPlaying = false;
        this.startCell = null;
        this.endCell = null;
        
        for (let row = 0; row < this.GRID_SIZE; row++) {
            for (let col = 0; col < this.GRID_SIZE; col++) {
                const cell = this.cells[row][col];
                cell.element.className = 'cell';
                cell.isWall = false;
                cell.f = 0;
                cell.g = 0;
                cell.h = 0;
                cell.parent = null;
            }
        }
        
        document.getElementById('startVisualization').disabled = true;
        document.getElementById('generateMaze').disabled = false;
        document.getElementById('currentStep').textContent = 'Select start point';
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize visualization when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AStarVisualizer('astarGrid');
}); 