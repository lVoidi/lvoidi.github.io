const SINGULARITY_POSTS = [
    /*
    {
        id: "sui-whitepaper",
        title: "Understanding the Sui Blockchain",
        description: "A deep dive into Sui's novel parallel execution engine and object-centric data model that enables high throughput and low latency transactions.",
        image: "../static/img/singularity/sui.jpg",
        tags: ["Blockchain", "Layer 1", "Move"],
        readTime: 15,
        date: "2025-01-02",
        author: "Rodrigo Arce",
        category: "blockchain"
    },*/
];

// Function to generate HTML for a single card
function createPostCardHTML(post) {
    const tagHTML = post.tags.map(tag => `
        <span class="tag tag-${post.category.toLowerCase()}">${tag}</span>
    `).join('');

    const date = new Date(post.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return `
        <div class="col-md-6 col-lg-4">
            <article class="card h-100">
                <img src="${post.image}" class="card-img-top" alt="${post.title}">
                <div class="card-body">
                    <div class="d-flex flex-wrap justify-content-between align-items-center mb-2">
                        <div class="tags d-flex flex-wrap gap-1 mb-1">
                            ${tagHTML}
                        </div>
                        <span class="read-time ms-auto">
                            <i class="fas fa-clock"></i> ${post.readTime} min
                        </span>
                    </div>
                    <span class="post-date">
                        <i class="fas fa-calendar-alt"></i> ${formattedDate}
                    </span>
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.description}</p>
                    <a href="pages/${post.id}.html" class="btn btn-primary">Read More</a>
                </div>
            </article>
        </div>
    `;
} 