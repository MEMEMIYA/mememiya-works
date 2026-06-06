// Hero video loading state.
(function() {
    const video = document.getElementById('heroVideo');
    const bg = document.getElementById('heroVideoBg');
    if (!video || !bg) return;

    const done = () => bg.classList.remove('video-loading');
    video.addEventListener('canplay', done, { once: true });
    setTimeout(done, 8000);
})();
