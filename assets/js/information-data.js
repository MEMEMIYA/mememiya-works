// Information Data - お知らせ情報
const informationData = [
    {
        date: '2026/1/24',
        text: 'VR空間でのVJ：受付を停止しました'
    },
    {
        date: '2026/1/19',
        text: 'VJブッキング受付期間を『2026年2月実施分まで』に変更'
    },
    {
        date: '2026/1/19',
        text: 'サイトをリニューアルしました！'
    }
];

// お知らせをレンダリング
function renderInformation() {
    const container = document.querySelector('.info-list');
    if (!container) return;

    container.innerHTML = informationData.map(item => `
        <p class="info-item">
            <span class="info-date">${item.date}</span>
            <span class="info-text">${item.text}</span>
        </p>
    `).join('');
}

// DOM読み込み後に実行
document.addEventListener('DOMContentLoaded', renderInformation);
