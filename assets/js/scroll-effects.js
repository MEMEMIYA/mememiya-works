// ===========================
// Scroll Effects
// ===========================

const isMobileDevice = window.innerWidth <= 768;

if (!isMobileDevice && document.body.dataset.scrollReveal !== 'disabled') {
    const fadeInObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    document.querySelectorAll('section').forEach(section => {
        if (section.id === 'hero') return;
        section.classList.add('scroll-reveal');
        fadeInObserver.observe(section);
    });
}

const nav = document.querySelector('.main-nav');

const scrollTopBtn = document.createElement('button');
scrollTopBtn.id = 'scrollTopBtn';
scrollTopBtn.className = 'scroll-top-button';
scrollTopBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`;
scrollTopBtn.setAttribute('aria-label', 'Scroll to top');

if (window.location.pathname.includes('contact.html')) {
    scrollTopBtn.classList.add('is-contact-page');
}

document.body.appendChild(scrollTopBtn);

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    if (nav) {
        nav.classList.toggle('scrolled', window.pageYOffset > 100);
    }

    const floatingCta = document.querySelector('.floating-cta');
    if (floatingCta) {
        floatingCta.classList.toggle('is-visible', window.pageYOffset > 300);
    }

    scrollTopBtn.classList.toggle('is-visible', window.pageYOffset > 300);
});
