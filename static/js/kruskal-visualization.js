class KruskalVisualizer {
    constructor() {
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.setAttribute("width", "100%");
        this.svg.setAttribute("height", "400");
        
        // Clear any existing content
        const container = document.getElementById("kruskalVisualization");
        container.innerHTML = '';
        container.appendChild(this.svg);
        
        this.nodes = {
            'A': { x: 100, y: 100 },
            'B': { x: 250, y: 50 },
            'C': { x: 400, y: 100 },
            'D': { x: 100, y: 300 },
            'E': { x: 250, y: 350 },
            'F': { x: 400, y: 300 }
        };
        
        this.edges = [
            { from: 'A', to: 'B', weight: 4 },
            { from: 'A', to: 'D', weight: 3 },
            { from: 'B', to: 'C', weight: 5 },
            { from: 'B', to: 'E', weight: 7 },
            { from: 'C', to: 'E', weight: 6 },
            { from: 'C', to: 'F', weight: 4 },
            { from: 'D', to: 'E', weight: 2 },
            { from: 'E', to: 'F', weight: 3 }
        ];
        
        this.isPlaying = false;
        this.animationSpeed = 1000;
        
        this.layouts = {
            'circle': this.circleLayout.bind(this),
            'grid': this.gridLayout.bind(this),
            'random': this.randomLayout.bind(this)
        };
        
        this.setupEnhancedControls();
        this.currentLayout = 'circle';
        this.isDragging = false;
        this.selectedNode = null;
        this.setupDragAndDrop();
    }
    
    setupEnhancedControls() {
        document.getElementById('startVisualization').addEventListener('click', () => this.start());
        document.getElementById('resetVisualization').addEventListener('click', () => this.reset());
        document.getElementById('speedControl').addEventListener('input', (e) => {
            this.animationSpeed = 2000 - (e.target.value * 300);
        });
        
        // Add layout selector
        const layoutSelect = document.createElement('select');
        layoutSelect.className = 'form-select layout-select';
        Object.keys(this.layouts).forEach(layout => {
            const option = document.createElement('option');
            option.value = layout;
            option.textContent = layout.charAt(0).toUpperCase() + layout.slice(1);
            layoutSelect.appendChild(option);
        });
        layoutSelect.addEventListener('change', (e) => {
            this.currentLayout = e.target.value;
            this.applyLayout();
        });
        
        // Add new graph button
        const newGraphBtn = document.createElement('button');
        newGraphBtn.className = 'btn btn-info';
        newGraphBtn.innerHTML = '<i class="fas fa-plus"></i> New Graph';
        newGraphBtn.addEventListener('click', () => this.generateNewGraph());
        
        const controls = document.querySelector('.visualization-controls');
        controls.appendChild(layoutSelect);
        controls.appendChild(newGraphBtn);
    }
    
    setupDragAndDrop() {
        this.svg.addEventListener('mousedown', (e) => {
            const node = e.target.closest('.graph-node');
            if (node) {
                this.isDragging = true;
                this.selectedNode = node;
                this.selectedNode.classList.add('dragging');
            }
        });
        
        this.svg.addEventListener('mousemove', (e) => {
            if (this.isDragging && this.selectedNode) {
                const rect = this.svg.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                this.updateNodePosition(this.selectedNode, x, y);
            }
        });
        
        this.svg.addEventListener('mouseup', () => {
            if (this.selectedNode) {
                this.selectedNode.classList.remove('dragging');
            }
            this.isDragging = false;
            this.selectedNode = null;
        });
    }
    
    circleLayout() {
        const nodeCount = Object.keys(this.nodes).length;
        const radius = 150;
        const center = { x: 250, y: 200 };
        
        Object.entries(this.nodes).forEach(([id, node], index) => {
            const angle = (2 * Math.PI * index) / nodeCount;
            node.x = center.x + radius * Math.cos(angle);
            node.y = center.y + radius * Math.sin(angle);
        });
    }
    
    gridLayout() {
        const nodeCount = Object.keys(this.nodes).length;
        const cols = Math.ceil(Math.sqrt(nodeCount));
        const spacing = 100;
        
        Object.entries(this.nodes).forEach(([id, node], index) => {
            node.x = (index % cols) * spacing + 100;
            node.y = Math.floor(index / cols) * spacing + 100;
        });
    }
    
    randomLayout() {
        Object.values(this.nodes).forEach(node => {
            node.x = Math.random() * 400 + 50;
            node.y = Math.random() * 300 + 50;
        });
    }
    
    generateNewGraph() {
        // Clear existing graph
        this.svg.innerHTML = '';
        
        const nodeCount = Math.floor(Math.random() * 4) + 5; // 5-8 nodes
        
        // Generate nodes
        this.nodes = {};
        for (let i = 0; i < nodeCount; i++) {
            this.nodes[String.fromCharCode(65 + i)] = { x: 0, y: 0 };
        }
        
        // Generate edges
        this.edges = [];
        const nodeIds = Object.keys(this.nodes);
        for (let i = 0; i < nodeIds.length; i++) {
            for (let j = i + 1; j < nodeIds.length; j++) {
                if (Math.random() < 0.6) { // 60% chance of edge
                    this.edges.push({
                        from: nodeIds[i],
                        to: nodeIds[j],
                        weight: Math.floor(Math.random() * 9) + 1
                    });
                }
            }
        }
        
        // Apply layout and draw
        this.applyLayout();
        this.reset();
    }
    
    applyLayout() {
        const layout = this.layouts[this.currentLayout];
        if (layout) {
            layout();
            this.updateGraphPositions();
        }
    }
    
    updateGraphPositions() {
        Object.entries(this.nodes).forEach(([id, node]) => {
            const nodeElement = this.svg.querySelector(`[data-node-id="${id}"]`);
            if (nodeElement) {
                const circle = nodeElement.querySelector('circle');
                const label = nodeElement.querySelector('text');
                
                circle.setAttribute('cx', node.x);
                circle.setAttribute('cy', node.y);
                label.setAttribute('x', node.x);
                label.setAttribute('y', node.y + 5);
            }
        });
        
        this.edges.forEach(edge => {
            const edgeElement = this.svg.querySelector(
                `line[data-from="${edge.from}"][data-to="${edge.to}"]`
            );
            if (edgeElement) {
                edgeElement.setAttribute('x1', this.nodes[edge.from].x);
                edgeElement.setAttribute('y1', this.nodes[edge.from].y);
                edgeElement.setAttribute('x2', this.nodes[edge.to].x);
                edgeElement.setAttribute('y2', this.nodes[edge.to].y);
                
                const weight = edgeElement.parentElement.querySelector('.edge-weight');
                weight.setAttribute('x', (this.nodes[edge.from].x + this.nodes[edge.to].x) / 2);
                weight.setAttribute('y', (this.nodes[edge.from].y + this.nodes[edge.to].y) / 2 - 10);
            }
        });
    }
    
    drawGraph() {
        // Clear existing elements before drawing
        this.svg.innerHTML = '';
        
        // Draw edges
        this.edges.forEach(edge => {
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.setAttribute('class', 'edge-group');
            
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute('x1', this.nodes[edge.from].x);
            line.setAttribute('y1', this.nodes[edge.from].y);
            line.setAttribute('x2', this.nodes[edge.to].x);
            line.setAttribute('y2', this.nodes[edge.to].y);
            line.setAttribute('class', 'graph-edge');
            line.setAttribute('data-from', edge.from);
            line.setAttribute('data-to', edge.to);
            
            const midX = (this.nodes[edge.from].x + this.nodes[edge.to].x) / 2;
            const midY = (this.nodes[edge.from].y + this.nodes[edge.to].y) / 2;
            
            const weight = document.createElementNS("http://www.w3.org/2000/svg", "text");
            weight.setAttribute('x', midX);
            weight.setAttribute('y', midY - 10);
            weight.setAttribute('class', 'edge-weight');
            weight.textContent = edge.weight;
            
            g.appendChild(line);
            g.appendChild(weight);
            this.svg.appendChild(g);
        });
        
        // Draw nodes
        Object.entries(this.nodes).forEach(([id, pos]) => {
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.setAttribute('data-node-id', id);
            
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute('cx', pos.x);
            circle.setAttribute('cy', pos.y);
            circle.setAttribute('r', 20);
            circle.setAttribute('class', 'graph-node');
            
            const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.setAttribute('x', pos.x);
            label.setAttribute('y', pos.y + 5);
            label.setAttribute('class', 'node-label');
            label.textContent = id;
            
            g.appendChild(circle);
            g.appendChild(label);
            this.svg.appendChild(g);
        });
    }
    
    async start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        document.getElementById('startVisualization').disabled = true;
        
        // Sort edges by weight
        const sortedEdges = [...this.edges].sort((a, b) => a.weight - b.weight);
        
        // Initialize disjoint set
        const parent = {};
        Object.keys(this.nodes).forEach(node => parent[node] = node);
        
        const find = node => {
            if (parent[node] !== node) {
                parent[node] = find(parent[node]);
            }
            return parent[node];
        };
        
        const union = (a, b) => {
            parent[find(a)] = find(b);
        };
        
        let mstEdges = [];
        
        for (const edge of sortedEdges) {
            document.getElementById('currentStep').textContent = 
                `Considering edge ${edge.from}-${edge.to} with weight ${edge.weight}`;
            
            this.highlightEdge(edge, 'considering');
            await this.sleep(this.animationSpeed);
            
            if (find(edge.from) !== find(edge.to)) {
                union(edge.from, edge.to);
                mstEdges.push(edge);
                this.highlightEdge(edge, 'included');
                
                document.getElementById('currentStep').textContent = 
                    `Added edge ${edge.from}-${edge.to} to MST`;
            } else {
                this.highlightEdge(edge, 'rejected');
                document.getElementById('currentStep').textContent = 
                    `Edge ${edge.from}-${edge.to} would create a cycle, skipping`;
            }
            
            await this.sleep(this.animationSpeed);
        }
        
        const totalWeight = mstEdges.reduce((sum, edge) => sum + edge.weight, 0);
        document.getElementById('currentStep').textContent = 
            `Minimum Spanning Tree found! Total weight: ${totalWeight}`;
        
        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
    }
    
    highlightEdge(edge, state) {
        const line = this.svg.querySelector(
            `line[x1="${this.nodes[edge.from].x}"][y1="${this.nodes[edge.from].y}"]` +
            `[x2="${this.nodes[edge.to].x}"][y2="${this.nodes[edge.to].y}"]`
        );
        
        line.classList.remove('considering', 'included', 'rejected');
        line.classList.add(state);
    }
    
    reset() {
        // Clear all existing elements
        this.svg.innerHTML = '';
        
        // Reset state
        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
        document.getElementById('currentStep').textContent = 'Click Start to begin visualization';
        
        // Redraw the initial graph
        this.drawGraph();
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize visualization when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new KruskalVisualizer();
}); 