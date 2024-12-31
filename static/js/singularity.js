document.addEventListener('DOMContentLoaded', () => {
    const articlesContainer = document.getElementById('articles');
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filters .btn');
    let currentFilter = 'all';

    function filterPosts() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredPosts = SINGULARITY_POSTS.filter(post => {
            // Check if post matches current category filter
            const matchesCategory = currentFilter === 'all' || post.category.toLowerCase() === currentFilter;
            
            // Check if post matches search term in title, description, or tags
            const matchesSearch = 
                post.title.toLowerCase().includes(searchTerm) ||
                post.description.toLowerCase().includes(searchTerm) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
            return matchesCategory && matchesSearch;
        });

        renderPosts(filteredPosts);
    }

    function renderPosts(posts) {
        if (posts.length === 0) {
            articlesContainer.innerHTML = `
                <div class="col-12 text-center">
                    <p class="lead text-muted">No posts found matching your search.</p>
                </div>
            `;
            return;
        }

        // Sort posts by date (newest first)
        const sortedPosts = [...posts].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );

        articlesContainer.innerHTML = sortedPosts
            .map(post => createPostCardHTML(post))
            .join('');

        // Add fade-in animation
        articlesContainer.querySelectorAll('.col-md-6').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Initial render
    renderPosts(SINGULARITY_POSTS);

    // Search functionality
    searchInput.addEventListener('input', filterPosts);

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.getAttribute('data-filter');
            filterPosts();
        });
    });
}); 