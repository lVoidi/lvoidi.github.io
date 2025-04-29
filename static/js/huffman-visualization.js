class HuffmanNode {
    constructor(char, freq) {
        this.char = char;
        this.freq = freq;
        this.left = null;
        this.right = null;
        this.code = '';
    }
}

class HuffmanVisualizer {
    constructor(svgId) {
        this.svg = d3.select(`#${svgId}`);
        this.width = this.svg.node().getBoundingClientRect().width;
        this.calculateDimensions();
        this.animationSpeed = 1000;
        this.isPlaying = false;
        
        // Calculate separation factor based on screen width
        this.separationFactor = this.calculateSeparationFactor();
        
        // Theme colors
        this.colors = {
            leafNode: "#36bea6",       // Teal for leaf nodes
            internalNode: "#5e72e4",   // Blue for internal nodes
            edgeStroke: "#6b6b85",     // Lighter gray for better visibility
            textColor: "#ffffff",      // White for text
            edgeLabelColor: "#d4d4ff", // Brighter purple for edge labels
            nodeStroke: "#1a1a2e",     // Dark border for nodes
            nodeShadow: "rgba(0,0,0,0.3)" // Shadow for 3D effect
        };
        
        // Make visualization responsive
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Clear and set SVG dimensions
        this.svg.selectAll("*").remove();
        this.svg
            .attr("width", this.width)
            .attr("height", this.height)
            .append("g")
            .attr("transform", `translate(${this.padding},${this.padding})`);
        
        this.text = "hello world";
        this.root = null;
        this.codes = {};
        
        this.initVisualization();
    }
    
    calculateDimensions() {
        // Set height and node radius based on screen size
        if (this.width > 1200) {
            this.height = 500;
            this.nodeRadius = 28;
            this.padding = 50;
        } else if (this.width > 900) {
            this.height = 450;
            this.nodeRadius = 25;
            this.padding = 40;
        } else if (this.width > 600) {
            this.height = 400;
            this.nodeRadius = 22;
            this.padding = 30;
        } else {
            // Small screens need more vertical space but smaller padding
            this.height = 450; // Increase height for mobile
            this.nodeRadius = 15;
            this.padding = 15; // Reduce padding to maximize space
        }
        
        // Update SVG height
        this.svg.attr("height", this.height);
    }
    
    calculateSeparationFactor() {
        // Increase separation based on screen width
        if (this.width > 1200) {
            return 3.5; // Much more separation for very wide screens
        } else if (this.width > 900) {
            return 2.5; // More separation for wide screens
        } else if (this.width > 600) {
            return 1.8; // Medium separation for medium screens
        } else {
            return 1.0; // Minimal separation for mobile screens to fit everything
        }
    }
    
    handleResize() {
        this.width = this.svg.node().getBoundingClientRect().width;
        
        // Recalculate dimensions and separation factor
        this.calculateDimensions();
        this.separationFactor = this.calculateSeparationFactor();
        
        if (this.root) {
            this.visualizeTree();
        }
    }
    
    initVisualization() {
        this.svg.selectAll("*").remove();
        
        // Add input text field
        d3.select("#textInput").on("input", (e) => {
            this.text = e.target.value;
            this.updateFrequencyTable();
        });
        
        this.updateFrequencyTable();
    }
    
    updateFrequencyTable() {
        // Calculate frequencies
        const frequencies = {};
        for (let char of this.text) {
            frequencies[char] = (frequencies[char] || 0) + 1;
        }
        
        // Update frequency table display
        const tableBody = d3.select("#frequencyTable tbody");
        tableBody.selectAll("*").remove();
        
        Object.entries(frequencies).forEach(([char, freq]) => {
            tableBody.append("tr")
                .html(`
                    <td>${char === ' ' ? 'space' : char}</td>
                    <td>${freq}</td>
                    <td id="code-${char.charCodeAt(0)}">-</td>
                `);
        });
    }
    
    async buildHuffmanTree() {
        if (!this.text) return;
        
        // Reset state
        this.root = null;
        this.codes = {};
        this.isPlaying = true;
        
        // Calculate frequencies
        const frequencies = {};
        for (let char of this.text) {
            frequencies[char] = (frequencies[char] || 0) + 1;
        }
        
        // Create priority queue
        let nodes = Object.entries(frequencies).map(
            ([char, freq]) => new HuffmanNode(char, freq)
        );
        
        // Update status
        document.getElementById('currentStep').textContent = 'Building Huffman Tree...';
        
        // Build tree
        while (nodes.length > 1 && this.isPlaying) {
            nodes.sort((a, b) => a.freq - b.freq);
            
            const left = nodes.shift();
            const right = nodes.shift();
            
            const parent = new HuffmanNode(null, left.freq + right.freq);
            parent.left = left;
            parent.right = right;
            
            nodes.push(parent);
            
            this.root = parent;
            await this.visualizeTree();
            await this.sleep(this.animationSpeed);
        }
        
        if (nodes.length === 1) {
            this.root = nodes[0];
            this.generateCodes(this.root, '');
            await this.visualizeTree();
            this.updateCodesTable();
            document.getElementById('currentStep').textContent = 'Huffman Tree Complete!';
        }
    }
    
    generateCodes(node, code) {
        if (node.char) {
            node.code = code;
            this.codes[node.char] = code;
            return;
        }
        
        if (node.left) this.generateCodes(node.left, code + '0');
        if (node.right) this.generateCodes(node.right, code + '1');
    }
    
