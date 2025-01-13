class KahnVisualizer {
    constructor(svgId) {
        this.svg = d3.select(`#${svgId}`);
        this.width = this.svg.node().getBoundingClientRect().width;
        this.height = 400;
        this.padding = 50;
        this.nodeRadius = 20;
        this.animationSpeed = 1000;
        this.isPlaying = false;

        // Clear and set SVG dimensions with viewBox para mejor escalado
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
                { id: 4, label: "E" }
            ],
            edges: [
                { source: 0, target: 1 },
                { source: 0, target: 2 },
                { source: 1, target: 3 },
                { source: 2, target: 3 },
                { source: 3, target: 4 }
            ]
        };

        this.simulation = null;
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

        // Ajustamos las fuerzas de la simulación
        this.simulation = d3.forceSimulation(this.graph.nodes)
            .force("link", d3.forceLink(this.graph.edges)
                .id(d => d.id)
                .distance(80)) // Reducida la distancia entre nodos
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(this.width / 2, this.height / 2))
            .force("x", d3.forceX(this.width / 2).strength(0.1))
            .force("y", d3.forceY(this.height / 2).strength(0.1))
            .force("collision", d3.forceCollide().radius(this.nodeRadius * 1.5))
            .on("tick", () => this.updateVisualization());

        this.drawGraph();
    }

    drawGraph() {
        // Crear un contenedor para el grafo
        const container = this.svg.append("g")
            .attr("transform", `translate(${this.padding}, ${this.padding})`);

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
        // Limitar las posiciones para mantener los nodos dentro del SVG
        // con un margen adicional para evitar cortes
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
    }

    async runKahnAlgorithm() {
        if (!this.isPlaying) return;

        // Calculate in-degrees
        const inDegree = new Array(this.graph.nodes.length).fill(0);
        this.graph.edges.forEach(edge => {
            inDegree[edge.target.id]++;
        });

        // Find nodes with in-degree 0
        const queue = [];
        inDegree.forEach((deg, index) => {
            if (deg === 0) queue.push(index);
        });

        const result = [];
        const visited = new Set();

        while (queue.length > 0 && this.isPlaying) {
            const node = queue.shift();
            result.push(node);
            visited.add(node);

            // Highlight current node
            this.nodes.filter(d => d.id === node)
                .transition()
                .duration(this.animationSpeed / 2)
                .attr("fill", "#2ecc71");

            // Update status
            document.getElementById('currentStep').textContent = 
                `Processing node ${this.graph.nodes[node].label}`;

            // Process adjacent nodes
            this.graph.edges.forEach(edge => {
                if (edge.source.id === node) {
                    inDegree[edge.target.id]--;
                    if (inDegree[edge.target.id] === 0) {
                        queue.push(edge.target.id);
                    }
                }
            });

            await this.sleep(this.animationSpeed);
        }

        if (result.length !== this.graph.nodes.length) {
            document.getElementById('currentStep').textContent = 
                'Graph contains a cycle!';
        } else {
            document.getElementById('currentStep').textContent = 
                `Topological Sort: ${result.map(i => this.graph.nodes[i].label).join(' → ')}`;
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize visualization when document is ready
document.addEventListener('DOMContentLoaded', () => {
    const visualizer = new KahnVisualizer('kahnVisualization');
    
    document.getElementById('startVisualization').addEventListener('click', async () => {
        visualizer.isPlaying = true;
        await visualizer.runKahnAlgorithm();
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