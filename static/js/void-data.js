// Define available tags
const AVAILABLE_TAGS = {
    "tutorial": {
        label: 'Tutorial',
        color: 'rgba(147, 51, 234, 0.2)',
        textColor: '#c084fc'
    },
    'yapping': {
        label: 'Yapping',
        color: 'rgba(236, 72, 153, 0.2)',
        textColor: '#f472b6'
    },
    'politics': {
        label: 'Politics',
        color: 'rgba(0, 255, 42, 0.2)',
        textColor: '#00ff2a'
    },

    'leetcode': {
        label: 'Leetcode',
        color: 'rgba(255, 215, 0, 0.2)',
        textColor: '#ffd700'
    },

    'crypto': {
        label: 'Crypto',
        color: 'rgba(82, 146, 243, 0.19)',
        textColor: '#00ffff'
    },
    'ai': {
        label: 'AI',
        color: 'rgba(255, 0, 0, 0.2)',
        textColor: '#ff0000'
    },
    'science': {
        label: 'Science',
        color: 'rgba(0, 0, 255, 0.2)',
        textColor: '#0000ff'
    },
    'music': {
        label: 'Music',
        color: 'rgba(255, 165, 0, 0.2)',
        textColor: '#ffa500'
    },
    'Costa Rica': {
        label: 'Costa Rica',
        color: 'rgba(0, 255, 42, 0.2)',
        textColor: '#00ff2a'
    },
    'Español': {
        label: 'Español',
        color: 'rgba(255, 0, 0, 0.2)',
        textColor: '#ff0000'
    }
};


const VOID_POSTS = [
    {
        id: "leetcode-reverse-number",
        title: "LeetCode #7: Reverse Integer",
        description: "Reversing an integer, huh? Easy.",
        image: "../static/img/void/leetcode.png",
        tags: ["leetcode"],
        readTime: 4,
        date: "2025-01-02",
        author: "Rodrigo Arce"
    },
    {
        id: "gpg",
        title: "Using PGP keys to make your files yours",
        description: "In this article, i teach you how to make a PGP key and use it to sign your git commits.",
        image: "../static/img/void/mayuri.jpeg",
        tags: ["tutorial", "yapping"],
        readTime: 5,
        date: "2025-02-03",
        author: "Rodrigo Arce"
    },
    {
        id: "learning-programming",
        title: "Read this if you want to learn programming",
        description: "A fun guide to learn programming",
        image: "../static/img/void/learning-programming.jpg",
        tags: ["tutorial", "yapping"],
        readTime: 10,
        date: "2025-02-06",
        author: "Rodrigo Arce"
    },
    {
        id: "mass-disinformation",
        title: "How mass media is controlling your mind",
        description: "Social media and mass media are designed to keep you engaged and consuming content. Here is how they do it.",
        image: "../static/img/void/disinformation.jpg",
        tags: ["yapping", "politics"],
        readTime: 15,
        date: "2025-02-07",
        author: "Rodrigo Arce"

    },
    {
        id: "tensorzero",
        title: "TensorZero: an interesting project",
        description: "TensorZero creates a feedback loop for optimizing LLM applications — turning production data into smarter, faster, and cheaper models.",
        image: "../static/img/void/tensorzero.png",
        tags: ["ai"],
        readTime: 5,
        date: "2025-02-14",
        author: "Rodrigo Arce"
    },
    {
        id: "chatgptimg",
        title: "ChatGPT and image generation",
        description: "In this post, i discuss new ChatGPT image generation features.",
        image: "../static/img/void/chatgptimg.png",
        tags: ["ai", "yapping"],
        readTime: 5,
        date: "2025-03-27",
        author: "Rodrigo Arce"
    },
    {
        id: "brave-browser",
        title: "Brave Browser and why you should make the switch",
        description: "In this post, i discuss why you should make the switch to Brave Browser.",
        image: "../static/img/void/brave-browser.png",
        tags: ["yapping"],
        readTime: 5,
        date: "2025-03-28",
        author: "Rodrigo Arce"
    },
    {
        id: "car-dependency",
        title: "Car dependency and it's implications",
        description: "Car dependency is a recurring problem in modern society. In this post, i discuss why this is a huge problem.",
        image: "../static/img/void/car-dependency.png",
        tags: ["yapping", "politics"],
        readTime: 5,
        date: "2025-04-29",
        author: "Rodrigo Arce"
    },
    {
        id: "get-bored",
        title: "Don't let distractions pollute you. Get bored!",
        description: "In this article, I explore the importance of boredom and how it can lead to creativity and self-discovery.",
        image: "../static/img/void/get-bored.jpg",
        tags: ["yapping"],
        readTime: 5,
        date: "2025-08-14",
        author: "Rodrigo Arce"
    }
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
                    <div class="d-flex flex-wrap justify-content-between align-items-start mb-2">
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
