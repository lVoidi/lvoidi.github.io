const BLOG_POSTS = [
];

// Function to generate HTML for a single card
function createCardHTML(post) {
    const tagHTML = post.tags.map(tag => 
        `<span class="tag tag-${tag}">${tag.toUpperCase()}</span>`
    ).join('');

    return `
        <div class="col-md-6 col-lg-4" data-tags="${post.tags.join(' ')}">
            <article class="card h-100">
                <img src="${post.image}" class="card-img-top" alt="${post.title}">
                <div class="card-body">
                    <div class="tags mb-2">
                        ${tagHTML}
                        <span class="read-time">
                            <i class="fas fa-clock"></i> ${post.readTime} min read
                        </span>
                    </div>
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.description}</p>
                    <a href="articles/${post.id}.html" class="btn btn-primary">Read More</a>
                </div>
            </article>
        </div>
    `;
} 