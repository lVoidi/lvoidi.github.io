class DijkstraVisualizer {
    constructor(svgId) {
        this.svg = document.getElementById(svgId);
        this.isPlaying = false;
        this.animationSpeed = 1000;
        this.isDragging = false;
        this.selectedNode = null;
        
        // Enhanced graph structure with more nodes
        this.nodes = {
            'A': { x: 100, y: 200, distance: Infinity },
            'B': { x: 250, y: 100, distance: Infinity },
            'C': { x: 250, y: 300, distance: Infinity },
            'D': { x: 400, y: 100, distance: Infinity },
            'E': { x: 400, y: 300, distance: Infinity },
            'F': { x: 550, y: 200, distance: Infinity }
        };
        
        this.edges = [
            { from: 'A', to: 'B', weight: 4 },
            { from: 'A', to: 'C', weight: 2 },
            { from: 'B', to: 'C', weight: 1 },
            { from: 'B', to: 'D', weight: 5 },
            { from: 'C', to: 'D', weight: 8 },
            { from: 'C', to: 'E', weight: 10 },
            { from: 'D', to: 'E', weight: 2 },
            { from: 'D', to: 'F', weight: 6 },
            { from: 'E', to: 'F', weight: 3 }
        ];
        
        this.sourceNode = null;
        this.targetNode = null;
        this.path = [];
        
        // Replace previous controls setup with new node selection
        this.setupControls();
        this.initializeVisualization();
        this.setupDragAndDrop();
        this.setupNodeSelection();
    }
    
    // Helper function to transform screen coordinates to SVG coordinates
    getSVGPoint(event) {
        const pt = this.svg.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;
        return pt.matrixTransform(this.svg.getScreenCTM().inverse());
    }
    
    setupDragAndDrop() {
        this.svg.addEventListener('mousedown', (e) => this.startDragging(e));
        this.svg.addEventListener('mousemove', (e) => this.drag(e));
        this.svg.addEventListener('mouseup', () => this.stopDragging());
        this.svg.addEventListener('mouseleave', () => this.stopDragging());
    }
    
    startDragging(e) {
        const svgPoint = this.getSVGPoint(e); // Use transformed point
        const node = this.findClickedNode(svgPoint.x, svgPoint.y);
        if (node) {
            this.isDragging = true;
            this.selectedNode = node;
        }
    }
    
    drag(e) {
        if (this.isDragging && this.selectedNode) {
            e.preventDefault(); // Prevent scrolling while dragging
            const svgPoint = this.getSVGPoint(e); // Use transformed point
            
            this.nodes[this.selectedNode].x = svgPoint.x;
            this.nodes[this.selectedNode].y = svgPoint.y;
            
            this.updateGraphPositions();
        }
    }
    
    stopDragging() {
        this.isDragging = false;
        this.selectedNode = null;
    }
    
    findClickedNode(x, y) { 
        for (const [id, node] of Object.entries(this.nodes)) {
            const dx = x - node.x;
            const dy = y - node.y;
            if (dx * dx + dy * dy < 400) { // 20px radius squared
                return id;
            }
        }
        return null;
    }
    
    updateGraphPositions() {
        // Update edges
        const edges = this.svg.querySelectorAll('.graph-edge');
        const weights = this.svg.querySelectorAll('.edge-weight');
        
        this.edges.forEach((edge, i) => {
            const startNode = this.nodes[edge.from];
            const endNode = this.nodes[edge.to];
            
            edges[i].setAttribute('x1', startNode.x);
            edges[i].setAttribute('y1', startNode.y);
            edges[i].setAttribute('x2', endNode.x);
            edges[i].setAttribute('y2', endNode.y);
            
            weights[i].setAttribute('x', (startNode.x + endNode.x) / 2);
            weights[i].setAttribute('y', (startNode.y + endNode.y) / 2);
        });
        
        // Update nodes
        Object.entries(this.nodes).forEach(([id, pos]) => {
            const node = this.svg.querySelector(`[data-node-id="${id}"]`);
            const circle = node.querySelector('circle');
            const label = node.querySelector('.node-label');
            const distance = node.querySelector('.distance-label');
            
            circle.setAttribute('cx', pos.x);
            circle.setAttribute('cy', pos.y);
            label.setAttribute('x', pos.x);
            label.setAttribute('y', pos.y + 5);
            distance.setAttribute('x', pos.x);
            distance.setAttribute('y', pos.y - 25);
        });
    }
    
    setupControls() {
        const resetBtn = document.getElementById('resetVisualization');
        const startBtn = document.getElementById('startVisualization');
        const speedControl = document.getElementById('speedControl');
        
        startBtn.textContent = 'Find Path';
        startBtn.disabled = true;
        
        startBtn.addEventListener('click', () => {
            if (this.sourceNode && this.targetNode) {
                this.start(this.sourceNode, this.targetNode);
            }
        });
        
        resetBtn.addEventListener('click', () => this.reset());
        speedControl.addEventListener('input', (e) => {
            this.animationSpeed = 1500 - (e.target.value * 250);
        });
    }
    
    setupNodeSelection() {
        this.svg.addEventListener('click', (e) => {
            if (this.isDragging) return; // Don't select if dragging just finished
            
            const svgPoint = this.getSVGPoint(e); // Use transformed point
            const nodeId = this.findClickedNode(svgPoint.x, svgPoint.y);
            if (!nodeId) return;
            
            // Logic to handle clicks AFTER source/target are selected (or during selection)
            if (this.sourceNode && this.targetNode) {
                // If both are selected, do nothing on click until reset
                return; 
            }
            
            if (!this.sourceNode) {
                this.sourceNode = nodeId;
                this.highlightNode(nodeId, 'source-node');
                document.getElementById('currentStep').textContent = 'Select target node';
            } else { // Source node IS set, check for target node
                 if (!this.targetNode && nodeId !== this.sourceNode) {
                    this.targetNode = nodeId;
                    this.highlightNode(nodeId, 'target-node');
                    document.getElementById('currentStep').textContent = 'Click "Find Path" to start';
                    document.getElementById('startVisualization').disabled = false;
                } 
                 // Implicitly do nothing if clicking source again, or if target already set
            }
        });
    }
    
    initializeVisualization() {
        this.svg.innerHTML = '';
        
        // Define SVG viewBox for scaling
        // Adjusted viewBox slightly for padding around nodes
        this.svg.setAttribute('viewBox', '50 50 550 300'); 
        this.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        
        // Create defs for arrow markers
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        marker.setAttribute('id', 'arrowhead');
        marker.setAttribute('markerWidth', '10');
        marker.setAttribute('markerHeight', '7');
        marker.setAttribute('refX', '9');
        marker.setAttribute('refY', '3.5');
        marker.setAttribute('orient', 'auto');
        
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
        polygon.setAttribute('fill', '#fff');
        
        marker.appendChild(polygon);
        defs.appendChild(marker);
        this.svg.appendChild(defs);
        
        // Draw edges with arrows
        this.edges.forEach(edge => {
            const startNode = this.nodes[edge.from];
            const endNode = this.nodes[edge.to];
            
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.setAttribute('class', 'edge-group');
            
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute('x1', startNode.x);
            line.setAttribute('y1', startNode.y);
            line.setAttribute('x2', endNode.x);
            line.setAttribute('y2', endNode.y);
            line.setAttribute('class', 'graph-edge');
            line.setAttribute('marker-end', 'url(#arrowhead)');
            
            const weight = document.createElementNS("http://www.w3.org/2000/svg", "text");
            weight.setAttribute('x', (startNode.x + endNode.x) / 2);
            weight.setAttribute('y', (startNode.y + endNode.y) / 2);
            weight.setAttribute('class', 'edge-weight');
            weight.textContent = edge.weight;
            
            g.appendChild(line);
            g.appendChild(weight);
            this.svg.appendChild(g);
        });
        
        // Draw nodes with distance labels
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
            
            const distance = document.createElementNS("http://www.w3.org/2000/svg", "text");
            distance.setAttribute('x', pos.x);
            distance.setAttribute('y', pos.y - 25);
            distance.setAttribute('class', 'distance-label');
            distance.textContent = '∞';
            
            g.appendChild(circle);
            g.appendChild(label);
            g.appendChild(distance);
            this.svg.appendChild(g);
        });
    }
    
    async dijkstra(source) {
        const distances = {};
        const previous = {};
        const unvisited = new Set(Object.keys(this.nodes));
        
        // Initialize distances
        Object.keys(this.nodes).forEach(node => {
            distances[node] = node === source ? 0 : Infinity;
            previous[node] = null;
            this.updateNodeDistance(node, distances[node]);
        });
        
        while (unvisited.size > 0 && this.isPlaying) {
            // Find node with minimum distance
            let current = Array.from(unvisited)
                .reduce((min, node) => 
                    distances[node] < distances[min] ? node : min,
                    Array.from(unvisited)[0]
                );
            
            if (distances[current] === Infinity) break;
            
            unvisited.delete(current);
            
            // Find all edges from current node
            const currentEdges = this.edges.filter(edge => 
                (edge.from === current && unvisited.has(edge.to))
            );
            
            for (const edge of currentEdges) {
                const neighbor = edge.to;
                const distance = distances[current] + edge.weight;
                
                // Highlight edge being considered
                this.highlightEdge(edge.from, edge.to, 'considering');
                await this.sleep(this.animationSpeed / 2);
                
                if (distance < distances[neighbor]) {
                    distances[neighbor] = distance;
                    previous[neighbor] = current;
                    this.updateNodeDistance(neighbor, distance);
                }
            }
            
            // Highlight current node as visited
            if (current !== this.targetNode && current !== this.sourceNode) {
                this.highlightNode(current, 'visited');
            }
            
            await this.sleep(this.animationSpeed);
        }
        
        return { distances, previous };
    }
    
    highlightNode(nodeId, className) {
        const node = this.svg.querySelector(`[data-node-id="${nodeId}"]`);
        const circle = node.querySelector('circle');
        circle.setAttribute('class', `graph-node ${className}`);
    }
    
    highlightEdge(from, to, className) {
        const edge = this.svg.querySelector(`line[x1="${this.nodes[from].x}"][y1="${this.nodes[from].y}"]` +
                                         `[x2="${this.nodes[to].x}"][y2="${this.nodes[to].y}"]`);
        edge.setAttribute('class', `graph-edge ${className}`);
    }
    
    updateNodeDistance(nodeId, distance) {
        const node = this.svg.querySelector(`[data-node-id="${nodeId}"]`);
        if (node) {
            const distanceLabel = node.querySelector('.distance-label');
            distanceLabel.textContent = distance === Infinity ? '∞' : distance;
        }
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async start(source, target) {
        if (this.isPlaying) return;
        this.isPlaying = true;
        document.getElementById('startVisualization').disabled = true;
        
        // Reset previous path
        this.clearPath();
        
        // Initialize distances
        Object.keys(this.nodes).forEach(node => {
            this.nodes[node].distance = node === source ? 0 : Infinity;
            this.updateNodeDistance(node);
        });
        
        const { distances, previous } = await this.dijkstra(source);
        
        if (distances[target] !== Infinity) {
            // Reconstruct and highlight path
            this.path = this.reconstructPath(previous, source, target);
            await this.animatePath(this.path);
            document.getElementById('currentStep').textContent = 
                `Shortest path length: ${distances[target]}`;
        } else {
            document.getElementById('currentStep').textContent = 
                'No path exists between selected nodes';
        }
        
        this.isPlaying = false;
        document.getElementById('startVisualization').disabled = false;
    }
    
    reconstructPath(previous, source, target) {
        const path = [];
        let current = target;
        
        while (current !== null && current !== source) {
            path.unshift(current);
            current = previous[current];
            
            // Break if no path exists
            if (!current) return [];
        }
        
        if (current === source) {
            path.unshift(source);
            return path;
        }
        
        return [];
    }
    
    async animatePath(path) {
        for (let i = 0; i < path.length - 1; i++) {
            const from = path[i];
            const to = path[i + 1];
            
            // Find the edge in either direction
            const edge = this.edges.find(e => 
                (e.from === from && e.to === to) || 
                (e.from === to && e.to === from)
            );
            
            if (edge) {
                const edgeElement = this.svg.querySelector(
                    `line[x1="${this.nodes[edge.from].x}"][y1="${this.nodes[edge.from].y}"]` +
                    `[x2="${this.nodes[edge.to].x}"][y2="${this.nodes[edge.to].y}"]`
                );
                
                if (edgeElement) {
                    edgeElement.classList.add('path');
                    await this.sleep(this.animationSpeed / 2);
                }
            }
        }
    }
    
    clearPath() {
        this.svg.querySelectorAll('.graph-edge').forEach(edge => {
            edge.classList.remove('path', 'considering');
        });
    }
    
    reset() {
        this.isPlaying = false;
        this.sourceNode = null;
        this.targetNode = null;
        this.path = [];
        
        document.getElementById('startVisualization').disabled = true;
        document.getElementById('currentStep').textContent = 'Select source node';
        
        // Reset node colors and distances
        Object.keys(this.nodes).forEach(node => {
            this.nodes[node].distance = Infinity;
            const nodeElement = this.svg.querySelector(`[data-node-id="${node}"]`);
            nodeElement.querySelector('circle').setAttribute('class', 'graph-node');
            this.updateNodeDistance(node);
        });
        
        this.clearPath();
    }
}

// Initialize visualization when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DijkstraVisualizer('dijkstraVisualization');
}); 