// Upcoming Events Data - 今後のイベント出演予定
const upcomingEventsData = [
    {
        date: '2026/2/22',
        hidden: true  // 詳細非公開
    },
    {
        date: '2026/3/15',
        hidden: true  // 詳細非公開
    },
    {
        date: '2026/3/21',
        title: 'グループ展「中庭」',
        role: 'ジェネVJ',
        venue: 'Pot Gallery（南青山）',
        venue_type: 'REAL',  // 'REAL' または 'VR'
        link: 'https://nakaniwa.peatix.com/',
        image: 'assets/images/flyers/中庭_20260321.jpg',
        description: '内と外を融合したXR体験の実験場。XR・空間表現・インタラクションを軸に活動するエンジニア/アーティストによるグループ展。メディアアート、パフォーマンス、DJ/VJが交差する多様な創造表現の場。',
        openingParty: 'オープニングパーティー 17:00-19:40',
        participants: 'Exhibition: donabe, Dolphiiim, Ekito, Siosai, さくたま, はまちゃん, ふぁゔ / DJ: KBSNK, Pinieon / VJ: MEMEMIYA, sakiyama / Audiovisual Performance: foana × Luna'
    }
    // 公開イベントの例:
    // {
    //     date: '2026/2/15',
    //     title: 'イベント名',
    //     role: 'VJ',
    //     venue: '会場名',
    //     link: 'https://example.com'  // 任意
    // }
];

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
                    ${event.image ? `
                    <div class="event-thumb-upcoming">
                        <img src="${event.image}" alt="イベントフライヤー" loading="lazy">
                    </div>
                    ` : ''}
                    <div class="event-content">
                        <div class="event-header" style="border-bottom: none; padding-bottom: 0;">
                            <div class="event-date">${event.date}</div>
                        </div>
                        <div class="event-details">
                            <h3 class="event-title event-title-hidden" style="font-size: var(--text-lg); margin-top: var(--space-1);">VJ出演（詳細は後日公開）</h3>
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
                    ${event.image ? `
                    <div class="event-thumb-upcoming">
                        <img src="${event.image}" alt="${event.title} フライヤー" loading="lazy">
                    </div>
                    ` : ''}
                    <div class="event-content">
                        <div class="event-header">
                            <div class="event-date-group">
                                <div class="event-date">${event.date}</div>
                                ${event.period ? `<div class="event-period">${event.period}</div>` : ''}
                                ${event.hours ? `<div class="event-hours">${event.hours}</div>` : ''}
                                ${event.openingParty ? `<div class="event-opening-party">${event.openingParty}</div>` : ''}
                            </div>
                        </div>
                        <div class="event-details">
                            <h3 class="event-title">${event.title}</h3>
                            ${event.description ? `<p class="event-description">${event.description}</p>` : ''}
                            <div class="event-meta">
                                ${event.venue ? `<span class="event-venue">${event.venue}</span>` : ''}
                            </div>
                            ${event.myRole ? `<div class="event-my-role">${event.myRole}</div>` : ''}
                            ${event.participants ? `<div class="event-participants-section"><div class="event-participants-title">参加アーティスト</div><p class="event-participants">${event.participants}</p></div>` : ''}
                            ${event.link ? `<a href="${event.link}" class="event-link-button" target="_blank" rel="noopener noreferrer">イベントHP ↗</a>` : ''}
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
        if (e.target.closest('.event-thumb-upcoming img')) {
            const img = e.target.closest('.event-thumb-upcoming img');
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
