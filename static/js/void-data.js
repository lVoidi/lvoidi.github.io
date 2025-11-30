const VOID_POSTS = [
    {
        id: "leetcode-reverse-number",
        title: "LeetCode #7: Reverse Integer",
        description: "Reversing an integer, huh? Easy.",
        image: "../static/img/void/leetcode.png",
        tags: ["LeetCode", "Programming"],
        readTime: 4,
        date: "2025-01-02",
        author: "Rodrigo Arce",
        category: "programming"
    },
    {
        id: "gpg",
        title: "Using PGP keys to make your files yours",
        description: "In this article, i teach you how to make a PGP key and use it to sign your git commits.",
        image: "../static/img/void/mayuri.jpeg",
        tags: ["Tutorial", "Security"],
        readTime: 5,
        date: "2025-02-03",
        author: "Rodrigo Arce",
        category: "tutorial"
    },
    {
        id: "learning-programming",
        title: "Read this if you want to learn programming",
        description: "A fun guide to learn programming",
        image: "../static/img/void/learning-programming.jpg",
        tags: ["Tutorial", "Programming"],
        readTime: 10,
        date: "2025-02-06",
        author: "Rodrigo Arce",
        category: "tutorial"
    },
    {
        id: "mass-disinformation",
        title: "How mass media is controlling your mind",
        description: "Social media and mass media are designed to keep you engaged and consuming content. Here is how they do it.",
        image: "../static/img/void/disinformation.jpg",
        tags: ["Opinion", "Society"],
        readTime: 15,
        date: "2025-02-07",
        author: "Rodrigo Arce",
        category: "opinion"
    },
    {
        id: "tensorzero",
        title: "TensorZero: an interesting project",
        description: "TensorZero creates a feedback loop for optimizing LLM applications — turning production data into smarter, faster, and cheaper models.",
        image: "../static/img/void/tensorzero.png",
        tags: ["AI", "Tools"],
        readTime: 5,
        date: "2025-02-14",
        author: "Rodrigo Arce",
        category: "tech"
    },
    {
        id: "chatgptimg",
        title: "ChatGPT and image generation",
        description: "In this post, i discuss new ChatGPT image generation features.",
        image: "../static/img/void/chatgptimg.png",
        tags: ["AI", "Opinion"],
        readTime: 5,
        date: "2025-03-27",
        author: "Rodrigo Arce",
        category: "tech"
    },
    {
        id: "brave-browser",
        title: "Brave Browser and why you should make the switch",
        description: "In this post, i discuss why you should make the switch to Brave Browser.",
        image: "../static/img/void/brave-browser.png",
        tags: ["Browser", "Privacy"],
        readTime: 5,
        date: "2025-03-28",
        author: "Rodrigo Arce",
        category: "tech"
    },
    {
        id: "car-dependency",
        title: "Car dependency and it's implications",
        description: "Car dependency is a recurring problem in modern society. In this post, i discuss why this is a huge problem.",
        image: "../static/img/void/car-dependency.png",
        tags: ["Opinion", "Society"],
        readTime: 5,
        date: "2025-04-29",
        author: "Rodrigo Arce",
        category: "opinion"
    },
    {
        id: "get-bored",
        title: "Don't let distractions pollute you. Get bored!",
        description: "In this article, I explore the importance of boredom and how it can lead to creativity and self-discovery.",
        image: "../static/img/void/get-bored.jpg",
        tags: ["Opinion", "Lifestyle"],
        readTime: 5,
        date: "2025-08-14",
        author: "Rodrigo Arce",
        category: "opinion"
    },

    {
        id: "costa_rica_silicon_valley",
        title: "¿Puede Costa Rica convertirse en el Silicon Valley de América Latina?",
        description: "Análisis crítico sobre el potencial tecnológico de Costa Rica y su camino hacia convertirse en un verdadero centro de innovación latinoamericano.",
        image: "../static/img/void/costa_rica_silicon_valley.webp",
        tags: ["Economía Política", "Tecnología", "Hispanoamérica", "Opinión"],
        readTime: 12,
        date: "2025-11-24",
        author: "Rodrigo Arce",
        category: "opinion"
    }
    /*{
        id: "trofim-lysenko",
        title: "A demon-haunted world: Trofim Lysenko",
        description: "Exploring Trofim Lysenko's influence on authoritarian regimes and the dangerous intersection of pseudoscience and political power.",
        image: "../static/img/void/lysenko.avif",
        tags: ["Pseudoscience", "History", "Politics"],
        readTime: 50,
        date: "2025-09-29",
        author: "Rodrigo Arce",
        category: "demon-haunted",
        series: "demon-haunted-world"
    }*/
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
            <article class="card h-100${post.series === 'demon-haunted-world' ? ' demon-haunted' : ''}">
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
