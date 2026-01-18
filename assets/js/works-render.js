// Works Rendering Script
// データを読み込んで動的にHTMLを生成する

// Featured Worksのレンダリング
function renderFeaturedWorks() {
    const container = document.querySelector('.featured-works-grid');
    if (!container || !worksData.featured) return;

    // スケルトンカードを削除
    const skeletons = container.querySelectorAll('.skeleton-card');
    skeletons.forEach(skeleton => skeleton.remove());

    // カテゴリの日本語マッピング
    const categoryLabels = {
        'live': 'ジェネVJ',
        'vr': 'VR',
        'event': 'イベント',
        'vj': 'VJ',
        'mv': 'MV',
        'Interactive': 'インタラクティブ',
        'TouchDesigner': 'TouchDesigner',
        'Kinect': 'Kinect',
        'kinect': 'Kinect',
        '3dcg': '3DCG'
    };

    container.innerHTML = worksData.featured.map(work => {
        const galleryAttr = work.gallery && work.gallery.length > 0 ? `data-gallery="${work.gallery.join(',')}"` : '';
        const youtubeAttr = work.youtubeIds && work.youtubeIds.length > 0 ? `data-youtube="${work.youtubeIds.join(',')}"` : '';
        const hasContent = (work.youtubeIds && work.youtubeIds.length > 0) || (work.gallery && work.gallery.length > 0);
        const noContentClass = hasContent ? '' : 'no-content';

        // カテゴリバッジを生成（最初の1つのみ表示）
        const categoryBadges = work.categories ? work.categories.slice(0, 1).map(cat => {
            const label = categoryLabels[cat] || cat;
            return `<span class="work-category-badge">${label}</span>`;
        }).join('') : '';

        return `
        <div class="featured-work-card glass-card ${noContentClass}" ${youtubeAttr} ${galleryAttr}>
            <div class="featured-media">
                <img src="${work.thumbnail}" alt="${work.title}" class="featured-image" loading="lazy">
                ${categoryBadges ? `<div class="work-category-badges">${categoryBadges}</div>` : ''}
            </div>
            <div class="featured-info">
                <div class="featured-header">
                    <h3 class="featured-title">${work.title}</h3>
                    <span class="featured-year">${work.year}</span>
                </div>
                ${work.description ? `<p class="featured-description">${work.description}</p>` : ''}
                ${work.tags && work.tags.length > 0 ? `
                    <div class="featured-tags">
                        ${work.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
        `;
    }).join('');
}

// All Worksのレンダリング（初期表示数を制限）
function renderAllWorks() {
    const container = document.querySelector('.works-grid');
    if (!container || !worksData.all) return;

    // スケルトンカードを削除
    const skeletons = container.querySelectorAll('.skeleton-card-small');
    skeletons.forEach(skeleton => skeleton.remove());

    // ウィンドウ幅に応じて初期表示数を決定
    const getInitialCount = () => {
        const width = window.innerWidth;
        if (width >= 1200) return worksData.all.length; // 大画面: 全て表示
        if (width >= 768) return 6;  // 中画面: 2列×3行
        return 4;                     // 小画面: 2列×2行
    };

    const initialCount = getInitialCount();
    const visibleWorks = worksData.all.slice(0, initialCount);
    const hiddenWorks = worksData.all.slice(initialCount);

    // カテゴリの日本語マッピング
    const categoryLabels = {
        'live': 'ジェネVJ',
        'vr': 'VR',
        'event': 'イベント',
        'vj': 'VJ',
        'mv': 'MV',
        'Interactive': 'インタラクティブ',
        'TouchDesigner': 'TouchDesigner',
        'Kinect': 'Kinect',
        'kinect': 'Kinect',
        '3dcg': '3DCG'
    };

    // Coming Soonカード用のフォールバック画像
    const comingSoonFallback = '/assets/images/fallback/Fallback_Works_ComingSoon_01.png';

    container.innerHTML = visibleWorks.map(work => {
        // Coming Soonマーカーの場合は特殊カードを表示
        if (work === 'coming-soon') {
            return `
            <div class="work-item glass-card coming-soon no-content" data-category="">
                <div class="work-media">
                    <img src="${comingSoonFallback}" alt="Coming Soon" class="work-thumbnail" loading="lazy">
                </div>
                <div class="work-info">
                    <div class="work-header">
                        <h3 class="work-title">Coming Soon</h3>
                        <span class="work-year">-</span>
                    </div>
                    <p class="work-description">準備中です</p>
                </div>
            </div>
            `;
        }

        const categories = work.categories.join(' ');
        const primaryCategory = work.categories[0];
        const galleryAttr = work.gallery && work.gallery.length > 0 ? `data-gallery="${work.gallery.join(',')}"` : '';
        const youtubeValue = (work.youtubeIds && work.youtubeIds.length > 0) ? work.youtubeIds.join(',') : (work.youtube || '');
        const hasContent = youtubeValue || (work.gallery && work.gallery.length > 0);
        const noContentClass = hasContent ? '' : 'no-content';

        // カテゴリバッジを生成（最初の1つのみ表示）
        const categoryBadges = work.categories.slice(0, 1).map(cat => {
            const label = categoryLabels[cat] || cat;
            return `<span class="work-category-badge">${label}</span>`;
        }).join('');

        return `
        <div class="work-item glass-card ${noContentClass}" data-category="${categories}" data-youtube="${youtubeValue}" ${galleryAttr}>
            <div class="work-media">
                <img src="${work.thumbnail}" alt="${work.title}" class="work-thumbnail" loading="lazy">
                ${categoryBadges ? `<div class="work-category-badges">${categoryBadges}</div>` : ''}
                <div class="work-overlay">
                    ${youtubeValue ? `
                    <div class="work-play-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                            <path d="M10 8l6 4-6 4V8z" fill="currentColor"/>
                        </svg>
                    </div>
                    ` : `
                    <div class="work-info-overlay">
                        <span class="overlay-date">${work.year}</span>
                    </div>
                    `}
                </div>
            </div>
            <div class="work-info">
                <div class="work-header">
                    <h3 class="work-title">${work.title}</h3>
                    <span class="work-year">${work.year}</span>
                </div>
                <p class="work-description">${work.description}</p>
                <div class="work-meta">
                    ${work.tags.map((tag, index) => {
                        const tagClass = index === 0 ? `work-tag ${primaryCategory}` : 'work-tag';
                        return `<span class="${tagClass}">${tag}</span>`;
                    }).join('')}
                </div>
            </div>
        </div>
        `;
    }).join('');

    // 隠れている作品がある場合
    if (hiddenWorks.length > 0) {
        container.innerHTML += hiddenWorks.map(work => {
            // Coming Soonマーカーの場合は特殊カードを表示
            if (work === 'coming-soon') {
                return `
                <div class="work-item glass-card coming-soon no-content hidden" data-category="">
                    <div class="work-media">
                        <img src="${comingSoonFallback}" alt="Coming Soon" class="work-thumbnail" loading="lazy">
                    </div>
                    <div class="work-info">
                        <div class="work-header">
                            <h3 class="work-title">Coming Soon</h3>
                            <span class="work-year">-</span>
                        </div>
                        <p class="work-description">準備中です</p>
                    </div>
                </div>
                `;
            }

            const categories = work.categories.join(' ');
            const primaryCategory = work.categories[0];
            const galleryAttr = work.gallery && work.gallery.length > 0 ? `data-gallery="${work.gallery.join(',')}"` : '';
            const youtubeValue = (work.youtubeIds && work.youtubeIds.length > 0) ? work.youtubeIds.join(',') : (work.youtube || '');
            const hasContent = youtubeValue || (work.gallery && work.gallery.length > 0);
            const noContentClass = hasContent ? '' : 'no-content';

            // カテゴリバッジを生成（最初の1つのみ表示）
            const categoryBadges = work.categories.slice(0, 1).map(cat => {
                const label = categoryLabels[cat] || cat;
                return `<span class="work-category-badge">${label}</span>`;
            }).join('');

            return `
            <div class="work-item glass-card hidden ${noContentClass}" data-category="${categories}" data-youtube="${youtubeValue}" ${galleryAttr}>
                <div class="work-media">
                    <img src="${work.thumbnail}" alt="${work.title}" class="work-thumbnail" loading="lazy">
                    ${categoryBadges ? `<div class="work-category-badges">${categoryBadges}</div>` : ''}
                    <div class="work-overlay">
                        ${youtubeValue ? `
                        <div class="work-play-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                                <path d="M10 8l6 4-6 4V8z" fill="currentColor"/>
                            </svg>
                        </div>
                        ` : `
                        <div class="work-info-overlay">
                            <span class="overlay-date">${work.year}</span>
                        </div>
                        `}
                    </div>
                </div>
                <div class="work-info">
                    <div class="work-header">
                        <h3 class="work-title">${work.title}</h3>
                        <span class="work-year">${work.year}</span>
                    </div>
                    <p class="work-description">${work.description}</p>
                    <div class="work-meta">
                        ${work.tags.map((tag, index) => {
                            const tagClass = index === 0 ? `work-tag ${primaryCategory}` : 'work-tag';
                            return `<span class="${tagClass}">${tag}</span>`;
                        }).join('')}
                    </div>
                </div>
            </div>
            `;
        }).join('');
    }
}

// VJ Eventsのレンダリング（初期表示数を制限）
function renderEvents() {
    const container = document.querySelector('.event-list-compact');
    if (!container || !worksData.events) return;

    // ウィンドウ幅に応じて初期表示数を動的に計算
    const getInitialCount = () => {
        // 実際のコンテナ要素から幅を取得
        const containerElement = container.parentElement; // .container要素
        if (!containerElement) return 3;

        const containerWidth = containerElement.offsetWidth;
        const minCardWidth = 250;
        const gap = 16; // var(--space-4)の値

        // 実際に表示できる列数を計算
        const cols = Math.floor((containerWidth + gap) / (minCardWidth + gap));

        // 2行分を表示（列数×2）
        return Math.max(cols, 2) * 2; // 最小2列×2行
    };

    const initialCount = getInitialCount();
    const visibleEvents = worksData.events.slice(0, initialCount);
    const hiddenEvents = worksData.events.slice(initialCount);

    // フォールバック画像のパス
    const fallbackImage = '/assets/images/fallback/Fallback_Flyer_NoImage_03.png';

    container.innerHTML = visibleEvents.map(event => {
        // ギャラリー処理: ギャラリーがある場合のみdata-galleryを設定
        const galleryAttr = event.gallery && event.gallery.length > 0 ? `data-gallery="${event.gallery.join(',')}"` : '';
        // サムネイルが未設定の場合はフォールバック画像を使用
        const thumbnailSrc = event.thumbnail || fallbackImage;
        // ハッシュタグ処理: ハッシュタグがある場合のみ表示
        const hashtagsHtml = event.hashtags && event.hashtags.length > 0 ? `
            <div class="event-hashtags">
                ${event.hashtags.map(tag => `<a href="https://x.com/search?q=%23${encodeURIComponent(tag)}&src=typed_query&f=live" target="_blank" rel="noopener noreferrer" class="event-hashtag" onclick="event.stopPropagation()">#${tag}</a>`).join('')}
            </div>
        ` : '';
        return `
        <div class="event-item-compact glass-card" data-type="${event.type}" data-year="${event.year}" ${galleryAttr}>
            <div class="event-thumb-compact">
                <img src="${thumbnailSrc}" alt="${event.title}" loading="lazy" onerror="this.src='${fallbackImage}'">
                <span class="event-tag-compact ${event.type}">${event.type === 'vr' ? 'VR' : 'Real'}</span>
            </div>
            <div class="event-details-compact">
                <div class="event-date-compact">${event.date}</div>
                <h4 class="event-title-compact">${event.title}</h4>
                ${hashtagsHtml}
            </div>
        </div>
        `;
    }).join('');

    // 隠れているイベントがある場合
    if (hiddenEvents.length > 0) {
        container.innerHTML += hiddenEvents.map(event => {
            // ギャラリー処理: ギャラリーがある場合のみdata-galleryを設定
            const galleryAttr = event.gallery && event.gallery.length > 0 ? `data-gallery="${event.gallery.join(',')}"` : '';
            // サムネイルが未設定の場合はフォールバック画像を使用
            const thumbnailSrc = event.thumbnail || fallbackImage;
            // ハッシュタグ処理: ハッシュタグがある場合のみ表示
            const hashtagsHtml = event.hashtags && event.hashtags.length > 0 ? `
                <div class="event-hashtags">
                    ${event.hashtags.map(tag => `<a href="https://x.com/search?q=%23${encodeURIComponent(tag)}&src=typed_query&f=live" target="_blank" rel="noopener noreferrer" class="event-hashtag" onclick="event.stopPropagation()">#${tag}</a>`).join('')}
                </div>
            ` : '';
            return `
            <div class="event-item-compact glass-card hidden" data-type="${event.type}" data-year="${event.year}" ${galleryAttr}>
                <div class="event-thumb-compact">
                    <img src="${thumbnailSrc}" alt="${event.title}" loading="lazy" onerror="this.src='${fallbackImage}'">
                    <span class="event-tag-compact ${event.type}">${event.type === 'vr' ? 'VR' : 'Real'}</span>
                </div>
                <div class="event-details-compact">
                    <div class="event-date-compact">${event.date}</div>
                    <h4 class="event-title-compact">${event.title}</h4>
                    ${hashtagsHtml}
                </div>
            </div>
            `;
        }).join('');
    }
}

// フィルター機能（All Works）
function initWorksFilter() {
    const filterButtons = document.querySelectorAll('.works-filter-buttons .filter-btn');
    const workItems = document.querySelectorAll('.works-grid .work-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // アクティブボタンを変更
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;

            // フィルタリング
            workItems.forEach(item => {
                // Coming Soonカードはカテゴリ絞り込みに該当しない（全て表示時のみ表示）
                const isComingSoon = item.classList.contains('coming-soon');

                if (filter === 'all') {
                    item.classList.remove('hidden');
                } else if (isComingSoon) {
                    // Coming Soonはall以外では非表示
                    item.classList.add('hidden');
                } else if (item.dataset.category.includes(filter)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

// フィルター機能（VJ Events）
function initEventsFilter() {
    const filterButtons = document.querySelectorAll('.filter-buttons-compact .filter-btn-compact');
    const eventItems = document.querySelectorAll('.event-list-compact .event-item-compact');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // アクティブボタンを変更
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;

            // フィルタリング
            eventItems.forEach(item => {
                const itemType = item.dataset.type;
                const itemYear = item.dataset.year;

                if (filter === 'all' || itemType === filter || itemYear === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

// 「もっと見る」ボタン機能（All Works）
function initLoadMoreWorks() {
    const container = document.querySelector('.works-grid');
    const loadMoreSection = document.querySelector('.works-section .works-load-more');

    if (!container || !loadMoreSection) return;

    const hiddenWorks = container.querySelectorAll('.work-item.hidden');
    if (hiddenWorks.length === 0) {
        loadMoreSection.style.display = 'none';
        return;
    }

    const loadMoreBtn = loadMoreSection.querySelector('.btn');
    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener('click', function() {
        const hiddenItems = container.querySelectorAll('.work-item.hidden');
        hiddenItems.forEach(item => item.classList.remove('hidden'));
        loadMoreSection.style.display = 'none';
    });
}

// 「もっと見る」ボタン機能（VJ Events）
function initLoadMoreEvents() {
    const container = document.querySelector('.event-list-compact');
    const section = document.querySelector('#process');

    if (!container || !section) return;

    // 隠れているイベントがあるかチェック
    const hiddenEvents = container.querySelectorAll('.event-item-compact.hidden');
    if (hiddenEvents.length === 0) return;

    // 既存の「もっと見る」ボタンがあるかチェック
    let loadMoreBtn = section.querySelector('#loadMoreEventsBtn');
    if (!loadMoreBtn) {
        // ボタンを作成
        const loadMoreDiv = document.createElement('div');
        loadMoreDiv.className = 'works-load-more';
        loadMoreDiv.style.marginTop = 'var(--space-3)';
        loadMoreDiv.innerHTML = '<button class="btn btn-secondary" id="loadMoreEventsBtn">もっと見る</button>';

        // コンテナの後に挿入
        container.parentNode.insertBefore(loadMoreDiv, container.nextSibling);
        loadMoreBtn = document.getElementById('loadMoreEventsBtn');
    }

    // ボタンのクリックイベント
    loadMoreBtn.addEventListener('click', function() {
        const hiddenItems = container.querySelectorAll('.event-item-compact.hidden');
        hiddenItems.forEach(item => item.classList.remove('hidden'));
        this.parentElement.style.display = 'none';
    });
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', () => {
    // URLパラメータでtest-loading=trueが指定されている場合、遅延してレンダリング
    const urlParams = new URLSearchParams(window.location.search);
    const testLoading = urlParams.get('test-loading') === 'true';

    const renderContent = () => {
        renderFeaturedWorks();
        renderAllWorks();
        renderEvents();
        initWorksFilter();
        initEventsFilter();
        initLoadMoreWorks();
        initLoadMoreEvents();

        // イベント委譲を使用しているため、モーダルの再初期化は不要
        // カーソルホバー効果もイベント委譲で処理されているため、再初期化不要
    };

    if (testLoading) {
        // テストモード: 3秒遅延してスケルトンスクリーンを確認できるようにする
        setTimeout(renderContent, 3000);
    } else {
        // 通常モード: すぐにレンダリング
        renderContent();
    }
});

// ウィンドウリサイズ時にイベント表示数を再計算
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        renderEvents();
        initEventsFilter();
        initLoadMoreEvents();
    }, 250);
});
