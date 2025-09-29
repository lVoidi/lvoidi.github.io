// Floating Table of Contents and Back to Top functionality
document.addEventListener('DOMContentLoaded', function () {
    createFloatingTOC();
    createMobileTOC();
    createBackToTopButton();
    handleScrollHighlighting();
});

function createFloatingTOC() {
    // Find all headings (h2, h3, h4) in the article content
    const headings = document.querySelectorAll('.post-content h2, .post-content h3, .post-content h4, article h2, article h3, article h4');

    if (headings.length === 0) return;

    // Create container for hover functionality
    const tocContainer = document.createElement('div');
    tocContainer.className = 'toc-container';

    // Create TOC hover indicator
    const indicator = document.createElement('div');
    indicator.className = 'toc-indicator';
    indicator.textContent = 'CONTENTS';

    // Create floating TOC container
    const tocElement = document.createElement('div');
    tocElement.className = 'floating-toc';

    const tocTitle = document.createElement('h4');
    tocTitle.textContent = 'Contents';
    tocElement.appendChild(tocTitle);

    const tocList = document.createElement('ul');
    let currentLevel = 2;
    let currentList = tocList;
    const listStack = [tocList];

    headings.forEach((heading, index) => {
        // Generate ID if not present
        if (!heading.id) {
            heading.id = heading.textContent
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '') || `heading-${index}`;
        }

        const level = parseInt(heading.tagName.substring(1));

        // Handle nesting
        if (level > currentLevel) {
            // Going deeper
            const nestedList = document.createElement('ul');
            const lastItem = currentList.lastElementChild;
            if (lastItem) {
                lastItem.appendChild(nestedList);
            }
            listStack.push(nestedList);
            currentList = nestedList;
        } else if (level < currentLevel) {
            // Going up
            while (listStack.length > 1 && level < currentLevel) {
                listStack.pop();
                currentLevel--;
            }
            currentList = listStack[listStack.length - 1];
        }

        currentLevel = level;

        // Create TOC item
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.addEventListener('click', function (e) {
            e.preventDefault();
            heading.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });

        listItem.appendChild(link);
        currentList.appendChild(listItem);
    });

    tocElement.appendChild(tocList);

    // Append elements to container
    tocContainer.appendChild(indicator);
    tocContainer.appendChild(tocElement);

    document.body.appendChild(tocContainer);
}

function createMobileTOC() {
    // Find all headings (h2, h3, h4) in the article content
    const headings = document.querySelectorAll('.post-content h2, .post-content h3, .post-content h4, article h2, article h3, article h4');

    if (headings.length === 0) return;

    // Create mobile TOC button
    const mobileTocButton = document.createElement('button');
    mobileTocButton.className = 'mobile-toc-button';
    mobileTocButton.innerHTML = '<i class="fas fa-list"></i>';
    mobileTocButton.setAttribute('aria-label', 'Table of contents');

    // Create mobile TOC modal
    const modal = document.createElement('div');
    modal.className = 'mobile-toc-modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'mobile-toc-content';

    const closeButton = document.createElement('button');
    closeButton.className = 'mobile-toc-close';
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.setAttribute('aria-label', 'Close table of contents');

    const tocTitle = document.createElement('h4');
    tocTitle.textContent = 'Contents';

    const tocList = document.createElement('ul');
    let currentLevel = 2;
    let currentList = tocList;
    const listStack = [tocList];

    headings.forEach((heading, index) => {
        // Generate ID if not present
        if (!heading.id) {
            heading.id = heading.textContent
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '') || `heading-${index}`;
        }

        const level = parseInt(heading.tagName.substring(1));

        // Handle nesting
        if (level > currentLevel) {
            const nestedList = document.createElement('ul');
            const lastItem = currentList.lastElementChild;
            if (lastItem) {
                lastItem.appendChild(nestedList);
            }
            listStack.push(nestedList);
            currentList = nestedList;
        } else if (level < currentLevel) {
            while (listStack.length > 1 && level < currentLevel) {
                listStack.pop();
                currentLevel--;
            }
            currentList = listStack[listStack.length - 1];
        }

        currentLevel = level;

        // Create TOC item
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.addEventListener('click', function (e) {
            e.preventDefault();
            heading.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close modal after navigation
            modal.classList.remove('visible');
            modal.style.display = 'none';
        });

        listItem.appendChild(link);
        currentList.appendChild(listItem);
    });

    // Assemble modal content
    modalContent.appendChild(closeButton);
    modalContent.appendChild(tocTitle);
    modalContent.appendChild(tocList);
    modal.appendChild(modalContent);

    // Event listeners
    mobileTocButton.addEventListener('click', function () {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('visible'), 10);
    });

    closeButton.addEventListener('click', function () {
        modal.classList.remove('visible');
        setTimeout(() => modal.style.display = 'none', 300);
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.classList.remove('visible');
            setTimeout(() => modal.style.display = 'none', 300);
        }
    });

    // Show button on scroll
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            mobileTocButton.classList.add('visible');
        } else {
            mobileTocButton.classList.remove('visible');
        }
    });

    document.body.appendChild(mobileTocButton);
    document.body.appendChild(modal);
}

function createBackToTopButton() {
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopButton.setAttribute('aria-label', 'Back to top');

    backToTopButton.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    document.body.appendChild(backToTopButton);
}

function handleScrollHighlighting() {
    const tocLinks = document.querySelectorAll('.floating-toc a');
    const headings = document.querySelectorAll('.post-content h2, .post-content h3, .post-content h4, article h2, article h3, article h4');

    if (tocLinks.length === 0 || headings.length === 0) return;

    let ticking = false;

    function updateActiveLink() {
        let currentHeading = null;

        // Find the heading that's currently in view
        headings.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            if (rect.top <= 150) { // 150px offset for better UX
                currentHeading = heading;
            }
        });

        // Update active states
        tocLinks.forEach(link => link.classList.remove('active'));

        if (currentHeading) {
            const activeLink = document.querySelector(`.floating-toc a[href="#${currentHeading.id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }

        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateActiveLink);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);
    window.addEventListener('resize', requestTick);

    // Initial call
    updateActiveLink();
}

// Utility function to debounce scroll events
function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}