class DFSVisualizer {
    constructor() {
        this.svg = document.getElementById('dfsVisualization');
        this.nodes = {};
        this.edges = [];
        this.isPlaying = false;
        this.animationSpeed = 1000;
        
        // Initialize controls
        this.initializeControls();
        
        // Generate initial graph
        this.generateGraph();
    }

    initializeControls() {
        document.getElementById('startVisualization').addEventListener('click', () => this.start());
        document.getElementById('resetVisualization').addEventListener('click', () => this.reset());
        document.getElementById('generateGraph').addEventListener('click', () => this.generateGraph());
        
        // Speed control
        document.getElementById('speedControl').addEventListener('input', (e) => {
            const speed = 6 - e.target.value; // Invert scale for intuitive control
            this.animationSpeed = speed * 200;
        });
    }

    generateGraph() {
        // Clear existing graph
        this.svg.innerHTML = '';
        this.nodes = {};
        this.edges = [];

        // Generate random nodes
        const numNodes = 8;
        const width = this.svg.clientWidth;
        const height = this.svg.clientHeight;
        const radius = 20;

        // Create nodes in a circular layout
        for (let i = 0; i < numNodes; i++) {
            const angle = (i * 2 * Math.PI) / numNodes;
            const x = width/2 + (width/3) * Math.cos(angle);
            const y = height/2 + (height/3) * Math.sin(angle);
            
            this.nodes[i] = {
                x: x,
                y: y,
                id: i,
                neighbors: []
            };
        }

        // Generate random edges (tree-like structure for better DFS visualization)
        for (let i = 1; i < numNodes; i++) {
            const parent = Math.floor(Math.random() * i); // Connect to a random previous node
            this.nodes[parent].neighbors.push(i);
            this.nodes[i].neighbors.push(parent);
            this.edges.push({from: parent, to: i});
        }

        // Add a few extra edges for cycles
        for (let i = 0; i < 2; i++) {
            const from = Math.floor(Math.random() * numNodes);
            const to = Math.floor(Math.random() * numNodes);
            if (from !== to && !this.nodes[from].neighbors.includes(to)) {
                this.nodes[from].neighbors.push(to);
                this.nodes[to].neighbors.push(from);
                this.edges.push({from, to});
            }
        }

        this.drawGraph();
        this.setupNodeClickHandlers();
    }

    drawGraph() {
        // Draw edges
        this.edges.forEach(edge => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', this.nodes[edge.from].x);
            line.setAttribute('y1', this.nodes[edge.from].y);
            line.setAttribute('x2', this.nodes[edge.to].x);
            line.setAttribute('y2', this.nodes[edge.to].y);
            line.setAttribute('stroke', '#666');
            line.setAttribute('stroke-width', '2');
            this.svg.appendChild(line);
        });

        // Draw nodes
        Object.values(this.nodes).forEach(node => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', node.x);
            circle.setAttribute('cy', node.y);
            circle.setAttribute('r', '20');
            circle.setAttribute('fill', '#2a2a2a');
            circle.setAttribute('stroke', '#666');
            circle.setAttribute('stroke-width', '2');
            circle.setAttribute('data-node-id', node.id);
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', node.x);
            text.setAttribute('y', node.y);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('fill', 'white');
            text.textContent = node.id;

            this.svg.appendChild(circle);
            this.svg.appendChild(text);
        });
    }

    setupNodeClickHandlers() {
        this.svg.querySelectorAll('circle').forEach(circle => {
            circle.addEventListener('click', (e) => {
                if (!this.isPlaying) {
                    const nodeId = parseInt(e.target.getAttribute('data-node-id'));
                    this.start(nodeId);
                }
            });

            circle.addEventListener('mouseover', (e) => {
                if (!this.isPlaying) {
                    e.target.setAttribute('fill', '#444');
                }
            });

            circle.addEventListener('mouseout', (e) => {
                if (!this.isPlaying) {
                    e.target.setAttribute('fill', '#2a2a2a');
                }
            });
        });
    }

    async dfsRecursive(vertex, visited, stack) {
        if (!this.isPlaying) return;
        
        visited.add(vertex);
        const currentNode = this.svg.querySelector(`circle[data-node-id="${vertex}"]`);
        currentNode.setAttribute('fill', '#bd93f9');
        
        stack.push(vertex);
        document.getElementById('currentStep').textContent = 
            `Visiting node ${vertex}. Stack: [${stack.join(' → ')}]`;

        await this.sleep(this.animationSpeed);

        for (const neighbor of this.nodes[vertex].neighbors) {
            if (!visited.has(neighbor)) {
                // Highlight edge being traversed
                const edge = this.findEdge(vertex, neighbor);
                if (edge) {
                    edge.setAttribute('stroke', '#8be9fd');
                    edge.setAttribute('stroke-width', '3');
                }

                await this.dfsRecursive(neighbor, visited, stack);
            }
        }

        stack.pop();
        currentNode.setAttribute('fill', '#50fa7b'); // Mark as fully explored
        
        if (stack.length > 0) {
            document.getElementById('currentStep').textContent = 
                `Backtracking from node ${vertex}. Stack: [${stack.join(' → ')}]`;
            await this.sleep(this.animationSpeed / 2);
        }
    }

    async start(startNode = 0) {
        if (this.isPlaying) return;
        this.isPlaying = true;
        document.getElementById('startVisualization').disabled = true;
        document.getElementById('generateGraph').disabled = true;

        // Reset node colors
        this.svg.querySelectorAll('circle').forEach(circle => {
            circle.setAttribute('fill', '#2a2a2a');
        });

        // Reset edge colors
        this.svg.querySelectorAll('line').forEach(line => {
            line.setAttribute('stroke', '#666');
            line.setAttribute('stroke-width', '2');
        });

        const visited = new Set();
        const stack = [];

        await this.dfsRecursive(startNode, visited, stack);

        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
        document.getElementById('generateGraph').disabled = false;
        document.getElementById('currentStep').textContent = 'DFS traversal complete! Click on a node to start again.';
    }

    findEdge(from, to) {
        const lines = this.svg.querySelectorAll('line');
        for (const line of lines) {
            const x1 = parseFloat(line.getAttribute('x1'));
            const y1 = parseFloat(line.getAttribute('y1'));
            const x2 = parseFloat(line.getAttribute('x2'));
            const y2 = parseFloat(line.getAttribute('y2'));
            
            if ((Math.abs(x1 - this.nodes[from].x) < 1 && Math.abs(y1 - this.nodes[from].y) < 1 &&
                 Math.abs(x2 - this.nodes[to].x) < 1 && Math.abs(y2 - this.nodes[to].y) < 1) ||
                (Math.abs(x1 - this.nodes[to].x) < 1 && Math.abs(y1 - this.nodes[to].y) < 1 &&
                 Math.abs(x2 - this.nodes[from].x) < 1 && Math.abs(y2 - this.nodes[from].y) < 1)) {
                return line;
            }
        }
        return null;
    }

    reset() {
        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
        document.getElementById('generateGraph').disabled = false;
        document.getElementById('currentStep').textContent = 'Click on a node to start DFS traversal';
        
        // Reset node colors
        this.svg.querySelectorAll('circle').forEach(circle => {
            circle.setAttribute('fill', '#2a2a2a');
        });
        
        // Reset edge colors
        this.svg.querySelectorAll('line').forEach(line => {
            line.setAttribute('stroke', '#666');
            line.setAttribute('stroke-width', '2');
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize visualizer when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DFSVisualizer();
}); 