    updateCodesTable() {
        Object.entries(this.codes).forEach(([char, code]) => {
            const cell = document.getElementById(`code-${char.charCodeAt(0)}`);
            if (cell) cell.textContent = code;
        });
    }
    
    async visualizeTree() {
        this.svg.selectAll("*").remove();
        
        if (!this.root) return;
        
        // Add extra padding for right side nodes
        const effectivePadding = this.padding + this.nodeRadius * 1.5;
        
        // Create tree layout with dynamic separation
        const treeLayout = d3.tree()
            .size([this.width - 2 * effectivePadding, this.height - 2 * this.padding])
            .separation((a, b) => (a.parent == b.parent ? 1 : this.separationFactor));
        
        // Create hierarchy
        const hierarchy = d3.hierarchy(this.root, d => [d.left, d.right].filter(Boolean));
        
        // Generate tree data
        const treeData = treeLayout(hierarchy);
        
        // Create container group
        const g = this.svg.append("g")
            .attr("transform", `translate(${effectivePadding},${this.padding})`);
        
        // Adjust node positions to prevent overflow
        // Find the leftmost and rightmost nodes
        let minX = Infinity;
        let maxX = -Infinity;
        treeData.descendants().forEach(node => {
            minX = Math.min(minX, node.x);
            maxX = Math.max(maxX, node.x);
        });
        
        // Calculate scale to fit everything with margins
        const treeWidth = maxX - minX;
        const availableWidth = this.width - 2 * effectivePadding;
        const horizontalScale = Math.min(0.95, availableWidth / treeWidth); // 5% margin
        
        // Apply scaling to all nodes
        treeData.descendants().forEach(node => {
            // Scale and center horizontally
            const centerShift = (availableWidth - (treeWidth * horizontalScale)) / 2;
            node.x = (node.x - minX) * horizontalScale + centerShift;
        });
        
        // For small screens, modify the tree to be more compact
        if (this.width <= 600) {
            // Calculate the depth of the tree
            const maxDepth = Math.max(...treeData.descendants().map(d => d.depth));
            
            // Adjust vertical spacing based on tree depth
            const verticalSpacing = (this.height - 2 * this.padding) / (maxDepth + 1);
            
            treeData.descendants().forEach(node => {
                // Distribute nodes evenly vertically
                node.y = node.depth * verticalSpacing + this.padding;
            });
        }
        
        // Draw links with curved paths
        g.selectAll("path.link")
            .data(treeData.links())
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", d3.linkVertical()
                .x(d => d.x)
                .y(d => d.y))
            .attr("fill", "none")
            .attr("stroke", this.colors.edgeStroke)
            .attr("stroke-width", 2.5);
        
        // Add drop shadow filter
        const defs = this.svg.append("defs");
        const filter = defs.append("filter")
            .attr("id", "drop-shadow")
            .attr("height", "130%");
        
        filter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 3)
            .attr("result", "blur");
        
        filter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 2)
            .attr("dy", 2)
            .attr("result", "offsetBlur");
        
        const feComponentTransfer = filter.append("feComponentTransfer")
            .attr("in", "offsetBlur")
            .attr("result", "shadow");
            
        feComponentTransfer.append("feFuncA")
            .attr("type", "linear")
            .attr("slope", 0.5);
            
        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in", "shadow");
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");
        
        // Create node groups
        const nodes = g.selectAll("g.node")
            .data(treeData.descendants())
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", d => `translate(${d.x},${d.y})`);
        
        // Add circles for nodes
        nodes.append("circle")
            .attr("r", this.nodeRadius)
            .attr("fill", d => d.data.char ? this.colors.leafNode : this.colors.internalNode)
            .attr("stroke", this.colors.nodeStroke)
            .attr("stroke-width", 2)
            .style("filter", "url(#drop-shadow)");
        
        // Add text labels - smaller for mobile
        nodes.append("text")
            .attr("dy", "0.3em")
            .attr("text-anchor", "middle")
            .attr("fill", this.colors.textColor)
            .attr("font-weight", "bold")
            .attr("font-size", this.width <= 600 ? "12px" : "14px")
            .text(d => d.data.char === ' ' ? 'space' : (d.data.char || d.data.freq));
        
        // Add edge labels (0/1)
        g.selectAll("text.edge-label")
            .data(treeData.links())
            .enter()
            .append("text")
            .attr("class", "edge-label")
            .attr("x", d => (d.source.x + d.target.x) / 2)
            .attr("y", d => (d.source.y + d.target.y) / 2)
            .attr("text-anchor", "middle")
            .attr("dy", -5)
            .attr("fill", this.colors.edgeLabelColor)
            .attr("font-weight", "bold")
            .attr("font-size", this.width <= 600 ? "12px" : "14px")
            .style("text-shadow", "1px 1px 3px rgba(0,0,0,0.7)")
            .text((d, i) => d.target.data.code ? d.target.data.code.slice(-1) : '');
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize visualization when document is ready
document.addEventListener('DOMContentLoaded', () => {
    const visualizer = new HuffmanVisualizer('huffmanVisualization');
    
    document.getElementById('startVisualization').addEventListener('click', async () => {
        visualizer.isPlaying = true;
        await visualizer.buildHuffmanTree();
    });
    
    document.getElementById('resetVisualization').addEventListener('click', () => {
        visualizer.isPlaying = false;
        visualizer.initVisualization();
        document.getElementById('currentStep').textContent = 'Enter text and click Start';
    });
    
    document.getElementById('speedControl').addEventListener('input', (e) => {
        visualizer.animationSpeed = 2000 / e.target.value;
    });
}); 