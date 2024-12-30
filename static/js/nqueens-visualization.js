class NQueensVisualizer {
    constructor() {
        this.boardSize = 8;
        this.board = [];
        this.isPlaying = false;
        this.animationSpeed = 500;
        this.solutionsFound = 0;
        this.shouldStop = false;
        
        this.setupControls();
        this.initializeBoard();
        this.drawBoard();
    }
    
    setupControls() {
        document.getElementById('boardSize').addEventListener('change', (e) => {
            this.boardSize = parseInt(e.target.value);
            this.reset();
        });
        
        document.getElementById('startVisualization').addEventListener('click', () => this.start());
        document.getElementById('resetVisualization').addEventListener('click', () => this.reset());
        
        document.getElementById('speedControl').addEventListener('input', (e) => {
            this.animationSpeed = 1000 - (e.target.value * 150);
        });
    }
    
    initializeBoard() {
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
    }
    
    drawBoard() {
        const chessboard = document.getElementById('chessboard');
        chessboard.innerHTML = '';
        chessboard.style.gridTemplateColumns = `repeat(${this.boardSize}, 1fr)`;
        
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const cell = document.createElement('div');
                cell.className = `cell ${(i + j) % 2 === 0 ? 'light' : 'dark'}`;
                
                if (this.board[i][j] === 1) {
                    const queen = document.createElement('div');
                    queen.className = 'queen';
                    queen.textContent = '♛';
                    cell.appendChild(queen);
                }
                
                chessboard.appendChild(cell);
            }
        }
    }
    
    async start() {
        if (this.isPlaying) return;
        
        this.shouldStop = false;
        this.isPlaying = true;
        this.solutionsFound = 0;
        document.getElementById('startVisualization').disabled = true;
        document.getElementById('boardSize').disabled = true;
        
        // Clear the board before starting
        this.initializeBoard();
        this.drawBoard();
        
        await this.solveNQueens(0);
        
        if (!this.shouldStop) {
            this.isPlaying = false;
            document.getElementById('startVisualization').disabled = false;
            document.getElementById('boardSize').disabled = false;
        }
    }
    
    async reset() {
        // Force stop any ongoing visualization
        this.shouldStop = true;
        this.isPlaying = false;
        
        // Clear the board
        this.initializeBoard();
        this.drawBoard();
        
        // Reset UI state
        this.solutionsFound = 0;
        document.getElementById('solutionCount').textContent = 'Solutions found: 0';
        document.getElementById('currentStep').textContent = 'Select board size and click Start to begin visualization';
        document.getElementById('startVisualization').disabled = false;
        document.getElementById('boardSize').disabled = false;
    }
    
    isSafe(row, col) {
        // Check row on left side
        for (let j = 0; j < col; j++) {
            if (this.board[row][j] === 1) return false;
        }
        
        // Check upper diagonal
        for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
            if (this.board[i][j] === 1) return false;
        }
        
        // Check lower diagonal
        for (let i = row, j = col; i < this.boardSize && j >= 0; i++, j--) {
            if (this.board[i][j] === 1) return false;
        }
        
        return true;
    }
    
    async solveNQueens(col) {
        if (this.shouldStop) return false;
        
        if (col >= this.boardSize) {
            this.solutionsFound++;
            document.getElementById('solutionCount').textContent = `Solutions found: ${this.solutionsFound}`;
            await this.sleep(this.animationSpeed * 2);
            return true;
        }
        
        for (let row = 0; row < this.boardSize; row++) {
            if (this.shouldStop) return false;
            
            document.getElementById('currentStep').textContent = 
                `Trying queen at position (${row}, ${col})`;
            
            if (this.isSafe(row, col)) {
                this.board[row][col] = 1;
                this.drawBoard();
                await this.sleep(this.animationSpeed);
                
                await this.solveNQueens(col + 1);
                
                if (!this.shouldStop) {
                    // Backtrack
                    this.board[row][col] = 0;
                    this.drawBoard();
                    await this.sleep(this.animationSpeed / 2);
                }
            }
        }
        
        return false;
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize visualization when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NQueensVisualizer();
}); 