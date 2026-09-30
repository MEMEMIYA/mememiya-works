// Solutions: 実績リンクから制作物一覧の該当作品モーダルを開く
(function () {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.solution-work-link');
        if (!btn) return;
        const title = btn.dataset.workTitle;
        const target = Array.from(document.querySelectorAll('.works-grid .work-item')).find(item => {
            const t = item.querySelector('.work-title');
            return t && t.textContent.trim() === title;
        });
        if (target) target.click();
    });
})();
