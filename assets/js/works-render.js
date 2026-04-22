// Works Rendering Script
// データを読み込んで動的にHTMLを生成する

// image-progressive.js で定義・エクスポートされた toSmallSrc を使用
const _toSmall = toSmallSrc;

// --- 共通定数 ---

const _CATEGORY_LABELS = {
    'live': 'ジェネVJ',
    'vr': 'VR',
    'event': 'イベント',
    'vj': 'VJ',
    'mv': 'MV',
    'Interactive': 'インタラクティブ',
    'TouchDesigner': 'TouchDesigner',
    'Kinect': 'Kinect',
    'kinect': 'Kinect',
    '3dcg': '3DCG',
    'webar': 'WebAR'
};

const _COMING_SOON_FALLBACK = '/assets/images/fallback/Fallback_Works_ComingSoon_01.png';
const _FALLBACK_FLYER = '/assets/images/fallback/Fallback_Flyer_NoImage_03.png';

const _workImgEvents = (fallback) =>
    `loading="lazy" onload="this.closest('.work-media').classList.add('img-loaded')" onerror="this.src='${fallback}';this.closest('.work-media').classList.add('img-loaded')"`;

// --- カード生成ヘルパー ---

function _buildComingSoonCard(work, isHidden) {
    const hiddenClass = isHidden ? ' hidden' : '';
    const url = work?.vivivitUrl;
    if (url) {
        const categoryStr = work.categories ? work.categories.join(' ') : '';
        const badgeHtml = work.badge
            ? `<div class="work-category-badges"><span class="work-category-badge">${work.badge}</span></div>`
            : '';
        return `
        <a href="${url}" target="_blank" rel="noopener noreferrer" class="work-item glass-card coming-soon coming-soon-vivivit${hiddenClass}" data-category="${categoryStr}">
            <div class="work-media">
                ${badgeHtml}
                <div class="vivivit-media-overlay">
                    <img src="assets/images/logo/vivivit_service_logo_RGB_white.png" alt="ViViViT" class="vivivit-media-logo">
                </div>
            </div>
            <div class="work-info">
                <div class="work-header">
                    <h3 class="work-title">ViViViT 限定</h3>
                </div>
                <p class="work-description">ログインすると閲覧できます</p>
                <p class="work-description" style="font-size: 0.75em; opacity: 0.55; margin-top: 4px;">※ 外部サイトに飛びます</p>
            </div>
        </a>
        `;
    }
    return `
    <div class="work-item glass-card coming-soon no-content${hiddenClass}" data-category="">
        <div class="work-media">
            <img src="${_COMING_SOON_FALLBACK}" alt="Coming Soon" class="work-thumbnail" ${_workImgEvents(_COMING_SOON_FALLBACK)}>
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

function _buildWorkCard(work, isHidden) {
    if (work === 'coming-soon' || work?.type === 'coming-soon') {
        return _buildComingSoonCard(work, isHidden);
    }

    const categories = work.categories.join(' ');
    const primaryCategory = work.categories[0];
    const galleryAttr = work.gallery && work.gallery.length > 0
        ? `data-gallery="${work.gallery.join(',')}"`
        : '';
    const youtubeValue = (work.youtubeIds && work.youtubeIds.length > 0)
        ? work.youtubeIds.join(',')
        : (work.youtube || '');
    const hasContent = youtubeValue || work.externalVideo || (work.gallery && work.gallery.length > 0);
    const noContentClass = hasContent ? '' : 'no-content';
    const hiddenClass = isHidden ? ' hidden' : '';

    const categoryBadges = work.categories.slice(0, 1).map(cat => {
        const label = _CATEGORY_LABELS[cat] || cat;
        return `<span class="work-category-badge">${label}</span>`;
    }).join('');

    return `
    <div class="work-item glass-card${hiddenClass} ${noContentClass}" data-category="${categories}" data-youtube="${youtubeValue}" ${galleryAttr} ${work.externalVideo ? `data-external-video="${work.externalVideo}"` : ''}>
        <div class="work-media">
            <img src="${_toSmall(work.thumbnail)}" data-src="${work.thumbnail}" alt="${work.title}" class="work-thumbnail" ${_workImgEvents(_COMING_SOON_FALLBACK)}>
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
}

