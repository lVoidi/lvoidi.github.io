class FordFulkersonVisualizer {
    constructor(svgId) {
        this.svg = d3.select(`#${svgId}`);
        this.width = this.svg.node().getBoundingClientRect().width;
        this.height = 400;
        this.padding = 50;
        this.nodeRadius = 20;
        this.animationSpeed = 1000;
        this.isPlaying = false;

        // Clear and set SVG dimensions
        this.svg.selectAll("*").remove();
        this.svg
            .attr("width", "100%")
            .attr("height", this.height)
            .attr("viewBox", `0 0 ${this.width} ${this.height}`)
            .attr("preserveAspectRatio", "xMidYMid meet");

        // Sample flow network
        this.graph = {
            nodes: [
                { id: 0, label: "S", x: 100, y: 200 },  // Source
                { id: 1, label: "A", x: 250, y: 100 },
                { id: 2, label: "B", x: 250, y: 300 },
                { id: 3, label: "C", x: 400, y: 100 },
                { id: 4, label: "D", x: 400, y: 300 },
                { id: 5, label: "T", x: 550, y: 200 }   // Sink
            ],
            edges: [
                { source: 0, target: 1, capacity: 16, flow: 0 },
                { source: 0, target: 2, capacity: 13, flow: 0 },
                { source: 1, target: 2, capacity: 10, flow: 0 },
                { source: 1, target: 3, capacity: 12, flow: 0 },
                { source: 2, target: 1, capacity: 4, flow: 0 },
                { source: 2, target: 4, capacity: 14, flow: 0 },
                { source: 3, target: 2, capacity: 9, flow: 0 },
                { source: 3, target: 5, capacity: 20, flow: 0 },
                { source: 4, target: 3, capacity: 7, flow: 0 },
                { source: 4, target: 5, capacity: 4, flow: 0 }
            ]
        };

        this.currentPath = [];
        this.maxFlow = 0;
        
        this.initVisualization();
    }

    initVisualization() {
        this.svg.selectAll("*").remove();
        
        // Reset flows
        this.graph.edges.forEach(edge => edge.flow = 0);
        this.maxFlow = 0;
        this.currentPath = [];

        // Create arrow marker
        this.svg.append("defs").append("marker")
            .attr("id", "arrowhead")
            .attr("viewBox", "-0 -5 10 10")
            .attr("refX", 25)
            .attr("refY", 0)
            .attr("orient", "auto")
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .append("svg:path")
            .attr("d", "M 0,-5 L 10 ,0 L 0,5")
            .attr("fill", "#999");

        this.drawGraph();
        this.updateStatus();
    }

    drawGraph() {
        // Draw edges
        this.edges = this.svg.append("g")
            .selectAll("g")
            .data(this.graph.edges)
            .enter()
            .append("g");

        this.edgePaths = this.edges.append("path")
            .attr("class", "edge")
            .attr("d", d => this.calculateEdgePath(d))
            .attr("stroke", "#999")
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .attr("marker-end", "url(#arrowhead)");

        this.edgeLabels = this.edges.append("text")
            .attr("class", "edge-label")
            .attr("text-anchor", "middle")
            .attr("dy", -5)
            .append("textPath")
            .attr("href", (d, i) => `#edge${i}`)
            .attr("startOffset", "50%")
            .text(d => `${d.flow}/${d.capacity}`);

        // Draw nodes
        this.nodes = this.svg.append("g")
            .selectAll("g")
            .data(this.graph.nodes)
            .enter()
            .append("g")
            .attr("transform", d => `translate(${d.x},${d.y})`);

        this.nodes.append("circle")
            .attr("r", this.nodeRadius)
            .attr("fill", "#fff")
            .attr("stroke", "#333")
            .attr("stroke-width", 2);

        this.nodes.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".3em")
            .text(d => d.label);
    }

    calculateEdgePath(edge) {
        const source = this.graph.nodes[edge.source];
        const target = this.graph.nodes[edge.target];
        return `M${source.x},${source.y}L${target.x},${target.y}`;
    }

    updateStatus() {
        document.getElementById('currentFlow').textContent = this.maxFlow;
        document.getElementById('pathFound').textContent = 
            this.currentPath.length > 0 ? 
            this.currentPath.map(n => this.graph.nodes[n].label).join(" → ") : 
            "None";
    }

    async findAugmentingPath(source, sink) {
        const visited = new Set();
        const parent = new Array(this.graph.nodes.length).fill(-1);
        const queue = [source];
        visited.add(source);

        while (queue.length > 0 && !visited.has(sink)) {
            const u = queue.shift();
            
            for (const edge of this.graph.edges) {
                if (edge.source === u) {
                    const v = edge.target;
                    if (!visited.has(v) && edge.capacity > edge.flow) {
                        visited.add(v);
                        parent[v] = u;
                        queue.push(v);
                        
                        if (v === sink) break;
                    }
                }
            }
        }

        if (!visited.has(sink)) return null;

        // Reconstruct path
        const path = [];
        let current = sink;
        while (current !== source) {
            path.unshift(current);
            current = parent[current];
        }
        path.unshift(source);

        return path;
    }

    async runFordFulkerson() {
        this.isPlaying = true;
        const source = 0;
        const sink = this.graph.nodes.length - 1;

        while (this.isPlaying) {
            const path = await this.findAugmentingPath(source, sink);
            if (!path) break;

            this.currentPath = path;
            
            // Find minimum residual capacity along path
            let minCapacity = Infinity;
            for (let i = 0; i < path.length - 1; i++) {
                const edge = this.graph.edges.find(e => 
                    e.source === path[i] && e.target === path[i + 1]
                );
                minCapacity = Math.min(minCapacity, edge.capacity - edge.flow);
            }

            // Update flows
            for (let i = 0; i < path.length - 1; i++) {
                const edge = this.graph.edges.find(e => 
                    e.source === path[i] && e.target === path[i + 1]
                );
                edge.flow += minCapacity;
            }

            this.maxFlow += minCapacity;
            this.updateVisualization();
            this.updateStatus();
            
            await this.sleep(this.animationSpeed);
        }
    }

    updateVisualization() {
        // Update edge colors and labels
        this.edgePaths
            .attr("stroke", d => 
                this.currentPath.includes(d.source) && 
                this.currentPath.includes(d.target) ? 
                "#e74c3c" : "#999"
            );

        this.edgeLabels
            .text(d => `${d.flow}/${d.capacity}`);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize visualization when document is ready
document.addEventListener('DOMContentLoaded', () => {
    const visualizer = new FordFulkersonVisualizer('fordFulkersonVisualization');
    
    document.getElementById('startVisualization').addEventListener('click', async () => {
        visualizer.isPlaying = true;
        await visualizer.runFordFulkerson();
    });
    
    document.getElementById('resetVisualization').addEventListener('click', () => {
        visualizer.isPlaying = false;
        visualizer.initVisualization();
        document.getElementById('currentStep').textContent = 'Click Start to begin';
    });
    
    document.getElementById('speedControl').addEventListener('input', (e) => {
        visualizer.animationSpeed = 2000 / e.target.value;
    });
}); 