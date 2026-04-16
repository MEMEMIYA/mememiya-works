// Progressive Image Loader
// 小さい画像を即表示し、バックグラウンドで高品質版にモザイクトランジションで差し替える

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
 * Canvasを使ったモザイクトランジション
 * 大きいブロック（低解像度側） → 小さいブロック（高解像度側） → 完了
 */
function mosaicReveal(container, img, fullSrc) {
    const W = container.offsetWidth;
    const H = container.offsetHeight;

    // サイズが取れない場合はそのまま差し替え
    if (!W || !H) {
        img.src = fullSrc;
        img.removeAttribute('data-src');
        container.classList.remove('img-upgrading');
        return;
    }

    // キャンバスをコンテナに重ねる
    const canvas = document.createElement('canvas');
    canvas.width  = W;
    canvas.height = H;
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:7;pointer-events:none;';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // ブロックサイズの段階：大→小
    // 前半は低解像度画像、後半は高解像度画像を描画
    const pixelSteps = [24, 10, 3, 1];
    const halfway    = Math.ceil(pixelSteps.length / 2); // 2

    /**
     * object-fit: cover と同じクロップ領域を計算する
     */
    function getCoverCrop(source) {
        const srcW = source.naturalWidth  || source.width;
        const srcH = source.naturalHeight || source.height;
        if (!srcW || !srcH) return { sx: 0, sy: 0, sw: srcW, sh: srcH };
        const srcRatio = srcW / srcH;
        const dstRatio = W / H;
        let sx, sy, sw, sh;
        if (srcRatio > dstRatio) {
            // 横長：左右をクロップ（縦に合わせる）
            sh = srcH;
            sw = srcH * dstRatio;
            sx = (srcW - sw) / 2;
            sy = 0;
        } else {
            // 縦長：上下をクロップ（横に合わせる）
            sw = srcW;
            sh = srcW / dstRatio;
            sx = 0;
            sy = (srcH - sh) / 2;
        }
        return { sx, sy, sw, sh };
    }

    /**
     * ブロック状に縮小→拡大して描画（モザイク効果）
     * object-fit: cover と同じクロップで描画する
     */
    function drawMosaic(source, pixelSize) {
        const cols = Math.max(1, Math.ceil(W / pixelSize));
        const rows = Math.max(1, Math.ceil(H / pixelSize));
        const tmp  = document.createElement('canvas');
        tmp.width  = cols;
        tmp.height = rows;
        const tc   = tmp.getContext('2d');
        tc.imageSmoothingEnabled = false;
        const { sx, sy, sw, sh } = getCoverCrop(source);
        tc.drawImage(source, sx, sy, sw, sh, 0, 0, cols, rows);
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(tmp, 0, 0, W, H);
    }

    function startAnimation(loImg, hiImg) {
        // img要素を高解像度に差し替え（キャンバスの下に隠れている）
        img.src = fullSrc;
        img.removeAttribute('data-src');

        let step = 0;
        const tick = () => {
            if (step >= pixelSteps.length) {
                canvas.remove();
                container.classList.remove('img-upgrading');
                return;
            }
            // 最後の1ステップ手前でフラッシュを開始（モザイク終わりかけに重ねる）
            if (step === pixelSteps.length - 1) {
                container.classList.add('img-revealed');
                setTimeout(() => container.classList.remove('img-revealed'), 350);
            }
            drawMosaic(step < halfway ? loImg : hiImg, pixelSteps[step]);
            step++;
            setTimeout(tick, 35);
        };
        tick();
    }

    // 低解像度（現在表示中）と高解像度を並行して読み込む
    let loReady = false, hiReady = false;
    let loImg, hiImg;

    function tryStart() {
        if (loReady && hiReady) startAnimation(loImg, hiImg);
    }

    loImg = new Image();
    loImg.onload  = () => { loReady = true; tryStart(); };
    loImg.onerror = () => { loReady = true; tryStart(); }; // エラーでも続行
    loImg.src = img.src; // 現在表示中の低解像度src（ブラウザキャッシュから即返る）

    hiImg = new Image();
    hiImg.onload  = () => { hiReady = true; tryStart(); };
    hiImg.onerror = () => {
        // 高解像度の取得失敗 → アニメーションなしで終了
        canvas.remove();
        container.classList.remove('img-upgrading');
    };
    hiImg.src = fullSrc;
}

/**
 * 高品質版を読み込んでモザイクトランジションで差し替える
 */
function loadFullImage(img) {
    const fullSrc = img.dataset.src;
    if (!fullSrc) return;

    const container = img.parentElement;
    if (container) container.classList.add('img-upgrading');

    mosaicReveal(container, img, fullSrc);
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
            rootMargin: '300px'
        });

        imgs.forEach(img => observer.observe(img));
    } else {
        imgs.forEach(loadFullImage);
    }
}

window.upgradeImages = upgradeImages;
window.toSmallSrc    = toSmallSrc;

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(upgradeImages, 100);
});
