// ===========================
// Scroll Effects
// ===========================

// Easing functions
const easing = {
    outCubic: t => 1 - Math.pow(1 - t, 3),
    outExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    inOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
};

// Intersection Observer for sections (fade-in animation)
// スマホ版では無効化
const isMobileDevice = window.innerWidth <= 768;

if (!isMobileDevice) {
    const fadeInObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s, transform 0.8s';
        fadeInObserver.observe(section);
    });
}

// Navigation background on scroll
const nav = document.querySelector('.main-nav');

// Set initial transparent state
if (nav) {
    nav.style.background = 'transparent';
    nav.style.backdropFilter = 'blur(4px)';
    nav.style.boxShadow = 'none';
    nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.02)';
}

// Create scroll to top button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.id = 'scrollTopBtn';
scrollTopBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 20px;">
        <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`;
scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
// contact.htmlでは依頼・相談ボタンがないので、通常の位置（右下）に配置
const isContactPage = window.location.pathname.includes('contact.html');
const isMobile = window.innerWidth <= 768;
const scrollBtnBottom = isContactPage ? (isMobile ? '16px' : '48px') : (isMobile ? '90px' : '130px');
const scrollBtnRight = isMobile ? '8px' : '48px';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: ${scrollBtnBottom};
    right: ${scrollBtnRight};
    width: 48px;
    height: 48px;
    border-radius: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
`;
document.body.appendChild(scrollTopBtn);

// モバイル画面サイズ変更時の対応
window.addEventListener('resize', () => {
    const isMobileNow = window.innerWidth <= 768;
    const isContactPageNow = window.location.pathname.includes('contact.html');
    const newBottom = isContactPageNow ? (isMobileNow ? '16px' : '48px') : (isMobileNow ? '90px' : '130px');
    const newRight = isMobileNow ? '8px' : '48px';
    scrollTopBtn.style.bottom = newBottom;
    scrollTopBtn.style.right = newRight;
});

// Add hover effect
scrollTopBtn.addEventListener('mouseenter', () => {
    scrollTopBtn.style.borderColor = 'rgba(255, 255, 255, 0.6)';
    scrollTopBtn.style.transform = 'translateY(-2px)';
});
scrollTopBtn.addEventListener('mouseleave', () => {
    scrollTopBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    scrollTopBtn.style.transform = 'translateY(0)';
});

// Scroll to top functionality
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    // Nav background
    if (window.pageYOffset > 100) {
        nav.style.background = 'rgba(0, 0, 0, 0.1)';
        nav.style.backdropFilter = 'blur(8px)';
        nav.style.boxShadow = 'none';
        nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.04)';
        nav.classList.add('scrolled');
    } else {
        nav.style.background = 'transparent';
        nav.style.backdropFilter = 'blur(4px)';
        nav.style.boxShadow = 'none';
        nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.02)';
        nav.classList.remove('scrolled');
    }

    // Floating CTA visibility
    const floatingCta = document.querySelector('.floating-cta');
    if (floatingCta) {
        if (window.pageYOffset > 300) {
            floatingCta.style.opacity = '1';
            floatingCta.style.visibility = 'visible';
        } else {
            floatingCta.style.opacity = '0';
            floatingCta.style.visibility = 'hidden';
        }
    }

    // Scroll to top button visibility
    if (window.pageYOffset > 300) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
    }
});
