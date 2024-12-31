document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts');
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filters .btn');
    let selectedTags = new Set();

    // Generate filter buttons dynamically
    const filtersContainer = document.querySelector('.filters .btn-group');
    filtersContainer.innerHTML = `
        <button type="button" class="btn btn-outline-primary active" data-filter="all">
            All
        </button>
        ${Object.entries(AVAILABLE_TAGS).map(([id, tag]) => `
            <button type="button" class="btn btn-outline-primary" data-filter="${id}">
                ${tag.label}
            </button>
        `).join('')}
    `;

    function sortPosts(posts) {
        return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    function filterPosts() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredPosts = VOID_POSTS.filter(post => {
            const matchesSearch = 
                post.title.toLowerCase().includes(searchTerm) || 
                post.description.toLowerCase().includes(searchTerm);
            
            const matchesTags = 
                selectedTags.size === 0 || 
                post.tags.some(tag => selectedTags.has(tag));
            
            return matchesSearch && matchesTags;
        });
        
        renderPosts(filteredPosts);
    }

    function renderPosts(posts) {
        const sortedPosts = sortPosts(posts);
        
        if (sortedPosts.length === 0) {
            postsContainer.innerHTML = `
                <div class="col-12 text-center no-results">
                    <p class="lead text-muted">No posts found matching your criteria.</p>
                </div>
            `;
            return;
        }

        postsContainer.innerHTML = sortedPosts
            .map(post => createPostCardHTML(post))
            .join('');

        // Add fade-in animation
        postsContainer.querySelectorAll('.col-md-6').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Initial render
    renderPosts(VOID_POSTS);

    // Search functionality
    searchInput.addEventListener('input', filterPosts);

    // Filter functionality
    document.querySelector('.filters').addEventListener('click', (e) => {
        const button = e.target.closest('.btn');
        if (!button) return;

        const filter = button.getAttribute('data-filter');
        
        if (filter === 'all') {
            selectedTags.clear();
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        } else {
            // Remove 'all' selection
            document.querySelector('[data-filter="all"]').classList.remove('active');
            
            // Toggle tag selection
            button.classList.toggle('active');
            if (button.classList.contains('active')) {
                selectedTags.add(filter);
            } else {
                selectedTags.delete(filter);
            }
            
            // If no tags selected, activate 'all'
            if (selectedTags.size === 0) {
                document.querySelector('[data-filter="all"]').classList.add('active');
            }
        }
        
        filterPosts();
    });
}); 