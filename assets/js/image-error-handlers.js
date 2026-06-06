// Declarative image error handling without inline event attributes.
(function() {
    const applyImageErrorAction = (img) => {
        const action = img.dataset.errorAction;
        if (action === 'hide') {
            img.classList.add('image-error-hidden');
        } else if (action === 'transparent') {
            img.classList.add('image-error-transparent');
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('img[data-error-action]').forEach(img => {
            img.addEventListener('error', () => applyImageErrorAction(img));
            if (img.complete && img.naturalWidth === 0) {
                applyImageErrorAction(img);
            }
        });
    });
})();