function _buildEventCard(event, isHidden) {
    const galleryAttr = event.gallery && event.gallery.length > 0
        ? `data-gallery="${event.gallery.join(',')}"`
        : '';
    const thumbnailSrc = event.thumbnail || _FALLBACK_FLYER;
    const thumbnailSmall = event.thumbnail ? _toSmall(event.thumbnail) : _FALLBACK_FLYER;
    const hiddenClass = isHidden ? ' hidden' : '';
    const hashtagsHtml = event.hashtags && event.hashtags.length > 0 ? `
        <div class="event-hashtags">
            ${event.hashtags.map(tag => `<a href="https://x.com/search?q=%23${encodeURIComponent(tag)}&src=typed_query&f=live" target="_blank" rel="noopener noreferrer" class="event-hashtag" onclick="event.stopPropagation()">#${tag}</a>`).join('')}
        </div>
    ` : '';
    return `
    <div class="event-item-compact glass-card${hiddenClass}" data-type="${event.type}" data-year="${event.year}" ${galleryAttr}>
        <div class="event-thumb-compact">
            <img src="${thumbnailSmall}" data-src="${thumbnailSrc}" alt="${event.title}" loading="lazy" onload="this.closest('.event-thumb-compact').classList.add('img-loaded')" onerror="this.src='${_FALLBACK_FLYER}';this.closest('.event-thumb-compact').classList.add('img-loaded')">
            <span class="event-tag-compact ${event.type}">${event.type === 'vr' ? 'VR' : 'Real'}</span>
        </div>
        <div class="event-details-compact">
            <div class="event-date-compact">${event.date}</div>
            <h4 class="event-title-compact">${event.title}</h4>
            ${hashtagsHtml}
        </div>
    </div>
    `;
}

// --- レンダリング関数 ---

// Featured Worksのレンダリング
function renderFeaturedWorks() {
    const container = document.querySelector('.featured-works-grid');
    if (!container || !worksData.featured) return;

    container.querySelectorAll('.skeleton-card').forEach(el => el.remove());

    container.innerHTML = worksData.featured.map(work => {
        const galleryAttr = work.gallery && work.gallery.length > 0 ? `data-gallery="${work.gallery.join(',')}"` : '';
        const youtubeAttr = work.youtubeIds && work.youtubeIds.length > 0 ? `data-youtube="${work.youtubeIds.join(',')}"` : '';
        const hasContent = (work.youtubeIds && work.youtubeIds.length > 0) || (work.gallery && work.gallery.length > 0);
        const noContentClass = hasContent ? '' : 'no-content';

        const categoryBadges = work.categories ? work.categories.slice(0, 1).map(cat => {
            const label = _CATEGORY_LABELS[cat] || cat;
            return `<span class="work-category-badge">${label}</span>`;
        }).join('') : '';

        const featuredFallback = '/assets/images/fallback/Fallback_Works_ComingSoon_01.png';
        const featuredSmall = _toSmall(work.thumbnail);
        const featuredImgEvents = `loading="eager" onload="this.closest('.featured-media').classList.add('img-loaded')" onerror="this.src='${featuredFallback}';this.closest('.featured-media').classList.add('img-loaded')"`;
        return `
        <div class="featured-work-card glass-card ${noContentClass}" ${youtubeAttr} ${galleryAttr}>
            <div class="featured-media">
                <img src="${featuredSmall}" data-src="${work.thumbnail}" alt="${work.title}" class="featured-image" ${featuredImgEvents}>
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

    container.querySelectorAll('.skeleton-card-small').forEach(el => el.remove());

    const width = window.innerWidth;
    const initialCount = width >= 1200 ? worksData.all.length : width >= 768 ? 6 : 4;

    container.innerHTML = worksData.all
        .map((work, index) => _buildWorkCard(work, index >= initialCount))
        .join('');

    container.innerHTML += `
    <a href="https://www.vivivit.com/mememiya" target="_blank" rel="noopener noreferrer" class="works-vivivit-card">
        <img src="assets/images/logo/vivivit_service_logo_RGB_white.png" alt="ViViViT" class="works-vivivit-logo">
        <span class="works-vivivit-main">ここに載せられないものはこちらにて</span>
        <span class="works-vivivit-note">※ 閲覧にはViViViTへのログインが必要です</span>
        <span class="works-vivivit-note">※ 外部サイトに飛びます</span>
    </a>
    `;
}

