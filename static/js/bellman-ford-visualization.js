class BellmanFordVisualizer {
    constructor() {
        this.svg = document.getElementById('bellmanFordVisualization');
        this.nodes = {};
        this.edges = [];
        this.isPlaying = false;
        this.animationSpeed = 1000;
        this.currentStep = 0;
        this.distances = {};
        this.predecessors = {};
        
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
        const numNodes = 6; // Smaller number of nodes for clarity
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

        // Generate random edges with weights (including some negative weights)
        for (let i = 0; i < numNodes; i++) {
            const numEdges = Math.floor(Math.random() * 3) + 1; // 1-3 edges per node
            for (let j = 0; j < numEdges; j++) {
                const to = Math.floor(Math.random() * numNodes);
                if (i !== to && !this.edges.some(e => e.from === i && e.to === to)) {
                    // Generate weight between -5 and 10
                    const weight = Math.floor(Math.random() * 16) - 5;
                    this.edges.push({from: i, to: to, weight: weight});
                    this.nodes[i].neighbors.push(to);
                }
            }
        }

        this.drawGraph();
        this.setupNodeClickHandlers();
    }

    drawGraph() {
        // Draw edges with weights
        for (const edge of this.edges) {
            const from = this.nodes[edge.from];
            const to = this.nodes[edge.to];
            
            // Calculate edge path
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', from.x);
            line.setAttribute('y1', from.y);
            line.setAttribute('x2', to.x);
            line.setAttribute('y2', to.y);
            line.setAttribute('stroke', '#666');
            line.setAttribute('stroke-width', '2');
            this.svg.appendChild(line);

            // Add weight label
            const weightLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            weightLabel.setAttribute('x', midX);
            weightLabel.setAttribute('y', midY);
            weightLabel.setAttribute('fill', edge.weight < 0 ? '#ff4444' : '#ffffff');
            weightLabel.setAttribute('text-anchor', 'middle');
            weightLabel.textContent = edge.weight;
            this.svg.appendChild(weightLabel);
        }

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

            // Add node label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', node.x);
            text.setAttribute('y', node.y + 6);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', '#fff');
            text.textContent = id;
            this.svg.appendChild(text);

            // Add distance label (initially infinity)
            const distLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            distLabel.setAttribute('x', node.x);
            distLabel.setAttribute('y', node.y - 30);
            distLabel.setAttribute('text-anchor', 'middle');
            distLabel.setAttribute('fill', '#fff');
            distLabel.setAttribute('class', `distance-${id}`);
            distLabel.textContent = '∞';
            this.svg.appendChild(distLabel);
        }
    }

    setupNodeClickHandlers() {
        const circles = this.svg.querySelectorAll('circle');
        circles.forEach((circle, index) => {
            circle.style.cursor = 'pointer';
            circle.addEventListener('click', () => this.start(index));
        });
    }

    async start(sourceNode = 0) {
        if (this.isPlaying) return;
        this.isPlaying = true;
        
        document.getElementById('startVisualization').disabled = true;
        document.getElementById('generateGraph').disabled = true;

        // Initialize distances
        this.distances = {};
        this.predecessors = {};
        for (const id in this.nodes) {
            this.distances[id] = id == sourceNode ? 0 : Infinity;
            this.predecessors[id] = null;
            this.updateDistanceLabel(id);
        }

        // Color source node
        this.svg.querySelectorAll('circle')[sourceNode].setAttribute('fill', '#4CAF50');

        // Main Bellman-Ford algorithm
        const V = Object.keys(this.nodes).length;
        
        // Relax edges |V| - 1 times
        for (let i = 0; i < V - 1; i++) {
            document.getElementById('currentStep').textContent = `Iteration ${i + 1} of ${V - 1}`;
            
            for (const edge of this.edges) {
                await this.sleep(this.animationSpeed);
                
                // Highlight current edge
                const line = this.findEdge(edge.from, edge.to);
                line.setAttribute('stroke', '#ff9800');
                line.setAttribute('stroke-width', '3');

                if (this.distances[edge.from] !== Infinity && 
                    this.distances[edge.from] + edge.weight < this.distances[edge.to]) {
                    
                    this.distances[edge.to] = this.distances[edge.from] + edge.weight;
                    this.predecessors[edge.to] = edge.from;
                    this.updateDistanceLabel(edge.to);
                    
                    // Highlight successful relaxation
                    line.setAttribute('stroke', '#4CAF50');
                }

                await this.sleep(this.animationSpeed);
                line.setAttribute('stroke', '#666');
                line.setAttribute('stroke-width', '2');
            }
        }

        // Check for negative cycles
        let hasNegativeCycle = false;
        for (const edge of this.edges) {
            if (this.distances[edge.from] !== Infinity && 
                this.distances[edge.from] + edge.weight < this.distances[edge.to]) {
                hasNegativeCycle = true;
                const line = this.findEdge(edge.from, edge.to);
                line.setAttribute('stroke', '#ff4444');
                line.setAttribute('stroke-width', '3');
            }
        }

        document.getElementById('currentStep').textContent = hasNegativeCycle ? 
            'Negative cycle detected!' : 
            'Algorithm completed! Click on a node to start again.';

        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
        document.getElementById('generateGraph').disabled = false;
    }

    updateDistanceLabel(nodeId) {
        const label = this.svg.querySelector(`.distance-${nodeId}`);
        label.textContent = this.distances[nodeId] === Infinity ? '∞' : this.distances[nodeId];
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
        document.getElementById('currentStep').textContent = 'Click on a node to start Bellman-Ford algorithm';
        
        // Reset node colors
        this.svg.querySelectorAll('circle').forEach(circle => {
            circle.setAttribute('fill', '#2a2a2a');
        });
        
        // Reset edge colors
        this.svg.querySelectorAll('line').forEach(line => {
            line.setAttribute('stroke', '#666');
            line.setAttribute('stroke-width', '2');
        });

        // Reset distance labels
        for (const id in this.nodes) {
            const label = this.svg.querySelector(`.distance-${id}`);
            label.textContent = '∞';
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize visualizer when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BellmanFordVisualizer();
}); 