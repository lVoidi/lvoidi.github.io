document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('readingProgress');
    const content = document.querySelector('.post-content');
    
    // Initialize ClipboardJS
    const clipboard = new ClipboardJS('.copy-button');
    
    // Handle copy button feedback
    clipboard.on('success', (e) => {
        const button = e.trigger;
        button.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-copy"></i>';
        }, 2000);
        e.clearSelection();
    });

    // Update reading progress
    function updateReadingProgress() {
        const contentBox = content.getBoundingClientRect();
        const contentHeight = contentBox.height;
        const scrollPosition = window.scrollY - contentBox.top;
        const progress = (scrollPosition / contentHeight) * 100;
        
        // Clamp progress between 0 and 100
        const clampedProgress = Math.min(100, Math.max(0, progress));
        progressBar.style.width = `${clampedProgress}%`;
    }

    // Handle scroll events
    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateReadingProgress);
    });

    // Handle window resize
    window.addEventListener('resize', updateReadingProgress);

    // Initial progress update
    updateReadingProgress();
}); 