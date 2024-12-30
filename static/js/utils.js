function isDeviceCompatible() {
    const minWidth = 768;
    const minHeight = 600;
    return window.innerWidth >= minWidth && window.innerHeight >= minHeight;
}

function showCompatibilityMessage(containerId) {
    // Find the visualization container by ID
    const container = document.getElementById(containerId);
    if (!container) return;

    const message = document.createElement('div');
    message.className = 'compatibility-message';
    message.innerHTML = `
        <div class="alert alert-info" role="alert">
            <h4 class="alert-heading">
                <i class="fas fa-mobile-alt"></i> 
                Visualization Not Available
            </h4>
            <p>This visualization requires a minimum screen resolution of 768x600 pixels.</p>
            <hr>
            <p class="mb-0">Your current resolution: ${window.innerWidth}x${window.innerHeight}</p>
            <p class="mb-0">Please use a device with a larger screen to access this feature.</p>
        </div>
    `;
    
    // Clear and show message
    container.innerHTML = '';
    container.appendChild(message);
    
    // Hide controls
    const controls = container.querySelector('.visualization-controls');
    if (controls) {
        controls.style.display = 'none';
    }
}

// Add window resize listener to update message
window.addEventListener('resize', () => {
    const visualizations = [
        'dijkstraVisualization',
        'kruskalVisualization',
        'astarGrid'
    ];
    
    visualizations.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            if (!isDeviceCompatible()) {
                showCompatibilityMessage(id);
            } else {
                // Refresh the page to reinitialize visualization
                window.location.reload();
            }
        }
    });
}); 