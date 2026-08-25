// ===========================
// 怨世パジャマゲドン専用パーティクルレイヤー
// ParticleJockey製テクスチャ（Sigil / Crescent / Hex）を、
// 本文コンテナの左右だけに漂わせる Canvas2D オーバーレイ。
// 中央のテキスト列には被らないよう、コンテナ幅を実測して配置範囲を決める。
// ===========================
(function () {
    // 低速回線・非力端末では重い演出を出さない（quality-detect-pajamageddon.js が判定）
    if (window.PJ_REDUCE_FX) return;

    const canvas = document.getElementById('particleLayer');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const TEXTURE_SRCS = [
        'assets/images/events/ensei-pajamageddon/particles/PT_Sigil.png',
        'assets/images/events/ensei-pajamageddon/particles/PT_Crescent.png',
        'assets/images/events/ensei-pajamageddon/particles/PT_Hex.png'
    ];

    // 紫〜ラベンダー系のティントカラー（サイトのパープルパレットに合わせる）
    const TINT_COLORS = ['#A78BFA', '#8B5CF6', '#C4B5FD', '#7C3AED'];

    // 高DPI画面ほど毎フレームのクリア/描画コストが跳ね上がるので上限を控えめに
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let vw = window.innerWidth;
    let vh = window.innerHeight;

    // 本文コンテナ幅を実測し、その外側だけをパーティクルの出現ゾーンにする
    let containerLeft = 0;
    let containerRight = vw;

    function measureContainer() {
        const el = document.querySelector('.event-page-section .container') || document.querySelector('.container');
        if (!el) {
            containerLeft = vw * 0.5;
            containerRight = vw * 0.5;
            return;
        }
        const rect = el.getBoundingClientRect();
        containerLeft = rect.left;
        containerRight = rect.right;
    }

    function resize() {
        vw = window.innerWidth;
        vh = window.innerHeight;
        canvas.width = vw * dpr;
        canvas.height = vh * dpr;
        canvas.style.width = vw + 'px';
        canvas.style.height = vh + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        measureContainer();
        buildParticles();
    }

    // ---- テクスチャ読み込み＆ティント ----
    let tintedTextures = [];
    let texturesReady = false;

    // グローは毎フレームの shadowBlur（重い）ではなく、テクスチャ生成時に一度だけ
    // ぼかしを焼き込んでおく方式にする。実行時はただの drawImage 1回で済む。
    const GLOW_PAD = 14;

    function tintImage(img, color) {
        const base = document.createElement('canvas');
        base.width = img.width;
        base.height = img.height;
        const bctx = base.getContext('2d');
        bctx.drawImage(img, 0, 0);
        bctx.globalCompositeOperation = 'source-in';
        bctx.fillStyle = color;
        bctx.fillRect(0, 0, base.width, base.height);

        const off = document.createElement('canvas');
        off.width = img.width + GLOW_PAD * 2;
        off.height = img.height + GLOW_PAD * 2;
        const octx = off.getContext('2d');
        try {
            octx.filter = 'blur(5px)';
            octx.globalAlpha = 0.85;
            octx.drawImage(base, GLOW_PAD, GLOW_PAD);
            octx.filter = 'none';
        } catch (e) {
            // filter未対応ブラウザはグロー無しにフォールバック（描画自体は問題なく動く）
        }
        octx.globalAlpha = 1;
        octx.drawImage(base, GLOW_PAD, GLOW_PAD);
        return off;
    }

    function loadTextures() {
        let loaded = 0;
        const rawImages = [];
        TEXTURE_SRCS.forEach((src, i) => {
            const img = new Image();
            // ギャラリー画像やアーカイブ映像より優先度を下げる（対応ブラウザのみ、非対応でも無害）
            img.fetchPriority = 'low';
            img.decoding = 'async';
            img.onload = () => {
                rawImages[i] = img;
                loaded++;
                if (loaded === TEXTURE_SRCS.length) {
                    // 各テクスチャ × 各カラーのティント済みバリエーションを事前生成
                    tintedTextures = [];
                    rawImages.forEach((im) => {
                        TINT_COLORS.forEach((color) => {
                            tintedTextures.push(tintImage(im, color));
                        });
                    });
                    texturesReady = true;
                    resize();
                    rafId = requestAnimationFrame(render);
                }
            };
            img.onerror = () => {
                loaded++;
            };
            img.src = src;
        });
    }

    // ---- パーティクル ----
    const MIN_ZONE_WIDTH = 90; // これより狭い余白しかない画面幅ではパーティクルを出さない（モバイル対策）
    let particles = [];

    function randRange(a, b) {
        return a + Math.random() * (b - a);
    }

    function spawnParticle(side) {
        const zoneMargin = 24;
        let x;
        if (side === 'left') {
            const zoneW = Math.max(0, containerLeft - zoneMargin);
            x = randRange(zoneMargin * 0.5, zoneMargin + zoneW);
        } else {
            const zoneW = Math.max(0, vw - containerRight - zoneMargin);
            x = randRange(containerRight + zoneMargin * 0.5, containerRight + zoneMargin * 0.5 + zoneW);
        }
        // 小さい粒を多めに混ぜて密度感を出す（奥行きのある群れに見せる）
        const isSmall = Math.random() < 0.6;
        const size = isSmall ? randRange(10, 24) : randRange(26, 58);

        return {
            tex: Math.floor(Math.random() * tintedTextures.length),
            x: x,
            y: randRange(0, vh),
            size: size,
            rot: randRange(0, Math.PI * 2),
            rotSpeed: randRange(-0.16, 0.16),
            driftX: randRange(-3.5, 3.5),
            driftSpeed: isSmall ? randRange(8, 20) : randRange(5, 11), // px/sec 上昇速度（小粒ほど速く）
            phase: randRange(0, Math.PI * 2),
            twinkleSpeed: randRange(0.4, 1.0),
            baseAlpha: isSmall ? randRange(0.15, 0.4) : randRange(0.25, 0.55),
            side: side
        };
    }

    function buildParticles() {
        const leftZone = containerLeft;
        const rightZone = vw - containerRight;
        const usableZone = Math.min(leftZone, rightZone);

        if (usableZone < MIN_ZONE_WIDTH) {
            particles = [];
            return;
        }

        // 画面が広いほど密度を上げる（大きすぎない上限つき、軽量化のため抑えめ）
        const perSide = Math.min(35, Math.max(14, Math.floor(usableZone / 12)));
        particles = [];
        for (let i = 0; i < perSide; i++) {
            particles.push(spawnParticle('left'));
            particles.push(spawnParticle('right'));
        }
    }

    // ---- 描画ループ ----
    let lastTime = 0;
    let rafId = null;
    // パーティクルサイズ・グロー・横揺れの分だけ余裕を持たせた、クリアする帯の幅
    const CLEAR_MARGIN = 120;

    function render(now) {
        rafId = requestAnimationFrame(render);
        if (!texturesReady) return;

        const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0;
        lastTime = now;

        // パーティクルは左右の帯にしか存在しないので、画面全幅ではなくそこだけクリアする
        const leftClearW = Math.min(vw, containerLeft + CLEAR_MARGIN);
        const rightClearX = Math.max(0, containerRight - CLEAR_MARGIN);
        ctx.clearRect(0, 0, leftClearW, vh);
        ctx.clearRect(rightClearX, 0, vw - rightClearX, vh);

        if (!particles.length) return;

        ctx.globalCompositeOperation = 'lighter';

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            p.y -= p.driftSpeed * dt;
            p.x += Math.sin(now * 0.0006 + p.phase) * p.driftX * dt;
            p.rot += p.rotSpeed * dt;

            // 上端を超えたら下から再出現
            if (p.y < -p.size) {
                const fresh = spawnParticle(p.side);
                fresh.y = vh + p.size * 0.5;
                particles[i] = fresh;
                continue;
            }

            // 明滅の振れ幅を大きくして、パキッと光るキラキラ感を出す
            const twinkleRaw = Math.sin(now * 0.001 * p.twinkleSpeed + p.phase);
            const twinkle = 0.25 + 0.9 * Math.max(0, twinkleRaw);
            const alpha = Math.min(1, p.baseAlpha * twinkle * 1.4);

            const tex = tintedTextures[p.tex];
            const s = p.size;

            // グローはテクスチャに焼き込み済みなので、実行時は軽い drawImage のみ
            const drawSize = s * (1 + (GLOW_PAD * 2) / 128);
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.drawImage(tex, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
            ctx.restore();
        }

        ctx.globalCompositeOperation = 'source-over';
    }

    function start() {
        window.addEventListener('resize', resize);
        loadTextures();

        // タブがバックグラウンドにある間は描画を止めて無駄なCPU消費を避ける
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (rafId !== null) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            } else if (rafId === null && texturesReady) {
                lastTime = 0;
                rafId = requestAnimationFrame(render);
            }
        });
    }

    // このページの主目的は画像・動画を見せること。パーティクルはあくまで演出なので、
    // ページの画像・iframeなど主要リソースが出そろう window の load イベントまで起動を待つ。
    if (document.readyState === 'complete') {
        start();
    } else {
        window.addEventListener('load', start);
    }
})();
