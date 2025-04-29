class PrimVisualizer {
    constructor() {
        this.svg = document.getElementById('primVisualization');
        this.nodes = {};
        this.edges = [];
        this.isPlaying = false;
        this.animationSpeed = 1000;
        this.mstEdges = [];
        
        // Set SVG viewBox for better responsiveness
        const containerWidth = this.svg.parentElement.clientWidth;
        const containerHeight = 400;
        this.svg.setAttribute('viewBox', `0 0 ${containerWidth} ${containerHeight}`);
        this.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        
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
        this.nodes = {};
        this.edges = [];
        this.mstEdges = [];

        // Get dimensions
        const width = this.svg.clientWidth || 600;
        const height = 400;
        const radius = Math.min(width, height) * 0.35;
        const centerX = width / 2;
        const centerY = height / 2;
        const numNodes = 6;

        for (let i = 0; i < numNodes; i++) {
            const angle = (i * 2 * Math.PI) / numNodes;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            this.nodes[i] = { x, y, id: i };
        }

        // Generate random edges with weights
        for (let i = 0; i < numNodes; i++) {
            for (let j = i + 1; j < numNodes; j++) {
                if (Math.random() < 0.5) {
                    const weight = Math.floor(Math.random() * 10) + 1;
                    this.edges.push({ from: i, to: j, weight });
                }
            }
        }

        this.drawGraph();
    }

    drawGraph() {
        // Draw edges with weights
        for (const edge of this.edges) {
            const from = this.nodes[edge.from];
            const to = this.nodes[edge.to];
            
            // Draw line
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', from.x);
            line.setAttribute('y1', from.y);
            line.setAttribute('x2', to.x);
            line.setAttribute('y2', to.y);
            line.setAttribute('stroke', '#666');
            line.setAttribute('stroke-width', '2');
            this.svg.appendChild(line);

            // Add weight background for better visibility
            const labelX = (from.x + to.x) / 2;
            const labelY = (from.y + to.y) / 2 - 5;
            
            const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            labelBg.setAttribute('cx', labelX);
            labelBg.setAttribute('cy', labelY);
            labelBg.setAttribute('r', '12');
            labelBg.setAttribute('fill', '#333');
            labelBg.setAttribute('stroke', '#999');
            labelBg.setAttribute('stroke-width', '1');
            this.svg.appendChild(labelBg);

            // Add weight label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', labelX);
            text.setAttribute('y', labelY + 4);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', '#fff');
            text.setAttribute('font-weight', 'bold');
            text.textContent = edge.weight;
            this.svg.appendChild(text);
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

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', node.x);
            text.setAttribute('y', node.y + 6);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', '#fff');
            text.textContent = id;
            this.svg.appendChild(text);
        }
    }

    async start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        
        document.getElementById('startVisualization').disabled = true;
        document.getElementById('generateGraph').disabled = true;

        const visited = new Set();
        const minHeap = new MinHeap();
        const startNode = 0;
        visited.add(startNode);

        // Add initial edges from the start node
        for (const edge of this.edges) {
            if (edge.from === startNode || edge.to === startNode) {
                minHeap.insert(edge);
            }
        }

        while (!minHeap.isEmpty() && visited.size < Object.keys(this.nodes).length) {
            const edge = minHeap.extractMin();
            const { from, to, weight } = edge;

            if (visited.has(from) && visited.has(to)) continue;

            const newVertex = visited.has(from) ? to : from;
            visited.add(newVertex);
            this.mstEdges.push(edge);

            // Highlight the edge in the MST
            this.highlightEdge(from, to, '#4CAF50');

            // Add new edges from the newly added vertex
            for (const nextEdge of this.edges) {
                if ((nextEdge.from === newVertex && !visited.has(nextEdge.to)) ||
                    (nextEdge.to === newVertex && !visited.has(nextEdge.from))) {
                    minHeap.insert(nextEdge);
                }
            }

            document.getElementById('currentStep').textContent = 
                `Added edge (${from}, ${to}) with weight ${weight} to MST`;

            await this.sleep(this.animationSpeed);
        }

        document.getElementById('currentStep').textContent = 
            'Algorithm completed! Minimum Spanning Tree constructed.';

        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
        document.getElementById('generateGraph').disabled = false;
    }

    highlightEdge(from, to, color) {
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
                line.setAttribute('stroke', color);
                line.setAttribute('stroke-width', '3');
                break;
            }
        }
    }

    reset() {
        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
        document.getElementById('generateGraph').disabled = false;
        document.getElementById('currentStep').textContent = 
            'Click Start to begin Prim\'s algorithm';
        
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

class MinHeap {
    constructor() {
        this.heap = [];
    }

    insert(edge) {
        this.heap.push(edge);
        this.bubbleUp(this.heap.length - 1);
    }

    extractMin() {
        if (this.heap.length === 1) return this.heap.pop();
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown(0);
        return min;
    }

    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[index].weight >= this.heap[parentIndex].weight) break;
            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
            index = parentIndex;
        }
    }

    bubbleDown(index) {
        const length = this.heap.length;
        while (true) {
            const left = 2 * index + 1;
            const right = 2 * index + 2;
            let smallest = index;

            if (left < length && this.heap[left].weight < this.heap[smallest].weight) {
                smallest = left;
            }
            if (right < length && this.heap[right].weight < this.heap[smallest].weight) {
                smallest = right;
            }
            if (smallest === index) break;
            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}

// Initialize visualizer when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PrimVisualizer();
}); 