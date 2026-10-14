(function () {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.solution-work-link');
        if (!btn) return;
        const title = btn.dataset.workTitle;
        if (!title) return;
        // 実績一覧側のタイトルは「怨世パジャマゲドン」のように vol 表記を含まないことがあるため、
        // 完全一致を優先しつつ、前方一致(例: 「…ゲドン vol.0」→「…ゲドン」)でも探す
        const items = Array.from(document.querySelectorAll('.works-grid .work-item'));
        const titleOf = (item) => item.querySelector('.work-title')?.textContent.trim() || '';
        const target = items.find(item => titleOf(item) === title)
            || items.find(item => {
                const t = titleOf(item);
                return t && title.startsWith(t);
            });
        if (target) target.click();
    });
})();
