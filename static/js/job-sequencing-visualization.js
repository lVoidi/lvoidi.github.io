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
        this.height = 0;
        this.margin = { top: 40, right: 30, bottom: 50, left: 50 };
        
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
            .attr('height', this.height)
            .style('background', this.colors.background);
            
        // Generate initial random jobs
        this.generateRandomJobs();
    }
    
    updateDimensions() {
        const containerWidth = this.visualizationArea.clientWidth;
        this.width = containerWidth;
        this.height = 500;
        
        if (this.svg) {
            this.svg
                .attr('width', this.width)
                .attr('height', this.height);
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
        this.drawVisualization();
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
        
        const innerWidth = this.width - this.margin.left - this.margin.right;
        const innerHeight = this.height - this.margin.top - this.margin.bottom;
        
        // Create main group
        const g = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        
        // Draw jobs table
        this.drawJobsTable(g, innerWidth, innerHeight);
        
        // Draw time slots
        this.drawTimeSlots(g, innerWidth, innerHeight);
        
        // Draw legend
        this.drawLegend();
    }
    
    drawJobsTable(g, innerWidth, innerHeight) {
        const tableWidth = innerWidth * 0.45;
        const tableHeight = innerHeight * 0.6;
        const headerHeight = 30;
        const rowHeight = (tableHeight - headerHeight) / Math.max(10, this.jobs.length);
        
        // Draw table background
        g.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', tableWidth)
            .attr('height', tableHeight)
            .attr('fill', this.colors.background)
            .attr('stroke', this.colors.text)
            .attr('stroke-width', 1);
        
        // Draw table header
        const headers = ['Job ID', 'Deadline', 'Profit', 'Status'];
        const columnWidth = tableWidth / headers.length;
        
        headers.forEach((header, i) => {
            g.append('rect')
                .attr('x', i * columnWidth)
                .attr('y', 0)
                .attr('width', columnWidth)
                .attr('height', headerHeight)
                .attr('fill', this.colors.slot)
                .attr('stroke', this.colors.text)
                .attr('stroke-width', 1);
                
            g.append('text')
                .attr('x', i * columnWidth + columnWidth / 2)
                .attr('y', headerHeight / 2 + 5)
                .attr('text-anchor', 'middle')
                .attr('fill', this.colors.text)
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
                .attr('x', 0)
                .attr('y', headerHeight + i * rowHeight)
                .attr('width', tableWidth)
                .attr('height', rowHeight)
                .attr('fill', rowColor)
                .attr('opacity', 0.3)
                .attr('stroke', this.colors.text)
                .attr('stroke-width', 0.5);
            
            // Draw cells
            const cellValues = [job.id, job.deadline, job.profit, job.status];
            
            cellValues.forEach((value, j) => {
                g.append('text')
                    .attr('x', j * columnWidth + columnWidth / 2)
                    .attr('y', headerHeight + i * rowHeight + rowHeight / 2 + 5)
                    .attr('text-anchor', 'middle')
                    .attr('fill', this.colors.text)
                    .text(value);
            });
        });
    }
    
    drawTimeSlots(g, innerWidth, innerHeight) {
        if (this.timeSlots.length === 0) return;
        
        const slotWidth = innerWidth * 0.45;
        const slotHeight = innerHeight * 0.6;
        const slotX = innerWidth * 0.55;
        const slotY = 0;
        const headerHeight = 30;
        
        // Draw slots container
        g.append('rect')
            .attr('x', slotX)
            .attr('y', slotY)
            .attr('width', slotWidth)
            .attr('height', slotHeight)
            .attr('fill', this.colors.background)
            .attr('stroke', this.colors.text)
            .attr('stroke-width', 1);
        
        // Draw header
        g.append('rect')
            .attr('x', slotX)
            .attr('y', slotY)
            .attr('width', slotWidth)
            .attr('height', headerHeight)
            .attr('fill', this.colors.slot)
            .attr('stroke', this.colors.text)
            .attr('stroke-width', 1);
            
        g.append('text')
            .attr('x', slotX + slotWidth / 2)
            .attr('y', slotY + headerHeight / 2 + 5)
            .attr('text-anchor', 'middle')
            .attr('fill', this.colors.text)
            .text('Time Slots (Deadline)');
        
        // Draw time slots
        const slotBoxWidth = slotWidth / this.timeSlots.length;
        const slotBoxHeight = slotHeight - headerHeight;
        
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
                .attr('x', slotX + i * slotBoxWidth)
                .attr('y', slotY + headerHeight)
                .attr('width', slotBoxWidth)
                .attr('height', slotBoxHeight)
                .attr('fill', slotColor)
                .attr('opacity', 0.7)
                .attr('stroke', this.colors.text)
                .attr('stroke-width', 1);
            
            // Draw slot number (deadline)
            g.append('text')
                .attr('x', slotX + i * slotBoxWidth + slotBoxWidth / 2)
                .attr('y', slotY + headerHeight + 25)
                .attr('text-anchor', 'middle')
                .attr('fill', this.colors.text)
                .attr('font-size', '12px')
                .text(`Slot ${i + 1}`);
            
            // Draw assigned job (if any)
            if (slot.jobId !== null) {
                // Job ID text
                g.append('text')
                    .attr('x', slotX + i * slotBoxWidth + slotBoxWidth / 2)
                    .attr('y', slotY + headerHeight + slotBoxHeight / 2 - 10)
                    .attr('text-anchor', 'middle')
                    .attr('fill', this.colors.text)
                    .attr('font-size', '14px')
                    .attr('font-weight', 'bold')
                    .text(`Job ${slot.jobId}`);
                
                // Find the job to display its profit
                const job = this.jobs.find(j => j.id === slot.jobId);
                if (job) {
                    g.append('text')
                        .attr('x', slotX + i * slotBoxWidth + slotBoxWidth / 2)
                        .attr('y', slotY + headerHeight + slotBoxHeight / 2 + 15)
                        .attr('text-anchor', 'middle')
                        .attr('fill', this.colors.text)
                        .attr('font-size', '12px')
                        .text(`Profit: ${job.profit}`);
                }
            } else {
                g.append('text')
                    .attr('x', slotX + i * slotBoxWidth + slotBoxWidth / 2)
                    .attr('y', slotY + headerHeight + slotBoxHeight / 2)
                    .attr('text-anchor', 'middle')
                    .attr('fill', this.colors.text)
                    .attr('font-size', '12px')
                    .text('Empty');
            }
        });
    }
    
    drawLegend() {
        const legend = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left}, ${this.height - this.margin.bottom - 120})`);
            
        const legendItems = [
            { label: 'Unprocessed Job', color: this.colors.job },
            { label: 'Current Job', color: this.colors.current },
            { label: 'Scheduled Job', color: this.colors.scheduled },
            { label: 'Rejected Job', color: this.colors.rejected },
            { label: 'Empty Slot', color: this.colors.slot },
            { label: 'Occupied Slot', color: this.colors.occupied }
        ];
        
        const itemsPerRow = 3;
        const itemWidth = Math.min(160, (this.width - this.margin.left - this.margin.right) / itemsPerRow);
        const itemHeight = 30;
        
        legendItems.forEach((item, i) => {
            const row = Math.floor(i / itemsPerRow);
            const col = i % itemsPerRow;
            
            legend.append('rect')
                .attr('x', col * itemWidth)
                .attr('y', row * itemHeight)
                .attr('width', 15)
                .attr('height', 15)
                .attr('fill', item.color);
                
            legend.append('text')
                .attr('x', col * itemWidth + 20)
                .attr('y', row * itemHeight + 12)
                .attr('fill', this.colors.text)
                .attr('font-size', '12px')
                .text(item.label);
        });
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the visualizer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new JobSequencingVisualizer();
}); 