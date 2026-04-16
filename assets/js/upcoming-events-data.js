// Upcoming Events Data - 今後のイベント出演予定
const upcomingEventsData = [
    // 公開イベントの例:
    // {
    //     date: '2026/2/15',
    //     title: 'イベント名',
    //     role: 'VJ',
    //     venue: '会場名',
    //     link: 'https://example.com'  // 任意
    // }
];

// 日付をフォーマット（年を小さく、月/日を大きく、曜日を追加）
function formatDate(dateString) {
    const [year, month, day] = dateString.split('/');
    const date = new Date(year, month - 1, day);
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];

    return `<span class="date-year">${year}</span><span class="date-main-line"><span class="date-main">${month}/${day}</span><span class="date-weekday">(${weekday})</span></span>`;
}

// イベント予定をレンダリング
function renderUpcomingEvents() {
    const container = document.querySelector('.upcoming-events-list');
    if (!container) return;

    if (upcomingEventsData.length === 0) {
        container.innerHTML = '<p class="no-events">現在予定されているイベントはありません</p>';
        return;
    }

    container.innerHTML = upcomingEventsData.map(event => {
        if (event.hidden) {
            // 非公開イベント
            return `
                <div class="upcoming-event-item glass-card event-hidden${event.image ? ' has-image' : ''}">
                    <div class="event-tags-top-right">
                        ${event.role ? `<span class="tag event-role-tag">${event.role}</span>` : ''}
                        ${event.venue_type ? `<span class="tag event-venue-type-tag">${event.venue_type}</span>` : ''}
                    </div>
                    ${event.image ? `
                    <div class="event-thumb-upcoming ${event.image === 'placeholder' ? 'event-thumb-placeholder' : ''}">
                        ${event.image === 'placeholder' ?
                        `<div class="placeholder-content">
                                <div class="placeholder-text">Coming Soon</div>
                            </div>` :
                        `<img src="${event.image}" alt="イベントフライヤー" loading="lazy">`
                    }
                    </div>
                    ` : ''}
                    <div class="event-content">
                        <div class="event-header">
                            <div class="event-date">${formatDate(event.date)}</div>
                        </div>
                        <div class="event-details">
                            <h3 class="event-title event-title-hidden">${event.title ? event.title : 'VJ出演（詳細は後日公開）'}</h3>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // 公開イベント
            return `
                <div class="upcoming-event-item glass-card${event.image ? ' has-image' : ''}">
                    <div class="event-tags-top-right">
                        ${event.role ? `<span class="tag event-role-tag">${event.role}</span>` : ''}
                        ${event.venue_type ? `<span class="tag event-venue-type-tag">${event.venue_type}</span>` : ''}
                    </div>
                    ${event.gallery && event.gallery.length > 1 ? `
                    <div class="event-thumb-upcoming event-gallery">
                        ${event.gallery.map((img, i) => `<img src="${img}" alt="${event.title} フライヤー ${i + 1}" loading="lazy">`).join('')}
                    </div>
                    ` : event.image ? `
                    <div class="event-thumb-upcoming">
                        <img src="${event.image}" alt="${event.title} フライヤー" loading="lazy">
                    </div>
                    ` : ''}
                    <div class="event-content">
                        <div class="event-header">
                            <div class="event-date-group">
                                <div class="event-date">${formatDate(event.date)}</div>
                                ${event.hours || event.myRole || event.period ? `<div class="event-time-info">
                                    ${event.period ? `<span class="event-period">${event.period}</span>` : ''}
                                    ${event.hours ? `<span class="event-hours">${event.hours}</span>` : ''}
                                    ${event.myRole ? `<span class="event-my-role">${event.myRole}</span>` : ''}
                                </div>` : ''}
                            </div>
                        </div>
                        <div class="event-details">
                            <h3 class="event-title">${event.title}</h3>
                            ${event.description ? `<p class="event-description">${event.description}</p>` : ''}
                            <div class="event-meta">
                                ${event.venue ? `<span class="event-venue">${event.venue}</span>` : ''}
                                ${event.officialAccount ? `<a href="${event.officialAccount}" class="event-official-account" target="_blank" rel="noopener noreferrer"><svg class="button-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> ${event.officialAccountName || ''} 公式アカウント</a>` : ''}
                                ${event.hashtag ? `${event.hashtagSearchUrl ?
                        `<a href="${event.hashtagSearchUrl}" class="event-hashtag" target="_blank" rel="noopener noreferrer">${event.hashtag}</a>` :
                        `<div class="event-hashtag">${event.hashtag}</div>`}` : ''}
                                ${event.participants ? `<span class="event-participants">${event.participants.replace(' / ', '<br>')}</span>` : ''}
                                ${event.openingParty ? `<div class="event-opening-party">${event.openingParty}</div>` : ''}
                            </div>
                            <div class="event-buttons">
                                ${event.groupUrl ? `<a href="${event.groupUrl}" class="event-link-button" target="_blank" rel="noopener noreferrer"><img class="button-icon" src="assets/images/logo/VRChat_Logo_Outline_White.png" alt="VRChat"> VRChatグループに参加</a>` : ''}
                                ${event.link ? `<a href="${event.link}" class="event-link-button" target="_blank" rel="noopener noreferrer">${event.linkText || 'イベント詳細はこちら'}</a>` : ''}
                                ${event.tweetUrl ? `<a href="${event.tweetUrl}" class="event-link-button" target="_blank" rel="noopener noreferrer"><svg class="button-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> 告知ツイート</a>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }).join('');
}

// 画像ライトボックス機能
function initImageLightbox() {
    // ライトボックス用のHTML要素を作成
    const lightbox = document.createElement('div');
    lightbox.className = 'image-lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-backdrop"></div>
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="閉じる">✕</button>
            <img class="lightbox-image" src="" alt="">
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const backdrop = lightbox.querySelector('.lightbox-backdrop');

    // 画像クリック時の処理
    document.addEventListener('click', (e) => {
        const img = e.target.closest('.event-thumb-upcoming img');
        if (img) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    // 閉じる処理
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);

    // ESCキーで閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// DOM読み込み後に実行
document.addEventListener('DOMContentLoaded', () => {
    renderUpcomingEvents();
    initImageLightbox();
});
