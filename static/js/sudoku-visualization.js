class SudokuVisualizer {
    constructor() {
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.isPlaying = false;
        this.animationSpeed = 100;
        this.shouldStop = false;
        
        this.setupControls();
        this.loadExamplePuzzle();
        this.drawBoard();
    }
    
    setupControls() {
        document.getElementById('startVisualization').addEventListener('click', () => this.start());
        document.getElementById('resetVisualization').addEventListener('click', () => this.reset());
        document.getElementById('loadExample').addEventListener('click', () => this.loadExamplePuzzle());
        
        document.getElementById('speedControl').addEventListener('input', (e) => {
            this.animationSpeed = 500 - (e.target.value * 50);
        });
    }
    
    loadExamplePuzzle() {
        this.board = [
            [5,3,0,0,7,0,0,0,0],
            [6,0,0,1,9,5,0,0,0],
            [0,9,8,0,0,0,0,6,0],
            [8,0,0,0,6,0,0,0,3],
            [4,0,0,8,0,3,0,0,1],
            [7,0,0,0,2,0,0,0,6],
            [0,6,0,0,0,0,2,8,0],
            [0,0,0,4,1,9,0,0,5],
            [0,0,0,0,8,0,0,7,9]
        ];
        this.drawBoard();
    }
    
    drawBoard() {
        const sudokuBoard = document.getElementById('sudokuBoard');
        sudokuBoard.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.className = `cell${(i + j) % 2 === 0 ? ' light' : ' dark'}`;
                if (i % 3 === 0) cell.style.borderTop = '2px solid var(--accent-color)';
                if (j % 3 === 0) cell.style.borderLeft = '2px solid var(--accent-color)';
                if (i === 8) cell.style.borderBottom = '2px solid var(--accent-color)';
                if (j === 8) cell.style.borderRight = '2px solid var(--accent-color)';
                
                if (this.board[i][j] !== 0) {
                    cell.textContent = this.board[i][j];
                    cell.classList.add('initial');
                }
                
                cell.addEventListener('click', () => this.handleCellClick(i, j, cell));
                sudokuBoard.appendChild(cell);
            }
        }
    }
    
    handleCellClick(i, j, cell) {
        if (this.isPlaying) return;
        
        const value = prompt('Enter a number (1-9) or 0 to clear:', this.board[i][j]);
        if (value === null) return;
        
        const num = parseInt(value);
        if (isNaN(num) || num < 0 || num > 9) return;
        
        this.board[i][j] = num;
        this.drawBoard();
    }
    
    async start() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.shouldStop = false;
        document.getElementById('startVisualization').disabled = true;
        
        const result = await this.solveSudoku(0, 0);
        
        if (!this.shouldStop) {
            this.isPlaying = false;
            document.getElementById('startVisualization').disabled = false;
            document.getElementById('currentStep').textContent = 
                result ? 'Sudoku solved successfully!' : 'No solution exists!';
        }
    }
    
    reset() {
        this.shouldStop = true;
        this.isPlaying = false;
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.drawBoard();
        document.getElementById('startVisualization').disabled = false;
        document.getElementById('currentStep').textContent = 'Enter numbers and click Start to solve';
    }
    
    isValid(row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (this.board[row][x] === num) return false;
        }
        
        // Check column
        for (let x = 0; x < 9; x++) {
            if (this.board[x][col] === num) return false;
        }
        
        // Check 3x3 box
        let startRow = row - row % 3;
        let startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i + startRow][j + startCol] === num) return false;
            }
        }
        
        return true;
    }
    
    async solveSudoku(row, col) {
        if (this.shouldStop) return false;
        
        if (col === 9) {
            row++;
            col = 0;
        }
        
        if (row === 9) return true;
        
        if (this.board[row][col] > 0) {
            return await this.solveSudoku(row, col + 1);
        }
        
        document.getElementById('currentStep').textContent = 
            `Trying numbers at position (${row + 1}, ${col + 1})`;
        
        for (let num = 1; num <= 9; num++) {
            if (this.isValid(row, col, num)) {
                this.board[row][col] = num;
                this.drawBoard();
                await this.sleep(this.animationSpeed);
                
                if (await this.solveSudoku(row, col + 1)) {
                    return true;
                }
                
                this.board[row][col] = 0;
                this.drawBoard();
                await this.sleep(this.animationSpeed / 2);
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
    new SudokuVisualizer();
}); 