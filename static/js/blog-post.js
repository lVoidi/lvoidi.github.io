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

    // Reading Progress Bar
    function updateReadingProgress() {
        const article = document.querySelector('.blog-post');
        const progressBar = document.getElementById('readingProgress');
        
        if (!article || !progressBar) return;

        // Get the article's position and dimensions
        const articleRect = article.getBoundingClientRect();
        const articleStart = articleRect.top + window.scrollY;
        const articleHeight = article.offsetHeight;
        
        // Calculate how much of the article is scrollable (total height minus viewport height)
        const scrollableHeight = articleHeight - window.innerHeight;
        
        // Calculate current scroll position relative to the article
        const currentScroll = window.scrollY - articleStart;
        
        // Calculate progress percentage
        let progress = (currentScroll / scrollableHeight) * 100;
        
        // Clamp progress between 0 and 100
        progress = Math.min(100, Math.max(0, progress));
        
        // Update progress bar width
        progressBar.style.width = `${progress}%`;
    }

    // Add scroll event listener
    window.addEventListener('scroll', updateReadingProgress);
    // Initial call to set progress bar on page load
    window.addEventListener('load', updateReadingProgress);

    // Handle window resize
    window.addEventListener('resize', updateReadingProgress);
}); 