// ============================================================
// ブッキング設定 - ここを変えるだけで表示が切り替わる
// ============================================================
const bookingConfig = {
    accepting: true,           // true = 受付中 / false = 停止中
    acceptingNote: '土日祝限定 ～6月末（不可日：5/17, 5/30, 5/31）',  // 受付中の場合の補足
    suspendedNote: '再開時期は未定です',               // 停止中の場合の補足
};
// ============================================================

// Information Data - お知らせ情報
const informationData = [
    {
        date: '2026/5/3',
        text: 'VJブッキング受付を再開しました（6月末まで・土日祝のみ）'
    },
    {
        date: '2026/3/29',
        text: 'VJ実績・制作物一覧を更新しました'
    },
    {
        date: '2026/1/24',
        text: 'VJブッキングの新規受付を停止しました'
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
    const escapeHtml = window.securityUtils?.escapeHtml || ((value) => String(value ?? ''));

    container.innerHTML = informationData.map(item => `
        <p class="info-item">
            <span class="info-date">${escapeHtml(item.date)}</span>
            <span class="info-text">${escapeHtml(item.text)}</span>
        </p>
    `).join('');
}

// ブッキング状況カードをレンダリング
function renderBookingStatus() {
    const card = document.querySelector('.booking-status-card');
    if (!card) return;

    const { accepting, acceptingNote, suspendedNote } = bookingConfig;
    const escapeHtml = window.securityUtils?.escapeHtml || ((value) => String(value ?? ''));

    card.classList.toggle('booking-card-accepting', accepting);

    card.innerHTML = accepting ? `
        <div class="info-label">ブッキング</div>
        <div class="info-value booking-accepting">受付中</div>
        <div class="info-detail">${escapeHtml(acceptingNote)}</div>
    ` : `
        <div class="info-label">ブッキング</div>
        <div class="info-value booking-suspended">新規受付停止中</div>
        <div class="info-detail">${escapeHtml(suspendedNote)}</div>
    `;
}

// DOM読み込み後に実行
document.addEventListener('DOMContentLoaded', () => {
    renderInformation();
    renderBookingStatus();
});
