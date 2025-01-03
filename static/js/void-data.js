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
    },
    'leetcode': {
        label: 'Leetcode',
        color: 'rgba(255, 215, 0, 0.2)',
        textColor: '#ffd700'
    }
};

const VOID_POSTS = [
    {
        id: "leetcode-reverse-number",
        title: "LeetCode #7: Reverse Integer",
        description: "Reversing an integer, huh? Easy.",
        image: "../static/img/void/leetcode.png",  
        tags: ["leetcode"],
        readTime: 5,
        date: "2025-01-02",
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
                    <a href="pages/${post.id}.html" class="btn btn-primary">Read More</a>
                </div>
            </article>
        </div>
    `;
} 