// 「もっと見る」が押されたかのフラグ
let eventsExpanded = false;

// VJ Eventsのレンダリング（初期表示数を制限）
function renderEvents() {
    const container = document.querySelector('.event-list-compact');
    if (!container || !worksData.events) return;

    const getInitialCount = () => {
        const containerElement = container.parentElement;
        if (!containerElement) return 3;
        const containerWidth = containerElement.offsetWidth;
        const minCardWidth = 190;
        const gap = 16;
        const cols = Math.floor((containerWidth + gap) / (minCardWidth + gap));
        return Math.max(cols, 2) * 2;
    };

    const initialCount = eventsExpanded ? worksData.events.length : getInitialCount();

    container.innerHTML = worksData.events
        .map((event, index) => _buildEventCard(event, index >= initialCount))
        .join('');
}

// フィルター機能（All Works）
function initWorksFilter() {
    const filterButtons = document.querySelectorAll('.works-filter-buttons .filter-btn');
    const workItems = document.querySelectorAll('.works-grid .work-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;

            workItems.forEach(item => {
                const isComingSoon = item.classList.contains('coming-soon');

                if (filter === 'all') {
                    item.classList.remove('hidden');
                } else if (isComingSoon && !item.dataset.category) {
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
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;

            eventItems.forEach(item => {
                if (filter === 'all' || item.dataset.type === filter || item.dataset.year === filter) {
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
        container.querySelectorAll('.work-item.hidden').forEach(item => item.classList.remove('hidden'));
        loadMoreSection.style.display = 'none';
    });
}

// 「もっと見る」ボタン機能（VJ Events）
function initLoadMoreEvents() {
    const container = document.querySelector('.event-list-compact');
    const section = document.querySelector('#process');

    if (!container || !section) return;

    const hiddenEvents = container.querySelectorAll('.event-item-compact.hidden');
    if (hiddenEvents.length === 0) return;

    let loadMoreBtn = section.querySelector('#loadMoreEventsBtn');
    if (!loadMoreBtn) {
        const loadMoreDiv = document.createElement('div');
        loadMoreDiv.className = 'works-load-more';
        loadMoreDiv.style.marginTop = 'var(--space-3)';
        loadMoreDiv.innerHTML = '<button class="btn btn-secondary" id="loadMoreEventsBtn">もっと見る</button>';
        container.parentNode.insertBefore(loadMoreDiv, container.nextSibling);
        loadMoreBtn = document.getElementById('loadMoreEventsBtn');
    }

    loadMoreBtn.addEventListener('click', function() {
        eventsExpanded = true;
        container.querySelectorAll('.event-item-compact').forEach(item => item.classList.remove('hidden'));
        const activeFilter = document.querySelector('.filter-buttons-compact .filter-btn-compact.active');
        if (activeFilter && activeFilter.dataset.filter !== 'all') {
            const filter = activeFilter.dataset.filter;
            container.querySelectorAll('.event-item-compact').forEach(item => {
                if (item.dataset.type !== filter && item.dataset.year !== filter) {
                    item.classList.add('hidden');
                }
            });
        }
        this.parentElement.style.display = 'none';
    });
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', () => {
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

        if (typeof window.upgradeImages === 'function') {
            window.upgradeImages();
        }
    };

    if (testLoading) {
        setTimeout(renderContent, 3000);
    } else {
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
