class FloydWarshallVisualizer {
    constructor() {
        this.svg = document.getElementById('floydWarshallVisualization');
        this.matrixDiv = document.getElementById('distanceMatrix');
        this.nodes = {};
        this.edges = [];
        this.isPlaying = false;
        this.animationSpeed = 1000;
        this.V = 5; // Number of vertices
        this.dist = [];
        this.next = [];
        
        // Initialize controls
        this.initializeControls();
        
        // Generate initial graph
        this.generateGraph();
    }

    initializeControls() {
        document.getElementById('startVisualization').addEventListener('click', () => this.start());
        document.getElementById('resetVisualization').addEventListener('click', () => this.reset());
        document.getElementById('generateGraph').addEventListener('click', () => this.generateGraph());
        
        document.getElementById('speedControl').addEventListener('input', (e) => {
            const speed = 6 - e.target.value;
            this.animationSpeed = speed * 200;
        });
    }

    generateGraph() {
        // Clear existing graph
        this.svg.innerHTML = '';
        this.matrixDiv.innerHTML = '';
        this.nodes = {};
        this.edges = [];

        // Generate nodes in a circular layout
        const width = this.svg.clientWidth;
        const height = this.svg.clientHeight;
        const radius = Math.min(width, height) * 0.35;
        const centerX = width / 2;
        const centerY = height / 2;

        for (let i = 0; i < this.V; i++) {
            const angle = (i * 2 * Math.PI) / this.V;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            this.nodes[i] = { x, y, id: i };
        }

        // Generate random edges with weights
        this.dist = Array(this.V).fill().map(() => Array(this.V).fill(Infinity));
        this.next = Array(this.V).fill().map(() => Array(this.V).fill(null));

        // Set diagonal elements to 0
        for (let i = 0; i < this.V; i++) {
            this.dist[i][i] = 0;
        }

        // Generate random edges
        for (let i = 0; i < this.V; i++) {
            for (let j = 0; j < this.V; j++) {
                if (i !== j && Math.random() < 0.4) {
                    const weight = Math.floor(Math.random() * 10) + 1;
                    this.edges.push({ from: i, to: j, weight });
                    this.dist[i][j] = weight;
                    this.next[i][j] = j;
                }
            }
        }

        this.drawGraph();
        this.drawMatrix();
    }

    drawGraph() {
        // Draw edges with weights
        for (const edge of this.edges) {
            const from = this.nodes[edge.from];
            const to = this.nodes[edge.to];
            
            // Draw arrow
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const angle = Math.atan2(dy, dx);
            const length = Math.sqrt(dx * dx + dy * dy);
            
            const nodeRadius = 20;
            const arrowSize = 10;
            
            // Calculate start and end points considering node radius
            const startX = from.x + nodeRadius * Math.cos(angle);
            const startY = from.y + nodeRadius * Math.sin(angle);
            const endX = to.x - (nodeRadius + arrowSize) * Math.cos(angle);
            const endY = to.y - (nodeRadius + arrowSize) * Math.sin(angle);

            // Draw edge line
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', startX);
            line.setAttribute('y1', startY);
            line.setAttribute('x2', endX);
            line.setAttribute('y2', endY);
            line.setAttribute('stroke', '#666');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('marker-end', 'url(#arrowhead)');
            this.svg.appendChild(line);

            // Add weight label
            const labelX = (from.x + to.x) / 2;
            const labelY = (from.y + to.y) / 2 - 10;
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', labelX);
            text.setAttribute('y', labelY);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', '#fff');
            text.textContent = edge.weight;
            this.svg.appendChild(text);
        }

        // Define arrowhead marker
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', 'arrowhead');
        marker.setAttribute('markerWidth', '10');
        marker.setAttribute('markerHeight', '7');
        marker.setAttribute('refX', '9');
        marker.setAttribute('refY', '3.5');
        marker.setAttribute('orient', 'auto');
        
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
        polygon.setAttribute('fill', '#666');
        
        marker.appendChild(polygon);
        defs.appendChild(marker);
        this.svg.appendChild(defs);

        // Draw nodes
        for (const id in this.nodes) {
            const node = this.nodes[id];
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', node.x);
            circle.setAttribute('cy', node.y);
            circle.setAttribute('r', '20');
            circle.setAttribute('fill', '#2a2a2a');
            circle.setAttribute('stroke', '#fff');
            circle.setAttribute('stroke-width', '2');
            this.svg.appendChild(circle);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', node.x);
            text.setAttribute('y', node.y + 6);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', '#fff');
            text.textContent = id;
            this.svg.appendChild(text);
        }
    }

