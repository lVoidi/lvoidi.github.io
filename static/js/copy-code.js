document.addEventListener('DOMContentLoaded', () => {
    // Initialize clipboard for all copy buttons
    const clipboard = new ClipboardJS('.copy-button');

    // Add success/error handlers
    clipboard.on('success', (e) => {
        const button = e.trigger;
        const originalContent = button.innerHTML;

        // Show success state
        button.innerHTML = '<i class="fas fa-check"></i>';
        
        // Reset button after 2 seconds
        setTimeout(() => {
            button.innerHTML = originalContent;
        }, 2000);

        e.clearSelection();
    });

    clipboard.on('error', (e) => {
        const button = e.trigger;
        const originalContent = button.innerHTML;

        // Show error state
        button.innerHTML = '<i class="fas fa-times"></i>';
        
        // Reset button after 2 seconds
        setTimeout(() => {
            button.innerHTML = originalContent;
        }, 2000);
    });
}); 