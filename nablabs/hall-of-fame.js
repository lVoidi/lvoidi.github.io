// Hall of Fame JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Handle project card clicks
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('click', function (e) {
            e.preventDefault();
            const githubUrl = this.getAttribute('data-github');

            if (githubUrl) {
                // Open GitHub link in new tab
                window.open(githubUrl, '_blank', 'noopener,noreferrer');
            }
        });

        // Add keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'link');

        card.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const githubUrl = this.getAttribute('data-github');

                if (githubUrl) {
                    window.open(githubUrl, '_blank', 'noopener,noreferrer');
                }
            }
        });
    });

    // Add smooth scroll animation when coming from index
    const hash = window.location.hash;
    if (hash) {
        setTimeout(() => {
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }

    // Intersection Observer for card animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Initially hide cards for animation
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});
