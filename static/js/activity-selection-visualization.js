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
        this.height = 0;
        this.margin = { top: 40, right: 30, bottom: 50, left: 50 };
        
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
            .attr('height', this.height)
            .style('background', this.colors.background);
            
        // Generate initial random activities
        this.generateRandomActivities();
    }
    
    updateDimensions() {
        const containerWidth = this.visualizationArea.clientWidth;
        this.width = containerWidth;
        this.height = 400;
        
        if (this.svg) {
            this.svg
                .attr('width', this.width)
                .attr('height', this.height);
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
        const innerHeight = this.height - this.margin.top - this.margin.bottom;
        
        // Find min and max times
        let minTime = 0;
        let maxTime = Math.max(...this.activities.map(a => a.finish), 20);
        
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
        
        // Draw time markers
        for (let t = minTime; t <= maxTime; t += 2) {
            g.append('line')
                .attr('x1', this.timeScale(t))
                .attr('y1', innerHeight / 2 - 5)
                .attr('x2', this.timeScale(t))
                .attr('y2', innerHeight / 2 + 5)
                .attr('stroke', this.colors.timeline);
                
            g.append('text')
                .attr('x', this.timeScale(t))
                .attr('y', innerHeight / 2 + 20)
                .attr('text-anchor', 'middle')
                .attr('fill', this.colors.text)
                .text(t);
        }
        
        // Draw activities
        const activityHeight = 20;
        const maxActivitiesPerRow = Math.floor(innerHeight / (activityHeight * 2));
        
        this.activities.forEach((activity, index) => {
            const row = index % maxActivitiesPerRow;
            const yOffset = row * activityHeight * 2 - (innerHeight / 4);
            
            // Determine color based on status
            let color;
            switch (activity.status) {
                case 'selected': color = this.colors.selected; break;
                case 'rejected': color = this.colors.rejected; break;
                case 'current': color = this.colors.current; break;
                default: color = this.colors.activity;
            }
            
            // Draw activity bar
            g.append('rect')
                .attr('x', this.timeScale(activity.start))
                .attr('y', innerHeight / 2 + yOffset)
                .attr('width', this.timeScale(activity.finish) - this.timeScale(activity.start))
                .attr('height', activityHeight)
                .attr('rx', 3)
                .attr('ry', 3)
                .attr('fill', color)
                .attr('stroke', '#fff')
                .attr('stroke-width', 1);
                
            // Draw activity label
            g.append('text')
                .attr('x', this.timeScale((activity.start + activity.finish) / 2))
                .attr('y', innerHeight / 2 + yOffset + activityHeight / 2 + 5)
                .attr('text-anchor', 'middle')
                .attr('fill', '#000')
                .attr('font-size', '12px')
                .text(activity.id);
        });
        
        // Draw legend
        const legend = this.svg.append('g')
            .attr('transform', `translate(${this.width - 150}, 20)`);
            
        const legendItems = [
            { label: 'Unprocessed', color: this.colors.activity },
            { label: 'Current', color: this.colors.current },
            { label: 'Selected', color: this.colors.selected },
            { label: 'Rejected', color: this.colors.rejected }
        ];
        
        legendItems.forEach((item, i) => {
            legend.append('rect')
                .attr('x', 0)
                .attr('y', i * 20)
                .attr('width', 15)
                .attr('height', 15)
                .attr('fill', item.color);
                
            legend.append('text')
                .attr('x', 20)
                .attr('y', i * 20 + 12)
                .attr('fill', this.colors.text)
                .text(item.label);
        });
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the visualizer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ActivitySelectionVisualizer();
}); 