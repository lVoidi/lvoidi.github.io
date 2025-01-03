const SINGULARITY_POSTS = [
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
    },
    {
        id: "attention-is-all-you-need",
        title: "Attention Is All You Need",
        description: "I review the paper 'Attention Is All You Need' by Vaswani et al. and explain the transformer architecture.",
        image: "../static/img/singularity/attention-is-all-you-need.png",
        tags: ["AI", "Machine Learning", "NLP"],
        readTime: 10,
        date: "2025-01-03",
        author: "Rodrigo Arce",
        category: "AI"
    },
    {
        id: "quantum-teleportation",
        title: "Quantum teleportation coexisting with classical communications in optical fiber",
        description: "A groundbreaking study by researchers at Northwestern University demonstrates quantum teleportation coexisting with classical communications in optical fiber networks.",
        image: "../static/img/singularity/quantum-teleportation.png",
        tags: ["Quantum", "Physics", "Networks"],
        readTime: 15,
        date: "2025-01-03",
        author: "Rodrigo Arce",
        category: "Misc"
    }
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