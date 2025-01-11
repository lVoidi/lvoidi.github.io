class BubbleSortVisualizer {
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
    
    async bubbleSort() {
        const n = this.array.length;
        
        for (let i = 0; i < n && this.isPlaying; i++) {
            let swapped = false;
            
            // Show current pass number
            document.getElementById('currentStep').textContent = 
                `Pass ${i + 1}: Moving largest unsorted element to the end`;
            
            for (let j = 0; j < n - i - 1 && this.isPlaying; j++) {
                // Highlight current pair being compared
                this.highlightElements([j, j + 1], 'comparing');
                await this.sleep(this.animationSpeed/2);
                
                if (this.array[j] > this.array[j + 1]) {
                    // Swap elements
                    document.getElementById('currentStep').textContent = 
                        `Swapping ${this.array[j]} and ${this.array[j + 1]}`;
                        
                    [this.array[j], this.array[j + 1]] = [this.array[j + 1], this.array[j]];
                    await this.updateElements([j, j + 1]);
                    swapped = true;
                }
                
                // Remove comparison highlight
                this.highlightElements([], 'comparing');
            }
            
            // Show sorted portion
            this.highlightRange(n - i - 1, n - 1, 'sorted');
            
            if (!swapped) {
                document.getElementById('currentStep').textContent = 
                    'Array is already sorted! Stopping early.';
                break;
            }
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
    const visualizer = new BubbleSortVisualizer('bubbleSortVisualization');
    
    document.getElementById('startVisualization').addEventListener('click', async () => {
        visualizer.isPlaying = true;
        await visualizer.bubbleSort();
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