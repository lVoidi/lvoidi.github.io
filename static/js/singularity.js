document.addEventListener('DOMContentLoaded', () => {
    const articlesContainer = document.getElementById('articles');
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filters .btn');
    let currentFilter = 'all';

    // Generate all cards from data
    function renderCards(posts) {
        articlesContainer.innerHTML = posts
            .map(post => createCardHTML(post))
            .join('');
    }

    // Initial render
    renderCards(BLOG_POSTS);

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredPosts = BLOG_POSTS.filter(post => {
            const matchesSearch = 
                post.title.toLowerCase().includes(searchTerm) || 
                post.description.toLowerCase().includes(searchTerm);
            const matchesFilter = 
                currentFilter === 'all' || 
                post.tags.includes(currentFilter);
            
            return matchesSearch && matchesFilter;
        });
        
        renderCards(filteredPosts);
    });

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.getAttribute('data-filter');
            
            const filteredPosts = currentFilter === 'all' 
                ? BLOG_POSTS 
                : BLOG_POSTS.filter(post => post.tags.includes(currentFilter));
            
            renderCards(filteredPosts);
        });
    });
}); 