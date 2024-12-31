// Define available tags
const AVAILABLE_TAGS = {
    'non-tech': {
        label: 'Non-tech',
        color: 'rgba(147, 51, 234, 0.2)',
        textColor: '#c084fc'
    },
    'yapping': {
        label: 'Yapping',
        color: 'rgba(236, 72, 153, 0.2)',
        textColor: '#f472b6'
    }
};

const VOID_POSTS = [
];

// Function to generate HTML for tags
function createTagHTML(tagId) {
    const tag = AVAILABLE_TAGS[tagId];
    return `
        <span class="tag" 
              style="background: ${tag.color}; color: ${tag.textColor}">
            ${tag.label}
        </span>
    `;
}

// Function to generate HTML for a single card
function createPostCardHTML(post) {
    const tagHTML = post.tags.map(tag => createTagHTML(tag)).join('');
    const date = new Date(post.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return `
        <div class="col-md-6 col-lg-4" data-tags="${post.tags.join(' ')}">
            <article class="card h-100">
                <img src="${post.image}" class="card-img-top" alt="${post.title}">
                <div class="card-body">
                    <div class="tags">
                        ${tagHTML}
                        <span class="read-time">
                            <i class="fas fa-clock"></i> ${post.readTime} min read
                        </span>
                    </div>
                    <span class="post-date">
                        <i class="fas fa-calendar-alt"></i> ${formattedDate}
                    </span>
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.description}</p>
                    <a href="posts/${post.id}.html" class="btn btn-primary">Read More</a>
                </div>
            </article>
        </div>
    `;
} 