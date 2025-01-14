class TarjanVisualizer {
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

        // Sample graph for demonstration
        this.graph = {
            nodes: [
                { id: 0, label: "A", disc: -1, low: -1 },
                { id: 1, label: "B", disc: -1, low: -1 },
                { id: 2, label: "C", disc: -1, low: -1 },
                { id: 3, label: "D", disc: -1, low: -1 },
                { id: 4, label: "E", disc: -1, low: -1 }
            ],
            edges: [
                { source: 1, target: 0 },
                { source: 0, target: 2 },
                { source: 2, target: 1 },
                { source: 0, target: 3 },
                { source: 3, target: 4 }
            ]
        };

        this.simulation = null;
        this.stack = [];
        this.time = 0;
        this.sccColors = [
            "#3498db", "#e74c3c", "#2ecc71", 
            "#f1c40f", "#9b59b6", "#e67e22"
        ];
        
        this.initVisualization();
    }

    initVisualization() {
        this.svg.selectAll("*").remove();
        
        // Create arrow marker
        this.svg.append("defs").append("marker")
            .attr("id", "arrowhead")
            .attr("viewBox", "-0 -5 10 10")
            .attr("refX", 25)
            .attr("refY", 0)
            .attr("orient", "auto")
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("xoverflow", "visible")
            .append("svg:path")
            .attr("d", "M 0,-5 L 10 ,0 L 0,5")
            .attr("fill", "#999")
            .style("stroke", "none");

        // Reset graph state
        this.graph.nodes.forEach(node => {
            node.disc = -1;
            node.low = -1;
        });
        this.stack = [];
        this.time = 0;

        this.simulation = d3.forceSimulation(this.graph.nodes)
            .force("link", d3.forceLink(this.graph.edges)
                .id(d => d.id)
                .distance(80))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(this.width / 2, this.height / 2))
            .force("x", d3.forceX(this.width / 2).strength(0.1))
            .force("y", d3.forceY(this.height / 2).strength(0.1))
            .force("collision", d3.forceCollide().radius(this.nodeRadius * 1.5))
            .on("tick", () => this.updateVisualization());

        this.drawGraph();
        this.updateStatus();
    }

    drawGraph() {
        // Create container for the graph
        const container = this.svg.append("g")
            .attr("transform", `translate(${this.padding},${this.padding})`);

        // Draw edges
        this.edges = container.append("g")
            .selectAll("line")
            .data(this.graph.edges)
            .enter()
            .append("line")
            .attr("stroke", "#999")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#arrowhead)");

        // Draw nodes
        const nodeGroup = container.append("g")
            .selectAll("g")
            .data(this.graph.nodes)
            .enter()
            .append("g");

        this.nodes = nodeGroup.append("circle")
            .attr("r", this.nodeRadius)
            .attr("fill", "#fff")
            .attr("stroke", "#333")
            .attr("stroke-width", 2);

        // Add labels
        this.labels = nodeGroup.append("text")
            .text(d => d.label)
            .attr("text-anchor", "middle")
            .attr("dy", "0.3em")
            .attr("fill", "#000");

        // Add discovery/low-link values
        this.values = nodeGroup.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", this.nodeRadius * 2)
            .attr("fill", "#666")
            .text(d => d.disc === -1 ? "" : `${d.disc}/${d.low}`);
    }

    updateVisualization() {
        // Limit node positions to stay within SVG bounds
        const margin = this.nodeRadius + 10;
        this.graph.nodes.forEach(node => {
            node.x = Math.max(margin, Math.min(this.width - margin, node.x));
            node.y = Math.max(margin, Math.min(this.height - margin, node.y));
        });

        // Update edges
        this.edges
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        // Update nodes
        this.nodes
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        // Update labels
        this.labels
            .attr("x", d => d.x)
            .attr("y", d => d.y);

        // Update values
        this.values
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    }

    updateStatus() {
        document.getElementById('stackStatus').textContent = 
            this.stack.length > 0 ? 
            this.stack.map(n => this.graph.nodes[n].label).join(", ") : 
            "Empty";
    }

    async runTarjanAlgorithm() {
        this.isPlaying = true;
        document.getElementById('currentStep').textContent = "Starting Tarjan's Algorithm";
        document.getElementById('componentsFound').textContent = "0";
        
        const visited = new Set();
        let sccCount = 0;

        for (const node of this.graph.nodes) {
            if (!visited.has(node.id) && this.isPlaying) {
                await this.tarjanDFS(node.id, visited);
                sccCount++;
            }
        }

        if (this.isPlaying) {
            document.getElementById('currentStep').textContent = 
                `Found ${sccCount} strongly connected component(s)`;
        }
    }

    async tarjanDFS(nodeId, visited) {
        const node = this.graph.nodes[nodeId];
        visited.add(nodeId);
        
        // Set discovery and low-link values
        node.disc = node.low = this.time++;
        this.stack.push(nodeId);
        
        // Update visualization
        this.nodes.filter(d => d.id === nodeId)
            .transition()
            .duration(this.animationSpeed / 2)
            .attr("fill", "#f1c40f");
        
        this.values.filter(d => d.id === nodeId)
            .text(`${node.disc}/${node.low}`);
        
        this.updateStatus();
        await this.sleep(this.animationSpeed);

        // Process adjacent nodes
        for (const edge of this.graph.edges) {
            if (edge.source.id === nodeId) {
                const v = edge.target.id;
                
                if (!visited.has(v)) {
                    await this.tarjanDFS(v, visited);
                    node.low = Math.min(node.low, this.graph.nodes[v].low);
                } else if (this.stack.includes(v)) {
                    node.low = Math.min(node.low, this.graph.nodes[v].disc);
                }
                
                this.values.filter(d => d.id === nodeId)
                    .text(`${node.disc}/${node.low}`);
            }
        }

        // Check if node is root of SCC
        if (node.low === node.disc) {
            const color = this.sccColors[
                parseInt(document.getElementById('componentsFound').textContent) % 
                this.sccColors.length
            ];
            
            let w;
            const scc = [];
            do {
                w = this.stack.pop();
                scc.push(w);
                this.nodes.filter(d => d.id === w)
                    .transition()
                    .duration(this.animationSpeed / 2)
                    .attr("fill", color);
            } while (w !== nodeId);
            
            document.getElementById('componentsFound').textContent = 
                parseInt(document.getElementById('componentsFound').textContent) + 1;
            
            this.updateStatus();
            await this.sleep(this.animationSpeed);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize visualization when document is ready
document.addEventListener('DOMContentLoaded', () => {
    const visualizer = new TarjanVisualizer('tarjanVisualization');
    
    document.getElementById('startVisualization').addEventListener('click', async () => {
        visualizer.isPlaying = true;
        await visualizer.runTarjanAlgorithm();
    });
    
    document.getElementById('resetVisualization').addEventListener('click', () => {
        visualizer.isPlaying = false;
        visualizer.initVisualization();
        document.getElementById('currentStep').textContent = 'Click Start to begin';
        document.getElementById('componentsFound').textContent = '0';
    });
    
    document.getElementById('speedControl').addEventListener('input', (e) => {
        visualizer.animationSpeed = 2000 / e.target.value;
    });
}); 