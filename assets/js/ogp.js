// ===========================
// OGP Fetcher
// ===========================

// OGP情報のキャッシュ
const ogpCache = new Map();

// OGP情報を取得（キャッシュ付き）
async function fetchOGP(url) {
    // キャッシュチェック
    if (ogpCache.has(url)) {
        return ogpCache.get(url);
    }

    try {
        // タイムアウト付きfetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒でタイムアウト

        // alloriginsプロキシを使用してOGP情報を取得
        const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const proxyResponse = await fetch(apiUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!proxyResponse.ok) {
            throw new Error(`HTTP error! status: ${proxyResponse.status}`);
        }

        const data = await proxyResponse.json();

        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');

        const ogTitle = doc.querySelector('meta[property="og:title"]')?.content ||
                       doc.querySelector('meta[name="twitter:title"]')?.content ||
                       doc.querySelector('title')?.textContent ||
                       '';
        const ogDescription = doc.querySelector('meta[property="og:description"]')?.content ||
                             doc.querySelector('meta[name="twitter:description"]')?.content ||
                             doc.querySelector('meta[name="description"]')?.content ||
                             '';
        const ogImage = doc.querySelector('meta[property="og:image"]')?.content ||
                       doc.querySelector('meta[name="twitter:image"]')?.content ||
                       '';

        const result = {
            title: ogTitle,
            description: ogDescription,
            image: ogImage
        };

        // キャッシュに保存
        ogpCache.set(url, result);
        return result;
    } catch (error) {
        console.error('Failed to fetch OGP:', url, error);

        // エラー時は空の結果をキャッシュに保存（再試行を防ぐ）
        const emptyResult = { title: '', description: '', image: '' };
        ogpCache.set(url, emptyResult);
        return emptyResult;
    }
}
