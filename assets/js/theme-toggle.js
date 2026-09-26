// ===========================
// Theme Toggle (dark / light)
// ===========================
(function () {
    const root = document.documentElement;
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    function apply(isLight) {
        if (isLight) root.setAttribute('data-theme', 'light');
        else root.removeAttribute('data-theme');
        btn.setAttribute('aria-pressed', String(isLight));
        btn.setAttribute('aria-label', isLight ? 'ダークモードに切り替え' : 'ライトモードに切り替え');
    }

    apply(root.getAttribute('data-theme') === 'light');

    btn.addEventListener('click', () => {
        const isLight = root.getAttribute('data-theme') !== 'light';
        apply(isLight);
        try { localStorage.setItem('theme', isLight ? 'light' : 'dark'); } catch (e) { /* ignore */ }
    });
})();
