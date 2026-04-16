// Progressive Image Loader
// 小さい画像を即表示し、バックグラウンドで高品質版に差し替える

/**
 * 元画像パスを small/ フォルダの圧縮版パスに変換する
 * 例: assets/images/thumbnails/Thumbnail_DFF.jpg
 *   → assets/images/thumbnails/small/Thumbnail_DFF.jpg
 */
function toSmallSrc(src) {
    const lastSlash = src.lastIndexOf('/');
    const dir = src.substring(0, lastSlash);
    const filename = src.substring(lastSlash + 1);
    const baseName = filename.substring(0, filename.lastIndexOf('.'));
    return `${dir}/small/${baseName}.jpg`;
}

/**
 * 高品質版を読み込んで差し替える
 */
function loadFullImage(img) {
    const fullSrc = img.dataset.src;
    if (!fullSrc) return;

    // 高品質版の取得中であることを親コンテナに伝える
    const container = img.parentElement;
    if (container) container.classList.add('img-upgrading');

    const tempImg = new Image();
    tempImg.onload = () => {
        img.src = fullSrc;
        img.removeAttribute('data-src');
        if (container) container.classList.remove('img-upgrading');
    };
    tempImg.onerror = () => {
        // 失敗してもスピナーは消す
        if (container) container.classList.remove('img-upgrading');
    };
    tempImg.src = fullSrc;
}

/**
 * data-src を持つ全画像を IntersectionObserver で順次アップグレード
 */
function upgradeImages() {
    const imgs = document.querySelectorAll('img[data-src]');
    if (!imgs.length) return;

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadFullImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '300px' // 300px手前から先読み開始
        });

        imgs.forEach(img => observer.observe(img));
    } else {
        imgs.forEach(loadFullImage);
    }
}

// works-render.js のレンダリング後に呼ばれるように DOMContentLoaded で登録
// ただし works-render.js 側の renderContent() 後に再度呼ぶため、外部からも呼べるようにexport
window.upgradeImages = upgradeImages;
window.toSmallSrc = toSmallSrc;

document.addEventListener('DOMContentLoaded', () => {
    // works-render.js が先に実行されてDOMを生成するので、少し待ってから起動
    setTimeout(upgradeImages, 100);
});
