// Shared escaping helpers for HTML generated from portfolio data.
(function() {
    const ALLOWED_EXTERNAL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

    function escapeHtml(value) {
        const div = document.createElement('div');
        div.textContent = value == null ? '' : String(value);
        return div.innerHTML;
    }

    function safeUrl(value, fallback = '#') {
        if (!value) return fallback;
        try {
            const url = new URL(String(value), window.location.origin);
            if (url.origin === window.location.origin || ALLOWED_EXTERNAL_PROTOCOLS.has(url.protocol)) {
                return url.href;
            }
        } catch (error) {
            return fallback;
        }
        return fallback;
    }

    function escapeAttr(value) {
        return escapeHtml(value);
    }

    window.securityUtils = {
        escapeHtml,
        escapeAttr,
        safeUrl
    };
})();
