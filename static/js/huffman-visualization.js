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
        this.height = 500;
        this.padding = 50;
        this.animationSpeed = 1000;
        this.isPlaying = false;
        this.nodeRadius = 25;
        
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
        
        // Create tree layout
        const treeLayout = d3.tree()
            .size([this.width - 2 * this.padding, this.height - 2 * this.padding])
            .separation((a, b) => (a.parent == b.parent ? 1 : 2));
        
        // Create hierarchy
        const hierarchy = d3.hierarchy(this.root, d => [d.left, d.right].filter(Boolean));
        
        // Generate tree data
        const treeData = treeLayout(hierarchy);
        
        // Create container group
        const g = this.svg.append("g")
            .attr("transform", `translate(${this.padding},${this.padding})`);
        
        // Draw links
        g.selectAll("path.link")
            .data(treeData.links())
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", d3.linkVertical()
                .x(d => d.x)
                .y(d => d.y))
            .attr("fill", "none")
            .attr("stroke", "#666")
            .attr("stroke-width", 2);
        
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
            .attr("fill", d => d.data.char ? "#3498db" : "#2ecc71")
            .attr("stroke", "#fff")
            .attr("stroke-width", 2);
        
        // Add text labels
        nodes.append("text")
            .attr("dy", "0.3em")
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .text(d => d.data.char || d.data.freq);
        
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