    drawMatrix() {
        this.matrixDiv.innerHTML = '';
        const table = document.createElement('table');
        table.className = 'distance-matrix';

        // Create header row
        const headerRow = document.createElement('tr');
        headerRow.appendChild(document.createElement('th')); // Empty corner cell
        for (let j = 0; j < this.V; j++) {
            const th = document.createElement('th');
            th.textContent = j;
            headerRow.appendChild(th);
        }
        table.appendChild(headerRow);

        // Create data rows
        for (let i = 0; i < this.V; i++) {
            const row = document.createElement('tr');
            
            // Row header
            const th = document.createElement('th');
            th.textContent = i;
            row.appendChild(th);
            
            // Data cells
            for (let j = 0; j < this.V; j++) {
                const td = document.createElement('td');
                td.id = `cell-${i}-${j}`;
                td.textContent = this.dist[i][j] === Infinity ? '∞' : this.dist[i][j];
                row.appendChild(td);
            }
            table.appendChild(row);
        }

        this.matrixDiv.appendChild(table);
    }

    async start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        
        document.getElementById('startVisualization').disabled = true;
        document.getElementById('generateGraph').disabled = true;

        // Main Floyd-Warshall algorithm
        for (let k = 0; k < this.V; k++) {
            document.getElementById('currentStep').textContent = 
                `Using vertex ${k} as intermediate vertex`;
            
            // Highlight current intermediate vertex
            const intermediateNode = this.svg.querySelectorAll('circle')[k];
            intermediateNode.setAttribute('fill', '#ff9800');

            for (let i = 0; i < this.V; i++) {
                for (let j = 0; j < this.V; j++) {
                    await this.sleep(this.animationSpeed);

                    // Highlight current cells being compared
                    this.highlightCell(i, k, '#4CAF50');
                    this.highlightCell(k, j, '#4CAF50');
                    this.highlightCell(i, j, '#ff9800');

                    if (this.dist[i][k] !== Infinity && 
                        this.dist[k][j] !== Infinity && 
                        this.dist[i][k] + this.dist[k][j] < this.dist[i][j]) {
                        
                        this.dist[i][j] = this.dist[i][k] + this.dist[k][j];
                        this.next[i][j] = this.next[i][k];
                        
                        // Update matrix display
                        const cell = document.getElementById(`cell-${i}-${j}`);
                        cell.textContent = this.dist[i][j];
                        cell.style.backgroundColor = '#4CAF50';
                        await this.sleep(this.animationSpeed);
                        cell.style.backgroundColor = '';
                    }

                    // Reset cell highlights
                    this.highlightCell(i, k, '');
                    this.highlightCell(k, j, '');
                    this.highlightCell(i, j, '');
                }
            }

            // Reset intermediate vertex color
            intermediateNode.setAttribute('fill', '#2a2a2a');
        }

        // Check for negative cycles
        let hasNegativeCycle = false;
        for (let i = 0; i < this.V; i++) {
            if (this.dist[i][i] < 0) {
                hasNegativeCycle = true;
                break;
            }
        }

        document.getElementById('currentStep').textContent = hasNegativeCycle ? 
            'Negative cycle detected!' : 
            'Algorithm completed! All shortest paths have been found.';

        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
        document.getElementById('generateGraph').disabled = false;
    }

    highlightCell(i, j, color) {
        const cell = document.getElementById(`cell-${i}-${j}`);
        cell.style.backgroundColor = color;
    }

    reset() {
        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
        document.getElementById('generateGraph').disabled = false;
        document.getElementById('currentStep').textContent = 
            'Click Start to begin Floyd-Warshall algorithm';
        
        // Reset node colors
        this.svg.querySelectorAll('circle').forEach(circle => {
            circle.setAttribute('fill', '#2a2a2a');
        });
        
        // Reset matrix colors
        for (let i = 0; i < this.V; i++) {
            for (let j = 0; j < this.V; j++) {
                this.highlightCell(i, j, '');
            }
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize visualizer when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FloydWarshallVisualizer();
}); 