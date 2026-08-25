// ===========================
// 怨世パジャマゲドン専用: 低速回線・非力端末の検出
// シェーダー背景／パーティクルレイヤーを読み込む前に判定し、
// window.PJ_REDUCE_FX に結果を入れておく。
// true の場合、background-pajamageddon.js / particles-pajamageddon.js は
// 何もせず終了し、body の通常のグラデーション背景だけになる。
// ===========================
(function () {
    function detectReduceFx() {
        try {
            // データ節約モード・低速回線（Network Information API。Safari/Firefoxは非対応なので他の判定と併用）
            var conn = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
            if (conn) {
                if (conn.saveData) return true;
                if (conn.effectiveType && /2g/.test(conn.effectiveType)) return true;
            }

            // 非力なCPU・メモリ（deviceMemoryもChromium系のみ）
            if (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4) return true;
            if (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4) return true;

            // OS側で「視差効果を減らす」等を設定している人への配慮
            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
        } catch (e) {
            // 判定に失敗した場合は安全側（重い演出は出さない）に倒す
            return true;
        }
        return false;
    }

    window.PJ_REDUCE_FX = detectReduceFx();
    if (window.PJ_REDUCE_FX) {
        document.documentElement.classList.add('pj-reduced-fx');
    }
})();
