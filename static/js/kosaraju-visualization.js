class KosarajuVisualizer {
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
                { id: 0, label: "A" },
                { id: 1, label: "B" },
                { id: 2, label: "C" },
                { id: 3, label: "D" },
                { id: 4, label: "E" },
                { id: 5, label: "F" }
            ],
            edges: [
                { source: 0, target: 1 },
                { source: 1, target: 2 },
                { source: 2, target: 0 },
                { source: 1, target: 3 },
                { source: 3, target: 4 },
                { source: 4, target: 5 },
                { source: 5, target: 3 }
            ]
        };

        this.simulation = null;
        this.stack = [];
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
            .attr("fill", "#3498db")
            .attr("stroke", "#fff")
            .attr("stroke-width", 2);

        this.labels = nodeGroup.append("text")
            .text(d => d.label)
            .attr("text-anchor", "middle")
            .attr("dy", ".3em")
            .attr("fill", "white");
    }

    updateVisualization() {
        const margin = this.nodeRadius + 10;
        this.graph.nodes.forEach(node => {
            node.x = Math.max(margin, Math.min(this.width - margin, node.x));
            node.y = Math.max(margin, Math.min(this.height - margin, node.y));
        });

        this.edges
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        this.nodes
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        this.labels
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    }

    async runKosarajuAlgorithm() {
        if (!this.isPlaying) return;

        // Reset colors
        this.nodes.attr("fill", "#3498db");
        this.edges.attr("stroke", "#999");
        this.stack = [];

        // Step 1: First DFS
        document.getElementById('currentStep').textContent = 'Step 1: First DFS Pass';
        const visited = new Set();
        
        for (const node of this.graph.nodes) {
            if (!visited.has(node.id)) {
                await this.dfs(node.id, visited);
            }
        }

        // Step 2: Transpose Graph
        document.getElementById('currentStep').textContent = 'Step 2: Transposing Graph';
        await this.sleep(this.animationSpeed);
        
        const transposedEdges = this.graph.edges.map(edge => ({
            source: edge.target,
            target: edge.source
        }));

        // Animate edge reversal
        this.edges.transition()
            .duration(this.animationSpeed)
            .attr("marker-end", "url(#arrowhead-reversed)");

        // Step 3: Second DFS
        document.getElementById('currentStep').textContent = 'Step 3: Second DFS Pass';
        visited.clear();
        let sccCount = 0;

        while (this.stack.length > 0 && this.isPlaying) {
            const nodeId = this.stack.pop();
            if (!visited.has(nodeId)) {
                const color = this.sccColors[sccCount % this.sccColors.length];
                await this.dfsSecond(nodeId, visited, color);
                sccCount++;
            }
        }

        document.getElementById('currentStep').textContent = 
            `Found ${sccCount} strongly connected component(s)`;
    }

    async dfs(nodeId, visited) {
        visited.add(nodeId);
        
        // Highlight current node
        this.nodes.filter(d => d.id === nodeId)
            .transition()
            .duration(this.animationSpeed / 2)
            .attr("fill", "#f1c40f");
        
        await this.sleep(this.animationSpeed);

        // Process adjacent nodes
        for (const edge of this.graph.edges) {
            if (edge.source.id === nodeId && !visited.has(edge.target.id)) {
                // Highlight edge
                this.edges.filter(e => e.source.id === edge.source.id && e.target.id === edge.target.id)
                    .transition()
                    .duration(this.animationSpeed / 2)
                    .attr("stroke", "#f1c40f");
                
                await this.dfs(edge.target.id, visited);
            }
        }

        this.stack.push(nodeId);
    }

    async dfsSecond(nodeId, visited, color) {
        visited.add(nodeId);
        
        // Color current node
        this.nodes.filter(d => d.id === nodeId)
            .transition()
            .duration(this.animationSpeed / 2)
            .attr("fill", color);
        
        await this.sleep(this.animationSpeed);

        // Process adjacent nodes
        for (const edge of this.graph.edges) {
            if (edge.target.id === nodeId && !visited.has(edge.source.id)) {
                await this.dfsSecond(edge.source.id, visited, color);
            }
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize visualization when document is ready
document.addEventListener('DOMContentLoaded', () => {
    const visualizer = new KosarajuVisualizer('kosarajuVisualization');
    
    document.getElementById('startVisualization').addEventListener('click', async () => {
        visualizer.isPlaying = true;
        await visualizer.runKosarajuAlgorithm();
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