class SelectionSortVisualizer {
    constructor(svgId) {
        this.svg = d3.select(`#${svgId}`);
        this.array = [64, 34, 25, 12, 22, 11, 90];
        this.width = this.svg.node().getBoundingClientRect().width;
        this.height = 300;
        this.padding = 50;
        this.animationSpeed = 1000;
        this.isPlaying = false;
        
        this.initVisualization();
    }
    
    initVisualization() {
        this.svg.selectAll("*").remove();
        const barWidth = (this.width - 2 * this.padding) / this.array.length;
        
        const yScale = d3.scaleLinear()
            .domain([0, Math.max(...this.array)])
            .range([0, this.height - 2 * this.padding]);
            
        this.svg.selectAll("rect")
            .data(this.array)
            .enter()
            .append("rect")
            .attr("x", (d, i) => this.padding + i * barWidth)
            .attr("y", d => this.height - this.padding - yScale(d))
            .attr("width", barWidth - 1)
            .attr("height", d => yScale(d))
            .attr("class", "array-element");
            
        this.svg.selectAll("text")
            .data(this.array)
            .enter()
            .append("text")
            .text(d => d)
            .attr("x", (d, i) => this.padding + i * barWidth + barWidth/2)
            .attr("y", this.height - this.padding/2)
            .attr("class", "array-label")
            .attr("text-anchor", "middle");
    }
    
    async selectionSort() {
        const n = this.array.length;
        
        for (let i = 0; i < n - 1 && this.isPlaying; i++) {
            let minIdx = i;
            
            // Highlight current position
            this.highlightElements([i], 'current');
            document.getElementById('currentStep').textContent = 
                `Finding minimum element starting from position ${i}`;
            await this.sleep(this.animationSpeed);
            
            // Find minimum element
            for (let j = i + 1; j < n && this.isPlaying; j++) {
                // Highlight element being compared
                this.highlightElements([minIdx, j], 'comparing');
                await this.sleep(this.animationSpeed/2);
                
                if (this.array[j] < this.array[minIdx]) {
                    // Update minimum index
                    this.highlightElements([j], 'minimum');
                    minIdx = j;
                    await this.sleep(this.animationSpeed/2);
                }
            }
            
            if (minIdx !== i) {
                // Swap elements
                document.getElementById('currentStep').textContent = 
                    `Swapping ${this.array[i]} with ${this.array[minIdx]}`;
                    
                [this.array[i], this.array[minIdx]] = [this.array[minIdx], this.array[i]];
                await this.updateElements([i, minIdx]);
            }
            
            // Show sorted portion
            this.highlightRange(0, i, 'sorted');
            await this.sleep(this.animationSpeed);
        }
        
        if (this.isPlaying) {
            // Final array is sorted
            this.highlightRange(0, this.array.length - 1, 'sorted');
            document.getElementById('currentStep').textContent = 'Array sorted!';
        }
    }
    
    highlightElements(indices, className) {
        this.svg.selectAll("rect")
            .attr("class", (d, i) => indices.includes(i) ? `array-element ${className}` : "array-element");
    }
    
    highlightRange(start, end, className) {
        this.svg.selectAll("rect")
            .attr("class", (d, i) => i >= start && i <= end ? `array-element ${className}` : "array-element");
    }
    
    async updateElements(indices) {
        const barWidth = (this.width - 2 * this.padding) / this.array.length;
        const yScale = d3.scaleLinear()
            .domain([0, Math.max(...this.array)])
            .range([0, this.height - 2 * this.padding]);
            
        // Update rectangles
        this.svg.selectAll("rect")
            .data(this.array)
            .transition()
            .duration(this.animationSpeed/2)
            .attr("y", d => this.height - this.padding - yScale(d))
            .attr("height", d => yScale(d));
            
        // Update labels
        this.svg.selectAll("text")
            .data(this.array)
            .text(d => d);
            
        await this.sleep(this.animationSpeed/2);
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize visualization when document is ready
document.addEventListener('DOMContentLoaded', () => {
    const visualizer = new SelectionSortVisualizer('selectionSortVisualization');
    
    document.getElementById('startVisualization').addEventListener('click', async () => {
        visualizer.isPlaying = true;
        await visualizer.selectionSort();
    });
    
    document.getElementById('resetVisualization').addEventListener('click', () => {
        visualizer.isPlaying = false;
        visualizer.initVisualization();
        document.getElementById('currentStep').textContent = 'Click Start to begin visualization';
    });
    
    document.getElementById('speedControl').addEventListener('input', (e) => {
        visualizer.animationSpeed = 2000 / e.target.value;
    });
}); 