class ActivitySelectionVisualizer {
    constructor() {
        this.generateBtn = document.getElementById('generateActivities');
        this.startBtn = document.getElementById('startVisualization');
        this.resetBtn = document.getElementById('resetVisualization');
        this.speedControl = document.getElementById('speedControl');
        this.currentStep = document.getElementById('currentStep');
        this.visualizationArea = document.getElementById('activitySelectionVisualization');
        
        this.activities = [];
        this.selectedActivities = [];
        this.currentActivityIndex = 0;
        this.isRunning = false;
        this.animationSpeed = 1000;
        this.timeScale = null;
        this.svg = null;
        this.width = 0;
        this.margin = { top: 40, right: 30, bottom: 80, left: 30 };
        
        this.colors = {
            background: '#282a36',
            text: '#f8f8f2',
            activity: '#6272a4',
            selected: '#50fa7b',
            rejected: '#ff5555',
            current: '#ffb86c',
            timeline: '#bd93f9'
        };
        
        this.setupEventListeners();
        this.initializeVisualization();
    }
    
    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateRandomActivities());
        this.startBtn.addEventListener('click', () => this.start());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.speedControl.addEventListener('input', (e) => {
            this.animationSpeed = 1000 / e.target.value;
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.updateDimensions();
            this.drawVisualization();
        });
    }
    
    initializeVisualization() {
        this.updateDimensions();
        
        // Create SVG
        this.svg = d3.select('#activitySelectionVisualization')
            .append('svg')
            .attr('width', this.width)
            .style('max-width', '100%')
            .style('background', this.colors.background);
            
        // Generate initial random activities
        this.generateRandomActivities();
    }
    
    updateDimensions() {
        const containerWidth = this.visualizationArea.clientWidth;
        this.width = Math.max(300, containerWidth);
        
        // Add/remove class for CSS targeting
        this.visualizationArea.classList.add('dynamic-height');
        
        if (this.svg) {
            this.svg.attr('width', this.width);
        }
    }
    
    generateRandomActivities() {
        // Clear previous activities
        this.activities = [];
        
        // Generate 10-15 random activities
        const numActivities = Math.floor(Math.random() * 6) + 10;
        const maxTime = 20;
        
        for (let i = 0; i < numActivities; i++) {
            const start = Math.floor(Math.random() * (maxTime - 2));
            const duration = Math.floor(Math.random() * 5) + 1;
            const finish = start + duration;
            
            this.activities.push({
                id: i,
                start: start,
                finish: finish,
                status: 'unprocessed' // unprocessed, selected, rejected, current
            });
        }
        
        this.reset();
        this.drawVisualization();
        this.currentStep.textContent = `Generated ${numActivities} random activities. Click Start to begin.`;
    }
    
    reset() {
        // Reset all activities to unprocessed
        this.activities.forEach(activity => {
            activity.status = 'unprocessed';
        });
        
        this.selectedActivities = [];
        this.currentActivityIndex = 0;
        this.isRunning = false;
        this.startBtn.disabled = false;
        
        this.drawVisualization();
        this.currentStep.textContent = 'Click Start to begin visualization';
    }
    
    async start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startBtn.disabled = true;
        
        // Sort activities by finish time
        const sortedActivities = [...this.activities].sort((a, b) => a.finish - b.finish);
        
        // Reset all activities to unprocessed
        this.activities.forEach(activity => {
            activity.status = 'unprocessed';
        });
        
        this.selectedActivities = [];
        this.drawVisualization();
        
        // Step 1: Sort activities by finish time
        this.currentStep.textContent = 'Step 1: Sorting activities by finish time';
        await this.sleep(this.animationSpeed);
        
        // Step 2: Select first activity
        const firstActivity = sortedActivities[0];
        firstActivity.status = 'current';
        this.drawVisualization();
        
        this.currentStep.textContent = `Step 2: Selecting first activity (${firstActivity.id}) with earliest finish time`;
        await this.sleep(this.animationSpeed);
        
        firstActivity.status = 'selected';
        this.selectedActivities.push(firstActivity);
        let lastFinishTime = firstActivity.finish;
        this.drawVisualization();
        
        await this.sleep(this.animationSpeed);
        
        // Step 3: Consider remaining activities
        for (let i = 1; i < sortedActivities.length; i++) {
            const currentActivity = sortedActivities[i];
            currentActivity.status = 'current';
            this.drawVisualization();
            
            this.currentStep.textContent = `Step 3.${i}: Considering activity ${currentActivity.id} (${currentActivity.start}-${currentActivity.finish})`;
            await this.sleep(this.animationSpeed);
            
            if (currentActivity.start >= lastFinishTime) {
                // Compatible activity
                this.currentStep.textContent = `Activity ${currentActivity.id} starts at ${currentActivity.start} which is after last finish time ${lastFinishTime}. Selecting it.`;
                currentActivity.status = 'selected';
                this.selectedActivities.push(currentActivity);
                lastFinishTime = currentActivity.finish;
            } else {
                // Incompatible activity
                this.currentStep.textContent = `Activity ${currentActivity.id} starts at ${currentActivity.start} which is before last finish time ${lastFinishTime}. Rejecting it.`;
                currentActivity.status = 'rejected';
            }
            
            this.drawVisualization();
            await this.sleep(this.animationSpeed);
        }
        
        // Final step
        const selectedIds = this.selectedActivities.map(a => a.id).join(', ');
        this.currentStep.textContent = `Completed! Selected ${this.selectedActivities.length} activities: ${selectedIds}`;
        this.isRunning = false;
        this.startBtn.disabled = false;
    }
    
    drawVisualization() {
        // Clear previous visualization
        this.svg.selectAll('*').remove();
        
        const innerWidth = this.width - this.margin.left - this.margin.right;
        const activityHeight = Math.max(15, Math.min(20, 30)); 
        const activityGap = activityHeight * 0.2;
        const legendEstimateHeight = 60; 
        const topPadding = 20; // Space above first activity row
        const bottomPadding = 20; // Space below last activity row before legend

        // Calculate how many rows needed based on a *nominal* available height (e.g., 300px)
        // This prevents excessive height calculation if activities are sparse
        const nominalActivityAreaHeight = 300;
        const maxActivitiesPerRow = this.activities.length > 0 ? Math.max(1, Math.floor(nominalActivityAreaHeight / (activityHeight + activityGap))) : 1; 
        const numRows = Math.ceil(this.activities.length / maxActivitiesPerRow);
        
        // Calculate actual height needed for activity rows
        const requiredActivityZoneHeight = numRows * (activityHeight + activityGap) + topPadding + bottomPadding;
        
        // Calculate total estimated SVG height
        const totalHeightEstimate = this.margin.top + requiredActivityZoneHeight + legendEstimateHeight + this.margin.bottom;
        const innerHeight = totalHeightEstimate - this.margin.top - this.margin.bottom;

        // Define the actual vertical drawing bounds for activities within the inner height
        const activityAreaTopY = topPadding;
        const activityAreaBottomY = innerHeight - legendEstimateHeight - bottomPadding; 
        const activityAreaHeight = activityAreaBottomY - activityAreaTopY;

        // Find min and max times
        let minTime = 0;
        let maxTime = this.activities.length > 0 ? Math.max(...this.activities.map(a => a.finish), 20) : 20;
        
        // Create time scale
        this.timeScale = d3.scaleLinear()
            .domain([minTime, maxTime])
            .range([0, innerWidth]);
        
        // Create main group
        const g = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        
        // Draw timeline
        g.append('line')
            .attr('x1', 0)
            .attr('y1', innerHeight / 2)
            .attr('x2', innerWidth)
            .attr('y2', innerHeight / 2)
            .attr('stroke', this.colors.timeline)
            .attr('stroke-width', 2);
        
        // Draw time markers - Adjust density based on width
        const timeMarkerDensity = innerWidth < 500 ? 4 : 2; // Show fewer markers on small screens
        const xAxis = d3.axisBottom(this.timeScale)
                        .ticks(Math.floor(innerWidth / (timeMarkerDensity * 40))) // Adjust tick count based on width
                        .tickSize(10);

        g.append("g")
         .attr("transform", `translate(0,${innerHeight / 2})`)
         .call(xAxis)
         .attr("color", this.colors.timeline); // Style axis ticks and text

         // Remove default axis domain line
         g.select(".domain").remove();
         
         // Style tick text
         g.selectAll(".tick text")
           .attr("fill", this.colors.text)
           .attr("dy", "1.5em"); // Move text below the line
        
        // Draw activities within the calculated bounds
        // Recalculate maxActivitiesPerRow based on the *actual* available activity area height
        const actualMaxActivitiesPerRow = Math.max(1, Math.floor(activityAreaHeight / (activityHeight + activityGap)));

        this.activities.forEach((activity, index) => {
            // Stack activities downwards within the activity area
            const row = index % actualMaxActivitiesPerRow;
            // Calculate the top Y position for the current row
            const activityTopY = activityAreaTopY + row * (activityHeight + activityGap);
            // Center Y position for the text
            const activityCenterY = activityTopY + activityHeight / 2;

            // Determine color based on status
            let color;
            switch (activity.status) {
                case 'selected': color = this.colors.selected; break;
                case 'rejected': color = this.colors.rejected; break;
                case 'current': color = this.colors.current; break;
                default: color = this.colors.activity;
            }
            
            // Draw activity bar
            const barWidth = Math.max(2, this.timeScale(activity.finish) - this.timeScale(activity.start)); 
            g.append('rect')
                .attr('x', this.timeScale(activity.start))
                // Use the calculated top Y for the rectangle
                .attr('y', activityTopY) 
                .attr('width', barWidth)
                .attr('height', activityHeight)
                .attr('rx', 3)
                .attr('ry', 3)
                .attr('fill', color)
                .attr('stroke', '#fff')
                .attr('stroke-width', 1);
                
            // Draw activity label (Number)
            g.append('text')
                .attr('x', this.timeScale((activity.start + activity.finish) / 2))
                // Use the calculated center Y for the text
                .attr('y', activityCenterY) 
                .attr('text-anchor', 'middle')
                .attr('fill', '#fff') 
                // Use dominant-baseline for better vertical centering
                .attr('dominant-baseline', 'middle') 
                .attr('font-size', '12px')
                // Ensure text is not selectable
                .style('pointer-events', 'none') 
                .style('user-select', 'none')
                .text(activity.id);
        });
        
        // Draw legend below the activity area - Increase vertical distance
        const legendY = activityAreaBottomY + bottomPadding + 30; // Increased padding to push legend down
        const legend = g.append('g') 
            .attr('transform', `translate(0, ${legendY})`);
            
        const legendItems = [
            { label: 'Unprocessed', color: this.colors.activity },
            { label: 'Current', color: this.colors.current },
            { label: 'Selected', color: this.colors.selected },
            { label: 'Rejected', color: this.colors.rejected }
        ];
        
        const itemsPerRow = innerWidth < 400 ? 2 : 4; // More items per row if space allows
        const itemWidth = Math.max(100, innerWidth / itemsPerRow); 
        const itemHeight = 20;
        const rectSize = 12;
        const fontSize = Math.max(9, Math.min(12, itemWidth * 0.1));
        
        legendItems.forEach((item, i) => {
            const row = Math.floor(i / itemsPerRow);
            const col = i % itemsPerRow;
            
            legend.append('rect')
                .attr('x', col * itemWidth)
                .attr('y', row * itemHeight)
                .attr('width', rectSize)
                .attr('height', rectSize)
                .attr('fill', item.color);
                
            legend.append('text')
                .attr('x', col * itemWidth + rectSize + 5)
                .attr('y', row * itemHeight + rectSize * 0.8)
                .attr('fill', this.colors.text)
                .attr('font-size', `${fontSize}px`)
                .text(item.label);
        });
        
        // Set viewBox based on calculated dimensions
        this.svg.attr('viewBox', `0 0 ${this.width} ${totalHeightEstimate}`);
        this.svg.style('height', null); // Let browser determine height
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the visualizer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if the container exists before initializing
    if (document.getElementById("activitySelectionVisualization")) {
        new ActivitySelectionVisualizer();
    }
}); 