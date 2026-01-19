// ===========================
// Navigation
// ===========================

// Update active navigation link
function updateActiveNavLink(targetId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === targetId) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
}

// Smooth scroll with navbar offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        // Skip if it's just "#" (empty hash)
        if (targetId === '#' || targetId === '#hero') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const target = document.querySelector(targetId);
        if (target) {
            const navHeight = document.querySelector('.main-nav')?.offsetHeight || 72;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = targetPosition - navHeight - 20; // 20px extra padding

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Update active nav link
            updateActiveNavLink(targetId);
        }
    });
});

// Mobile navigation toggle
const navToggle = document.getElementById('navToggle');
const navLinksContainer = document.getElementById('navLinks');

if (navToggle && navLinksContainer) {
    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navLinksContainer.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinksContainer.contains(e.target)) {
            navLinksContainer.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Intersection Observer for active section highlighting
const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = '#' + entry.target.id;
            updateActiveNavLink(sectionId);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '-100px 0px -50% 0px'
});

// Observe sections with IDs for navigation
document.querySelectorAll('section[id]').forEach(section => {
    navObserver.observe(section);
});

// スクロール位置に基づいてアクティブなセクションを手動で更新
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 150; // ナビゲーションの高さを考慮

    let currentSection = null;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section;
        }
    });

    if (currentSection) {
        updateActiveNavLink('#' + currentSection.id);
    }
}

// スクロール時にアクティブセクションを更新
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveNavOnScroll, 50);
});

// ページ読み込み時に現在のセクションをアクティブに
window.addEventListener('load', updateActiveNavOnScroll);
