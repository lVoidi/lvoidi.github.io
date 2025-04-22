// Karger's Min Cut Algorithm Visualization
document.addEventListener('DOMContentLoaded', function() {
    // Canvas setup
    const canvas = document.getElementById('kargerCanvas');
    const ctx = canvas.getContext('2d');
    
    // Graph state
    let graph = {};
    let originalGraph = {};
    let vertexPositions = {};
    let vertexColors = {};
    let vertexLabels = {};
    let animationSpeed = 3;
    let animationRunning = false;
    let animationQueue = [];
    
    // Make canvas responsive
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = Math.min(400, Math.max(300, window.innerHeight * 0.5));
        
        // Redraw graph if it exists
        if (Object.keys(graph).length > 0) {
            repositionVertices();
            drawGraph();
        }
    }
    
    // Set canvas dimensions initially
    resizeCanvas();
    
    // Add window resize listener
    window.addEventListener('resize', resizeCanvas);
    
    // Stats elements
    const verticesCountElement = document.getElementById('verticesCount');
    const edgesCountElement = document.getElementById('edgesCount');
    const minCutValueElement = document.getElementById('minCutValue');
    const statusMessageElement = document.getElementById('statusMessage');
    
    // Button elements
    const generateGraphBtn = document.getElementById('generateGraphBtn');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const speedControl = document.getElementById('speedControl');
    
    // Event listeners
    generateGraphBtn.addEventListener('click', generateRandomGraph);
    startBtn.addEventListener('click', startAlgorithm);
    resetBtn.addEventListener('click', resetVisualization);
    speedControl.addEventListener('input', updateSpeed);
    
    // Initialize
    generateRandomGraph();
    
    // Function to reposition vertices based on current canvas size
    function repositionVertices() {
        const numVertices = Object.keys(vertexPositions).length;
        if (numVertices === 0) return;
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        // Use a smaller radius on mobile
        const radius = Math.min(canvas.width, canvas.height) * (canvas.width < 500 ? 0.25 : 0.35);
        
        let i = 0;
        for (let v in vertexPositions) {
            const angle = (i / numVertices) * 2 * Math.PI;
            vertexPositions[v] = {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
            i++;
        }
    }
    
    // Function to show status message
    function showStatus(message, isError = false) {
        statusMessageElement.textContent = message;
        statusMessageElement.style.color = isError ? '#e74c3c' : '#2ecc71';
        
        // Clear message after 5 seconds
        setTimeout(() => {
            statusMessageElement.textContent = '';
        }, 5000);
    }
    
    // Function to generate a random graph
    function generateRandomGraph() {
        resetVisualization();
        showStatus("Generating random graph...");
        
        // Generate a random number of vertices (5-8 for mobile, 5-10 for desktop)
        const isMobile = canvas.width < 500;
        const numVertices = Math.floor(Math.random() * (isMobile ? 4 : 6)) + 5;
        
        // Create vertices
        graph = {};
        vertexPositions = {};
        vertexColors = {};
        vertexLabels = {};
        
        for (let i = 0; i < numVertices; i++) {
            graph[i] = [];
            vertexLabels[i] = i.toString();
            
            // Positions will be set by repositionVertices
            vertexPositions[i] = { x: 0, y: 0 };
            
            // Random color
            vertexColors[i] = getRandomColor();
        }
        
        // Position vertices in a circle
        repositionVertices();
        
        // Create edges (with 40-60% probability between any two vertices)
        const edgeProbability = 0.5;
        let totalEdges = 0;
        
        for (let i = 0; i < numVertices; i++) {
            for (let j = i + 1; j < numVertices; j++) {
                if (Math.random() < edgeProbability) {
                    graph[i].push(j);
                    graph[j].push(i);
                    totalEdges++;
                }
            }
        }
        
        // Ensure the graph is connected
        const visited = new Set();
        
        function dfs(node) {
            visited.add(node);
            for (const neighbor of graph[node]) {
                if (!visited.has(neighbor)) {
                    dfs(neighbor);
                }
            }
        }
        
        // Start DFS from vertex 0
        if (numVertices > 0) {
            dfs(0);
        }
        
        // If not all vertices are reachable, add edges to make the graph connected
        if (visited.size < numVertices) {
            const unvisited = [];
            for (let i = 0; i < numVertices; i++) {
                if (!visited.has(i)) {
                    unvisited.push(i);
                }
            }
            
            for (const node of unvisited) {
                // Connect to a random visited node
                const randomVisitedNode = Array.from(visited)[Math.floor(Math.random() * visited.size)];
                graph[node].push(randomVisitedNode);
                graph[randomVisitedNode].push(node);
                
                // Update visited set
                dfs(node);
            }
        }
        
        // Ensure there's at least one edge if the graph is empty
        if (totalEdges === 0 && numVertices >= 2) {
            graph[0].push(1);
            graph[1].push(0);
        }
        
        // Make a deep copy of the original graph
        originalGraph = JSON.parse(JSON.stringify(graph));
        
        // Update stats
        updateStats();
        
        // Draw the graph
        drawGraph();
        
        // Reset min cut value
        minCutValueElement.textContent = '-';
    }
    
    // Function to start the algorithm
    function startAlgorithm() {
        if (animationRunning) return;
        
        animationRunning = true;
        startBtn.disabled = true;
        generateGraphBtn.disabled = true;
        
        showStatus("Running algorithm...");
        
        // Run Karger's algorithm with animation
        runKargersAlgorithm();
    }
    
    // Function to reset the visualization
    function resetVisualization() {
        // Stop any running animation
        animationRunning = false;
        animationQueue = [];
        
        // Reset the graph to its original state if it exists
        if (Object.keys(originalGraph).length > 0) {
            graph = JSON.parse(JSON.stringify(originalGraph));
            
            // Reset vertex labels and colors
            for (let i in originalGraph) {
                vertexLabels[i] = i.toString();
                vertexColors[i] = getRandomColor();
            }
        }
        
        // Enable buttons
        startBtn.disabled = false;
        generateGraphBtn.disabled = false;
        
        // Update stats
        updateStats();
        
        // Redraw the graph
        drawGraph();
        
        // Reset min cut value
        minCutValueElement.textContent = '-';
    }
    
    // Function to update animation speed
    function updateSpeed() {
        animationSpeed = parseInt(speedControl.value);
    }
    
    // Function to update stats
    function updateStats() {
        const vertices = Object.keys(graph).length;
        let edges = 0;
        
        for (let v in graph) {
            edges += graph[v].length;
        }
        
        // Each edge is counted twice (once for each endpoint)
        edges = edges / 2;
        
        verticesCountElement.textContent = vertices;
        edgesCountElement.textContent = edges;
    }
    
    // Function to run Karger's algorithm with animation
    function runKargersAlgorithm() {
        try {
            // Create a working copy of the graph
            const workingGraph = JSON.parse(JSON.stringify(graph));
            const vertexMap = {};
            
            // Check if the graph is valid for min cut
            if (Object.keys(workingGraph).length < 2) {
                minCutValueElement.textContent = "Need at least 2 vertices";
                showStatus("The graph needs at least 2 vertices", true);
                animationRunning = false;
                startBtn.disabled = false;
                generateGraphBtn.disabled = false;
                return;
            }
            
            // Check if there are any edges
            let hasEdges = false;
            for (let v in workingGraph) {
                if (workingGraph[v] && workingGraph[v].length > 0) {
                    hasEdges = true;
                    break;
                }
            }
            
            if (!hasEdges) {
                minCutValueElement.textContent = "No edges in the graph";
                showStatus("The graph has no edges", true);
                animationRunning = false;
                startBtn.disabled = false;
                generateGraphBtn.disabled = false;
                return;
            }
            
            // Initialize vertex map (which original vertices are in each contracted vertex)
            for (let v in workingGraph) {
                vertexMap[v] = [v];
            }
            
            // Queue for animation steps
            animationQueue = [];
            
            // Track if we're making progress
            let iterationsWithoutProgress = 0;
            const maxIterationsWithoutProgress = 10;
            
            // Continue until only 2 vertices remain
            while (Object.keys(workingGraph).length > 2) {
                // Select a random vertex
                const vertices = Object.keys(workingGraph);
                const u = vertices[Math.floor(Math.random() * vertices.length)];
                
                // Skip if no edges or if vertex doesn't exist
                if (!workingGraph[u] || workingGraph[u].length === 0) {
                    iterationsWithoutProgress++;
                    if (iterationsWithoutProgress > maxIterationsWithoutProgress) {
                        minCutValueElement.textContent = "Could not find a minimum cut";
                        showStatus("Could not find a minimum cut", true);
                        animationRunning = false;
                        startBtn.disabled = false;
                        generateGraphBtn.disabled = false;
                        return;
                    }
                    continue;
                }
                
                iterationsWithoutProgress = 0;
                
                // Select a random neighbor
                const v = workingGraph[u][Math.floor(Math.random() * workingGraph[u].length)];
                
                // Skip if neighbor doesn't exist in the graph
                if (!workingGraph[v]) {
                    continue;
                }
                
                // Add animation step for highlighting the edge to be contracted
                animationQueue.push({
                    type: 'highlight-edge',
                    u: u,
                    v: v
                });
                
                // Ensure vertexMap[v] exists before merging
                if (!vertexMap[v]) {
                    vertexMap[v] = [v];
                }
                
                // Merge v into u
                vertexMap[u] = vertexMap[u].concat(vertexMap[v]);
                
                // Add animation step for merging vertices
                animationQueue.push({
                    type: 'merge-vertices',
                    u: u,
                    v: v,
                    vertexMap: JSON.parse(JSON.stringify(vertexMap))
                });
                
                // Redirect edges
                if (Array.isArray(workingGraph[v])) {
                    for (const neighbor of workingGraph[v]) {
                        if (neighbor !== u) { // Avoid self-loops
                            workingGraph[u].push(neighbor);
                            
                            // Replace v with u in neighbor's edge list
                            if (workingGraph[neighbor] && Array.isArray(workingGraph[neighbor])) {
                                workingGraph[neighbor] = workingGraph[neighbor].map(x => x === v ? u : x);
                            }
                        }
                    }
                }
                
                // Remove v
                delete workingGraph[v];
                delete vertexMap[v];
                
                // Remove self-loops
                if (workingGraph[u] && Array.isArray(workingGraph[u])) {
                    workingGraph[u] = workingGraph[u].filter(w => w !== u);
                }
                
                // Add animation step for updating the graph
                animationQueue.push({
                    type: 'update-graph',
                    graph: JSON.parse(JSON.stringify(workingGraph))
                });
            }
            
            // Calculate the min cut value
            const vertices = Object.keys(workingGraph);
            let minCutValue = 0;
            
            if (vertices.length >= 2 && workingGraph[vertices[0]]) {
                minCutValue = workingGraph[vertices[0]].length;
            }
            
            // Add animation step for showing the result
            animationQueue.push({
                type: 'show-result',
                minCutValue: minCutValue,
                vertexMap: vertexMap
            });
            
            // Start the animation
            processAnimationQueue();
        } catch (error) {
            console.error("Algorithm error:", error);
            minCutValueElement.textContent = "Algorithm error";
            showStatus("Algorithm error: " + error.message, true);
            animationRunning = false;
            startBtn.disabled = false;
            generateGraphBtn.disabled = false;
        }
    }
    
    // Function to process the animation queue
    function processAnimationQueue() {
        if (!animationRunning || animationQueue.length === 0) {
            animationRunning = false;
            startBtn.disabled = false;
            generateGraphBtn.disabled = false;
            return;
        }
        
        const step = animationQueue.shift();
        
        switch (step.type) {
            case 'highlight-edge':
                highlightEdge(step.u, step.v);
                break;
            case 'merge-vertices':
                mergeVertices(step.u, step.v, step.vertexMap);
                break;
            case 'update-graph':
                updateGraph(step.graph);
                break;
            case 'show-result':
                showResult(step.minCutValue, step.vertexMap);
                break;
        }
        
        // Schedule the next animation step
        setTimeout(processAnimationQueue, 1000 / animationSpeed);
    }
    
    // Function to highlight an edge
    function highlightEdge(u, v) {
        // Draw the graph
        drawGraph();
        
        // Ensure both vertices exist
        if (!vertexPositions[u] || !vertexPositions[v]) return;
        
        // Highlight the edge
        ctx.beginPath();
        ctx.moveTo(vertexPositions[u].x, vertexPositions[u].y);
        ctx.lineTo(vertexPositions[v].x, vertexPositions[v].y);
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Highlight the vertices
        if (u in graph) drawVertex(u, '#FF0000');
        if (v in graph) drawVertex(v, '#FF0000');
    }
    
    // Function to merge vertices
    function mergeVertices(u, v, vertexMap) {
        // Update vertex labels
        if (vertexMap[u]) {
            vertexLabels[u] = vertexMap[u].join(',');
        }
        
        // Update vertex positions (move v to u)
        if (vertexPositions[u] && vertexPositions[v]) {
            vertexPositions[u] = {
                x: (vertexPositions[u].x + vertexPositions[v].x) / 2,
                y: (vertexPositions[u].y + vertexPositions[v].y) / 2
            };
        }
        
        // Draw the graph
        drawGraph();
        
        // Highlight the merged vertex
        if (u in graph) {
            drawVertex(u, '#FF0000');
        }
    }
    
    // Function to update the graph
    function updateGraph(newGraph) {
        graph = newGraph;
        
        // Update stats
        updateStats();
        
        // Draw the graph
        drawGraph();
    }
    
    // Function to show the result
    function showResult(minCutValue, vertexMap) {
        try {
            // Update min cut value
            if (minCutValue === 0) {
                minCutValueElement.textContent = "No minimum cut (graph is disconnected)";
                showStatus("No minimum cut (graph is disconnected)", true);
            } else {
                minCutValueElement.textContent = minCutValue;
                showStatus("Minimum cut found: " + minCutValue);
            }
            
            // Highlight the two partitions with different colors
            const vertices = Object.keys(graph);
            if (vertices.length >= 2) {
                const partition1 = vertexMap[vertices[0]] || [];
                const partition2 = vertexMap[vertices[1]] || [];
                
                if (partition1.length === 0 || partition2.length === 0) {
                    console.warn("Empty partition detected");
                    return;
                }
                
                // Convert partitions to sets of strings for easier comparison
                const partition1Set = new Set(partition1.map(v => String(v)));
                const partition2Set = new Set(partition2.map(v => String(v)));
                
                // Color the original vertices based on their partition
                for (let v in originalGraph) {
                    if (partition1Set.has(String(v))) {
                        vertexColors[v] = '#3498db'; // Blue
                    } else if (partition2Set.has(String(v))) {
                        vertexColors[v] = '#e74c3c'; // Red
                    }
                }
                
                // Draw the original graph with the partition coloring
                graph = JSON.parse(JSON.stringify(originalGraph));
                drawGraph();
                
                // Draw the min cut edges
                let minCutEdgesFound = false;
                ctx.beginPath();
                
                // Check every edge in the original graph
                for (let u in originalGraph) {
                    // Check if u is in partition1
                    const uInPartition1 = partition1Set.has(String(u));
                    
                    if (!uInPartition1 && !partition2Set.has(String(u))) {
                        continue; // Skip vertices that aren't in either partition
                    }
                    
                    // Check all neighbors of u
                    for (let v of originalGraph[u]) {
                        v = String(v); // Ensure v is a string for comparison
                        // If u and v are in different partitions, this is a cut edge
                        const vInPartition1 = partition1Set.has(v);
                        
                        if ((uInPartition1 && !vInPartition1) || (!uInPartition1 && vInPartition1)) {
                            // This is a cut edge - draw it
                            if (vertexPositions[u] && vertexPositions[v]) {
                                minCutEdgesFound = true;
                                ctx.moveTo(vertexPositions[u].x, vertexPositions[u].y);
                                ctx.lineTo(vertexPositions[v].x, vertexPositions[v].y);
                            }
                        }
                    }
                }
                
                if (!minCutEdgesFound) {
                    console.warn("No minimum cut edges found");
                    minCutValueElement.textContent = "No minimum cut edges found";
                    showStatus("No minimum cut edges found", true);
                } else {
                    ctx.strokeStyle = '#FF0000';
                    ctx.lineWidth = 3;
                    ctx.stroke();
                }
            } else {
                minCutValueElement.textContent = "Not enough vertices for a cut";
                showStatus("Not enough vertices for a cut", true);
            }
        } catch (error) {
            console.error("Error showing result:", error);
            minCutValueElement.textContent = "Error showing result";
            showStatus("Error showing result: " + error.message, true);
        }
    }
    
    // Function to draw the graph
    function drawGraph() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw edges
        ctx.beginPath();
        for (let u in graph) {
            for (let v of graph[u]) {
                if (u < v) { // Draw each edge only once
                    ctx.moveTo(vertexPositions[u].x, vertexPositions[u].y);
                    ctx.lineTo(vertexPositions[v].x, vertexPositions[v].y);
                }
            }
        }
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw vertices
        for (let v in graph) {
            drawVertex(v);
        }
    }
    
    // Function to draw a vertex
    function drawVertex(v, borderColor = null) {
        // Skip if vertex position is undefined
        if (!vertexPositions[v]) return;
        
        const x = vertexPositions[v].x;
        const y = vertexPositions[v].y;
        // Adjust radius based on screen size
        const radius = canvas.width < 500 ? 15 : 20;
        
        // Draw the circle
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = vertexColors[v] || getRandomColor();
        ctx.fill();
        
        // Draw the border
        ctx.strokeStyle = borderColor || '#000000';
        ctx.lineWidth = borderColor ? 3 : 1;
        ctx.stroke();
        
        // Draw the label
        ctx.fillStyle = '#FFFFFF';
        // Smaller font on mobile
        ctx.font = canvas.width < 500 ? '10px Arial' : '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Handle long labels on mobile
        let label = vertexLabels[v] || v;
        if (canvas.width < 500 && label.length > 3) {
            const parts = label.split(',');
            if (parts.length > 2) {
                label = parts[0] + ',...';
            }
        }
        
        ctx.fillText(label, x, y);
    }
    
    // Function to generate a random color
    function getRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 70%, 60%)`;
    }
}); 