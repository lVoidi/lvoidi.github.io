const SINGULARITY_POSTS = [
    {
        id: "attention-is-all-you-need",
        title: "Understanding Attention Mechanisms in Large Language Models",
        description: "An in-depth look at how attention mechanisms work in modern language models and their impact on performance",
        image: "../static/img/singularity/attention-is-all-you-need.png",
        tags: ["AI", "Machine Learning", "NLP"],
        readTime: 5,
        date: "2024-03-15",
        author: "Rodrigo Arce",
        category: "AI"
    },
    // Add more posts here
];

// Function to generate HTML for a single card
function createPostCardHTML(post) {
    const tagHTML = post.tags.map(tag => `
        <span class="tag">${tag}</span>
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
                    <div class="tags mb-2">
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
                    <a href="pages/${post.id}.html" class="btn btn-primary">Read More</a>
                </div>
            </article>
        </div>
    `;
} 