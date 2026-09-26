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

// 実績が3件未満のカードは、空きスロットを黒いプレースホルダーで埋める
(function () {
    const SLOTS = 3;
    document.querySelectorAll('.solution-works-list').forEach(list => {
        for (let i = list.children.length; i < SLOTS; i++) {
            const li = document.createElement('li');
            li.className = 'solution-work-empty';
            li.setAttribute('aria-hidden', 'true');
            li.innerHTML = '<span class="solution-work-thumb-empty"></span>';
            list.appendChild(li);
        }
    });
})();
