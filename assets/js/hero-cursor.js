// ===========================
// Hero Section Custom Cursor
// ===========================

function initHeroCursor() {
    const heroSection = document.querySelector('.hero-section');
    const videoBackground = document.querySelector('.hero-video-background');
    if (!heroSection || !videoBackground) return;

    // Create main cursor element
    const cursor = document.createElement('div');
    cursor.className = 'hero-cursor';
    videoBackground.appendChild(cursor);

    // Create trail cursors (afterimage effect)
    const trailCount = 5;
    const trails = [];
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.className = 'hero-cursor-trail';
        trail.style.opacity = (1 - (i + 1) / (trailCount + 1)) * 0.6; // Decreasing opacity
        videoBackground.appendChild(trail);
        trails.push({
            element: trail,
            x: 0,
            y: 0,
            delay: (i + 1) * 50 // Delay in ms
        });
    }

    // Store cursor positions for trail effect
    const positions = [];
    let lastTime = Date.now();

    // Update cursor position on mousemove - instant, no delay
    heroSection.addEventListener('mousemove', (e) => {
        const currentTime = Date.now();

        // Update main cursor instantly
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursor.classList.add('active');

        // Store position with timestamp for trail
        positions.push({
            x: e.clientX,
            y: e.clientY,
            time: currentTime
        });

        // Keep only recent positions (last 500ms)
        while (positions.length > 0 && currentTime - positions[0].time > 500) {
            positions.shift();
        }

        // Update trail positions based on delay
        trails.forEach(trail => {
            const targetTime = currentTime - trail.delay;
            // Find closest position in history
            let closestPos = positions[0];
            for (let i = positions.length - 1; i >= 0; i--) {
                if (positions[i].time <= targetTime) {
                    closestPos = positions[i];
                    break;
                }
            }

            if (closestPos) {
                trail.element.style.left = closestPos.x + 'px';
                trail.element.style.top = closestPos.y + 'px';
                trail.element.classList.add('active');
            }
        });
    });

    // Hide cursor and trails when leaving hero section
    heroSection.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        trails.forEach(trail => trail.element.classList.remove('active'));
        positions.length = 0; // Clear position history
    });

    // Re-show cursor and trails when entering hero section
    heroSection.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        trails.forEach(trail => trail.element.classList.add('active'));
    });
}

// Initialize Hero Cursor when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroCursor);
} else {
    initHeroCursor();
}
