// ===========================
// Table of Contents Navigation
// ===========================

function initTableOfContents() {
    const toc = document.getElementById('tocNav');
    const tocLinks = document.querySelectorAll('.toc-link');

    if (!tocLinks.length || !toc) return;

    // Get all target sections from TOC links
    const targetSections = Array.from(tocLinks).map(link => {
        const sectionId = link.getAttribute('data-section');
        return document.getElementById(sectionId);
    }).filter(section => section !== null);

    if (targetSections.length === 0) return;

    // Check if TOC overlaps with any content elements
    function checkTocOverlap() {
        // Check if this is a page with hero section (index.html)
        const heroSection = document.querySelector('.hero-section');

        // If no hero section (like Contact page), always show TOC
        if (!heroSection) {
            toc.style.opacity = '1';
            toc.style.visibility = 'visible';
            return;
        }

        const tocRect = toc.getBoundingClientRect();
        let isOverlappingHero = false;

        const heroRect = heroSection.getBoundingClientRect();
        isOverlappingHero = !(
            tocRect.right < heroRect.left ||
            tocRect.left > heroRect.right ||
            tocRect.bottom < heroRect.top ||
            tocRect.top > heroRect.bottom
        );

        // Add background when overlapping with hero section
        if (isOverlappingHero) {
            toc.classList.add('toc-over-hero');
        } else {
            toc.classList.remove('toc-over-hero');
        }

        // Get all potential overlapping elements (excluding hero section)
        const contentElements = document.querySelectorAll(
            '.section-title, .featured-work-card, .work-card, .event-item-compact, ' +
            '.profile-image-frame, .link-card, img, video, h1, h2, h3, h4'
        );

        let hasOverlap = false;

        contentElements.forEach(element => {
            if (hasOverlap) return; // Skip if already found overlap

            // Skip if element is inside hero section
            if (element.closest('.hero-section')) {
                return;
            }

            const elemRect = element.getBoundingClientRect();

            // Check if rectangles overlap
            const overlap = !(
                tocRect.right < elemRect.left ||
                tocRect.left > elemRect.right ||
                tocRect.bottom < elemRect.top ||
                tocRect.top > elemRect.bottom
            );

            if (overlap) {
                hasOverlap = true;
            }
        });

        // Hide TOC if overlapping, show if not
        if (hasOverlap) {
            toc.style.opacity = '0';
            toc.style.visibility = 'hidden';
        } else {
            toc.style.opacity = '1';
            toc.style.visibility = 'visible';
        }
    }

    // Update active TOC link on scroll
    function updateActiveTocLink() {
        let current = '';
        const scrollPosition = window.pageYOffset + 150; // Offset for better UX

        // Find the current active section
        for (let i = targetSections.length - 1; i >= 0; i--) {
            const section = targetSections[i];
            const sectionTop = section.offsetTop;

            if (scrollPosition >= sectionTop - 100) {
                current = section.getAttribute('id');
                break;
            }
        }

        // If no section is active yet, activate the first one
        if (!current && targetSections.length > 0) {
            current = targetSections[0].getAttribute('id');
        }

        // Update active state
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });

        // Check for overlaps
        checkTocOverlap();
    }

    // Throttle scroll event
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveTocLink();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Check on resize
    let resizeTicking = false;
    window.addEventListener('resize', () => {
        if (!resizeTicking) {
            window.requestAnimationFrame(() => {
                checkTocOverlap();
                resizeTicking = false;
            });
            resizeTicking = true;
        }
    });

    // Initial check
    updateActiveTocLink();

    // Smooth scroll for TOC links
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                const navHeight = document.querySelector('.main-nav')?.offsetHeight || 72;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - navHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update active state immediately
                tocLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// Initialize TOC when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTableOfContents);
} else {
    initTableOfContents();
}
