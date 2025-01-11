class InsertionSortVisualizer {
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
    
    async insertionSort() {
        const n = this.array.length;
        
        for (let i = 1; i < n && this.isPlaying; i++) {
            const key = this.array[i];
            let j = i - 1;
            
            // Highlight current element being inserted
            this.highlightElements([i], 'current');
            document.getElementById('currentStep').textContent = 
                `Inserting element ${key} into sorted portion`;
            await this.sleep(this.animationSpeed);
            
            while (j >= 0 && this.array[j] > key && this.isPlaying) {
                // Highlight comparison
                this.highlightElements([j, j+1], 'comparing');
                await this.sleep(this.animationSpeed/2);
                
                // Shift element
                this.array[j + 1] = this.array[j];
                this.updateElement(j + 1, this.array[j + 1]);
                
                j--;
            }
            
            this.array[j + 1] = key;
            this.updateElement(j + 1, key);
            
            // Show sorted portion
            this.highlightRange(0, i, 'sorted');
            await this.sleep(this.animationSpeed);
        }
        
        if (this.isPlaying) {
            // Final array is sorted
            this.highlightRange(0, this.array.length - 1, 'sorted');
        }
    }
    
    // Helper methods (similar to other visualizers)
    highlightElements(indices, className) {
        this.svg.selectAll("rect")
            .attr("class", (d, i) => indices.includes(i) ? `array-element ${className}` : "array-element");
    }
    
    highlightRange(start, end, className) {
        this.svg.selectAll("rect")
            .attr("class", (d, i) => i >= start && i <= end ? `array-element ${className}` : "array-element");
    }
    
    updateElement(index, value) {
        const barWidth = (this.width - 2 * this.padding) / this.array.length;
        const yScale = d3.scaleLinear()
            .domain([0, Math.max(...this.array)])
            .range([0, this.height - 2 * this.padding]);
            
        this.svg.selectAll("rect")
            .filter((d, i) => i === index)
            .transition()
            .duration(this.animationSpeed/2)
            .attr("height", yScale(value))
            .attr("y", this.height - this.padding - yScale(value));
            
        this.svg.selectAll("text")
            .filter((d, i) => i === index)
            .text(value);
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize visualization when document is ready
document.addEventListener('DOMContentLoaded', () => {
    const visualizer = new InsertionSortVisualizer('insertionSortVisualization');
    
    document.getElementById('startVisualization').addEventListener('click', async () => {
        visualizer.isPlaying = true;
        await visualizer.insertionSort();
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