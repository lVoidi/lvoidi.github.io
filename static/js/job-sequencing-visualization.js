class JobSequencingVisualizer {
    constructor() {
        this.generateBtn = document.getElementById('generateJobs');
        this.startBtn = document.getElementById('startVisualization');
        this.resetBtn = document.getElementById('resetVisualization');
        this.speedControl = document.getElementById('speedControl');
        this.currentStep = document.getElementById('currentStep');
        this.visualizationArea = document.getElementById('jobSequencingVisualization');
        
        this.jobs = [];
        this.sortedJobs = [];
        this.scheduledJobs = [];
        this.timeSlots = [];
        this.currentJobIndex = 0;
        this.isRunning = false;
        this.animationSpeed = 1000;
        this.svg = null;
        this.width = 0;
        this.margin = { top: 40, right: 30, bottom: 100, left: 30 };
        this.isVerticalLayout = false;
        
        this.colors = {
            background: '#282a36',
            text: '#f8f8f2',
            job: '#6272a4',
            scheduled: '#50fa7b',
            rejected: '#ff5555',
            current: '#ffb86c',
            timeline: '#bd93f9',
            slot: '#44475a',
            occupied: '#ff79c6'
        };
        
        this.setupEventListeners();
        this.initializeVisualization();
    }
    
    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateRandomJobs());
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
        this.svg = d3.select('#jobSequencingVisualization')
            .append('svg')
            .attr('width', this.width)
            .style('max-width', '100%')
            .style('background', this.colors.background);
            
        // Generate initial random jobs
        this.generateRandomJobs();
    }
    
    updateDimensions() {
        const containerWidth = this.visualizationArea.clientWidth;
        this.width = Math.max(300, containerWidth);
        this.isVerticalLayout = this.width < 768;
        
        // Add/remove class based on layout
        if (this.isVerticalLayout) {
            this.visualizationArea.classList.add('vertical-layout');
        } else {
            this.visualizationArea.classList.remove('vertical-layout');
        }
        
        if (this.svg) {
            this.svg.attr('width', this.width);
        }
    }
    
    generateRandomJobs() {
        // Clear previous jobs
        this.jobs = [];
        
        // Generate 8-12 random jobs
        const numJobs = Math.floor(Math.random() * 5) + 8;
        const maxDeadline = 8;
        const maxProfit = 100;
        
        for (let i = 1; i <= numJobs; i++) {
            const deadline = Math.floor(Math.random() * maxDeadline) + 1;
            const profit = Math.floor(Math.random() * maxProfit) + 10;
            
            this.jobs.push({
                id: i,
                deadline: deadline,
                profit: profit,
                status: 'unprocessed' // unprocessed, scheduled, rejected, current
            });
        }
        
        this.reset();
        this.currentStep.textContent = `Generated ${numJobs} random jobs. Click Start to begin.`;
    }
    
    reset() {
        // Reset all jobs to unprocessed
        this.jobs.forEach(job => {
            job.status = 'unprocessed';
        });
        
        // Reset time slots
        const maxDeadline = Math.max(...this.jobs.map(job => job.deadline));
        this.timeSlots = Array(maxDeadline).fill().map((_, i) => ({
            slot: i + 1,
            jobId: null,
            status: 'empty' // empty, occupied, current
        }));
        
        this.sortedJobs = [];
        this.scheduledJobs = [];
        this.currentJobIndex = 0;
        this.isRunning = false;
        this.startBtn.disabled = false;
        
        // Update dimensions (which also sets the layout class) before drawing
        this.updateDimensions();
        this.drawVisualization();
        this.currentStep.textContent = 'Click Start to begin visualization';
    }
    
    async start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startBtn.disabled = true;
        
        // Reset all jobs to unprocessed
        this.jobs.forEach(job => {
            job.status = 'unprocessed';
        });
        
        // Reset time slots
        const maxDeadline = Math.max(...this.jobs.map(job => job.deadline));
        this.timeSlots = Array(maxDeadline).fill().map((_, i) => ({
            slot: i + 1,
            jobId: null,
            status: 'empty'
        }));
        
        this.scheduledJobs = [];
        this.drawVisualization();
        
        // Step 1: Sort jobs by profit (decreasing order)
        this.currentStep.textContent = 'Step 1: Sorting jobs by profit (decreasing order)';
        await this.sleep(this.animationSpeed);
        
        this.sortedJobs = [...this.jobs].sort((a, b) => b.profit - a.profit);
        this.drawVisualization();
        await this.sleep(this.animationSpeed);
        
        // Step 2: Process each job in sorted order
        let totalProfit = 0;
        
        for (let i = 0; i < this.sortedJobs.length; i++) {
            const currentJob = this.sortedJobs[i];
            currentJob.status = 'current';
            this.drawVisualization();
            
            this.currentStep.textContent = `Step 2.${i+1}: Processing job ${currentJob.id} with profit ${currentJob.profit} and deadline ${currentJob.deadline}`;
            await this.sleep(this.animationSpeed);
            
            // Find the latest available slot before deadline
            let slotFound = false;
            for (let j = Math.min(maxDeadline, currentJob.deadline) - 1; j >= 0; j--) {
                if (this.timeSlots[j].jobId === null) {
                    // Highlight the slot being considered
                    this.timeSlots[j].status = 'current';
                    this.drawVisualization();
                    await this.sleep(this.animationSpeed / 2);
                    
                    // Schedule the job in this slot
                    this.timeSlots[j].jobId = currentJob.id;
                    this.timeSlots[j].status = 'occupied';
                    currentJob.status = 'scheduled';
                    this.scheduledJobs.push(currentJob);
                    totalProfit += currentJob.profit;
                    
                    this.currentStep.textContent = `Found slot ${j+1} for job ${currentJob.id}. Total profit so far: ${totalProfit}`;
                    slotFound = true;
                    break;
                }
            }
            
            if (!slotFound) {
                currentJob.status = 'rejected';
                this.currentStep.textContent = `No available slot found for job ${currentJob.id} before its deadline. Job rejected.`;
            }
            
            this.drawVisualization();
            await this.sleep(this.animationSpeed);
        }
        
        // Final step
        const scheduledIds = this.scheduledJobs.map(job => job.id).join(', ');
        this.currentStep.textContent = `Completed! Scheduled ${this.scheduledJobs.length} jobs: [${scheduledIds}]. Total profit: ${totalProfit}`;
        this.isRunning = false;
        this.startBtn.disabled = false;
    }
    
    drawVisualization() {
        // Clear previous visualization
        this.svg.selectAll('*').remove();
        
        // Calculate innerWidth based on current width
        const innerWidth = this.width - this.margin.left - this.margin.right;

        // Define heights conceptually, actual SVG height will adapt
        const defaultRowHeight = 25; // Example base row height
        const headerHeight = 30;
        const tableContentHeight = headerHeight + Math.max(10, this.jobs.length) * defaultRowHeight;
        const slotContentHeight = 150; // Approximate height for slots section
        const legendContentHeight = 80; // Approximate height for legend
        const verticalGap = 30; // Fixed gap

        // Calculate required heights based on content and layout
        let tableHeight, slotHeight, legendY;
        let totalHeightEstimate;
        
        const g = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        if (this.isVerticalLayout) {
            // Estimate total height needed for vertical layout
            tableHeight = tableContentHeight;
            slotHeight = slotContentHeight;
            legendY = tableHeight + verticalGap + slotHeight + verticalGap; // Position legend below slots
            totalHeightEstimate = this.margin.top + legendY + legendContentHeight + this.margin.bottom; 
            
            const panelWidth = innerWidth;
            this.drawJobsTable(g, 0, 0, panelWidth, tableHeight);
            this.drawTimeSlots(g, 0, tableHeight + verticalGap, panelWidth, slotHeight);
            this.drawLegend(g, 0, legendY, innerWidth); 
        } else {
            // Estimate total height needed for horizontal layout
            tableHeight = tableContentHeight;
            slotHeight = slotContentHeight;
            legendY = Math.max(tableHeight, slotHeight) + verticalGap; // Position below taller panel
            totalHeightEstimate = this.margin.top + legendY + legendContentHeight + this.margin.bottom;

            const panelWidth = innerWidth * 0.48;
            const horizontalGap = innerWidth * 0.04;
            this.drawJobsTable(g, 0, 0, panelWidth, tableHeight);
            this.drawTimeSlots(g, panelWidth + horizontalGap, 0, panelWidth, slotHeight);
             this.drawLegend(g, 0, legendY, innerWidth);
        }
        
        // Set viewBox based on calculated dimensions
        // This allows internal elements to position correctly while SVG scales
        this.svg.attr('viewBox', `0 0 ${this.width} ${totalHeightEstimate}`);
        this.svg.style('height', null); // Let CSS or browser determine final rendered height based on aspect ratio
    }
    
    drawJobsTable(g, x, y, width, height) {
        const headerHeight = 30;
        const rowHeight = Math.max(15, (height - headerHeight) / Math.max(10, this.jobs.length));
        const fontSize = Math.max(8, Math.min(12, rowHeight * 0.5));
        
        // Draw table background
        g.append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', width)
            .attr('height', height)
            .attr('fill', this.colors.background)
            .attr('stroke', this.colors.text)
            .attr('stroke-width', 1);
        
        // Draw table header
        const headers = ['Job ID', 'Deadline', 'Profit', 'Status'];
        const columnWidth = width / headers.length;
        
        headers.forEach((header, i) => {
            g.append('rect')
                .attr('x', x + i * columnWidth)
                .attr('y', y)
                .attr('width', columnWidth)
                .attr('height', headerHeight)
                .attr('fill', this.colors.slot)
                .attr('stroke', this.colors.text)
                .attr('stroke-width', 1);
                
            g.append('text')
                .attr('x', x + i * columnWidth + columnWidth / 2)
                .attr('y', y + headerHeight / 2 + 5)
                .attr('text-anchor', 'middle')
                .attr('fill', this.colors.text)
                .attr('font-size', `${fontSize + 1}px`)
                .text(header);
        });
        
        // Draw table rows
        const jobsToDisplay = this.sortedJobs.length > 0 ? this.sortedJobs : this.jobs;
        
        jobsToDisplay.forEach((job, i) => {
            // Determine row color based on status
            let rowColor;
            switch (job.status) {
                case 'scheduled': rowColor = this.colors.scheduled; break;
                case 'rejected': rowColor = this.colors.rejected; break;
                case 'current': rowColor = this.colors.current; break;
                default: rowColor = this.colors.job;
            }
            
            // Draw row background
            g.append('rect')
                .attr('x', x)
                .attr('y', y + headerHeight + i * rowHeight)
                .attr('width', width)
                .attr('height', rowHeight)
                .attr('fill', rowColor)
                .attr('opacity', 0.3)
                .attr('stroke', this.colors.text)
                .attr('stroke-width', 0.5);
            
            // Draw cells
            const cellValues = [job.id, job.deadline, job.profit, job.status];
            
            cellValues.forEach((value, j) => {
                g.append('text')
                    .attr('x', x + j * columnWidth + columnWidth / 2)
                    .attr('y', y + headerHeight + i * rowHeight + rowHeight / 2 + 5)
                    .attr('text-anchor', 'middle')
                    .attr('fill', this.colors.text)
                    .attr('font-size', `${fontSize}px`)
                    .text(value);
            });
        });
    }
    
    drawTimeSlots(g, x, y, width, height) {
        if (this.timeSlots.length === 0) return;
        
        const headerHeight = 30;
        const slotBoxHeight = height - headerHeight;
        const slotBoxWidth = width / this.timeSlots.length;
        const fontSize = Math.max(8, Math.min(12, slotBoxWidth * 0.15));

        // Draw slots container
        g.append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', width)
            .attr('height', height)
            .attr('fill', this.colors.background)
            .attr('stroke', this.colors.text)
            .attr('stroke-width', 1);
        
        // Draw header
        g.append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', width)
            .attr('height', headerHeight)
            .attr('fill', this.colors.slot)
            .attr('stroke', this.colors.text)
            .attr('stroke-width', 1);
            
        g.append('text')
            .attr('x', x + width / 2)
            .attr('y', y + headerHeight / 2 + 5)
            .attr('text-anchor', 'middle')
            .attr('fill', this.colors.text)
            .attr('font-size', `${fontSize + 1}px`)
            .text('Time Slots (Deadline)');
        
        // Draw time slots
        this.timeSlots.forEach((slot, i) => {
            // Determine slot color based on status
            let slotColor;
            switch (slot.status) {
                case 'occupied': slotColor = this.colors.occupied; break;
                case 'current': slotColor = this.colors.current; break;
                default: slotColor = this.colors.slot;
            }
            
            // Draw slot box
            g.append('rect')
                .attr('x', x + i * slotBoxWidth)
                .attr('y', y + headerHeight)
                .attr('width', slotBoxWidth)
                .attr('height', slotBoxHeight)
                .attr('fill', slotColor)
                .attr('opacity', 0.7)
                .attr('stroke', this.colors.text)
                .attr('stroke-width', 1);
            
            // Draw slot number (deadline)
            g.append('text')
                .attr('x', x + i * slotBoxWidth + slotBoxWidth / 2)
                .attr('y', y + headerHeight + 20)
                .attr('text-anchor', 'middle')
                .attr('fill', this.colors.text)
                .attr('font-size', `${fontSize}px`)
                .text(`Slot ${i + 1}`);
            
            // Draw assigned job (if any)
            if (slot.jobId !== null) {
                // Job ID text
                g.append('text')
                    .attr('x', x + i * slotBoxWidth + slotBoxWidth / 2)
                    .attr('y', y + headerHeight + slotBoxHeight / 2)
                    .attr('text-anchor', 'middle')
                    .attr('fill', this.colors.text)
                    .attr('font-size', `${fontSize + 2}px`)
                    .attr('font-weight', 'bold')
                    .text(`Job ${slot.jobId}`);
                
                // Find the job to display its profit
                const job = this.jobs.find(j => j.id === slot.jobId);
                if (job) {
                    g.append('text')
                        .attr('x', x + i * slotBoxWidth + slotBoxWidth / 2)
                        .attr('y', y + headerHeight + slotBoxHeight / 2 + 20)
                        .attr('text-anchor', 'middle')
                        .attr('fill', this.colors.text)
                        .attr('font-size', `${fontSize}px`)
                        .text(`Profit: ${job.profit}`);
                }
            } else {
                g.append('text')
                    .attr('x', x + i * slotBoxWidth + slotBoxWidth / 2)
                    .attr('y', y + headerHeight + slotBoxHeight / 2)
                    .attr('text-anchor', 'middle')
                    .attr('fill', this.colors.text)
                    .attr('font-size', `${fontSize}px`)
                    .text('Empty');
            }
        });
    }
    
    drawLegend(g, x, y, containerWidth) {
        const legendGroup = g.append('g')
             .attr('transform', `translate(${x}, ${y})`);
            
        const legendItems = [
            { label: 'Unprocessed Job', color: this.colors.job },
            { label: 'Current Job', color: this.colors.current },
            { label: 'Scheduled Job', color: this.colors.scheduled },
            { label: 'Rejected Job', color: this.colors.rejected },
            { label: 'Empty Slot', color: this.colors.slot },
            { label: 'Occupied Slot', color: this.colors.occupied }
        ];
        
        const itemsPerRow = this.isVerticalLayout ? 2 : 3;
        const itemWidth = Math.max(120, containerWidth / itemsPerRow);
        const itemHeight = 25;
        const rectSize = 12;
        const fontSize = Math.max(9, Math.min(12, itemWidth * 0.1));
        
        const numRows = Math.ceil(legendItems.length / itemsPerRow);
        const requiredHeight = numRows * itemHeight;

        legendItems.forEach((item, i) => {
            const row = Math.floor(i / itemsPerRow);
            const col = i % itemsPerRow;
            
            legendGroup.append('rect')
                .attr('x', col * itemWidth)
                .attr('y', row * itemHeight)
                .attr('width', rectSize)
                .attr('height', rectSize)
                .attr('fill', item.color);
                
            legendGroup.append('text')
                .attr('x', col * itemWidth + rectSize + 5)
                .attr('y', row * itemHeight + rectSize * 0.8)
                .attr('fill', this.colors.text)
                .attr('font-size', `${fontSize}px`)
                .text(item.label);
        });
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the visualizer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if the container exists before initializing
    if (document.getElementById("jobSequencingVisualization")) {
        new JobSequencingVisualizer();
    }
}); 