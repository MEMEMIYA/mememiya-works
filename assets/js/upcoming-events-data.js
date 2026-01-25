// Upcoming Events Data - 今後のイベント出演予定
const upcomingEventsData = [
    {
        date: '2026/2',
        hidden: true  // 詳細非公開
    },
    {
        date: '2026/2',
        hidden: true  // 詳細非公開
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
                <div class="upcoming-event-item glass-card event-hidden">
                    <div class="event-date">${event.date}</div>
                    <div class="event-details">
                        <h3 class="event-title event-title-hidden">詳細は後日公開</h3>
                    </div>
                </div>
            `;
        } else {
            // 公開イベント
            return `
                <div class="upcoming-event-item glass-card">
                    <div class="event-date">${event.date}</div>
                    <div class="event-details">
                        <h3 class="event-title">${event.link ? `<a href="${event.link}" target="_blank" rel="noopener noreferrer">${event.title}</a>` : event.title}</h3>
                        <div class="event-meta">
                            <span class="event-role">${event.role}</span>
                            ${event.venue ? `<span class="event-venue">${event.venue}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }
    }).join('');
}

// DOM読み込み後に実行
document.addEventListener('DOMContentLoaded', renderUpcomingEvents);
