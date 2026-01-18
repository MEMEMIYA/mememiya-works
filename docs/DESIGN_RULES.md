# デザイン規約

**最終更新**: 2025年1月
**デザインコンセプト**: ミニマリスト・ダークパープルデザインシステム

---

## 🎨 カラーシステム

### ベースカラー
```css
--color-bg: #000000;              /* 純黒背景 */
--color-text-primary: #FFFFFF;    /* 見出し・メインテキスト */
--color-text-secondary: #CCCCCC;  /* 本文 */
--color-text-tertiary: #999999;   /* 補助テキスト */
```

### アクセントカラー（パープル系）
```css
--color-purple-primary: #9B7EDE;    /* メインパープル */
--color-purple-secondary: #C4B5FD;  /* ライトパープル */
--color-purple-tertiary: #7C61C4;   /* ダークパープル */
```

### ボーダーカラー
```css
border: solid 2px #FFF;                      /* 太ボーダー */
border: solid 1px rgba(255, 255, 255, 0.12); /* 細ボーダー */
```

### 使用ルール
✅ **ブラック背景**: 常に#000000を維持
✅ **パープルアクセント**: CTA、アクティブ状態、グラデーション
❌ **カラフルなカラー**: ミニマリストコンセプトのため使用禁止

---

## 📝 タイポグラフィ

### フォントファミリー
```css
/* 本文 */
font-family: 'Noto Sans JP', 'Helvetica Neue', sans-serif;

/* モノスペース（日付・メタ情報） */
font-family: 'Azeret Mono', monospace;
```

### フォントサイズ（1.25倍率スケール）
```css
--text-xs: 0.8rem;      /* 12.8px - タグ */
--text-sm: 0.875rem;    /* 14px - 小説明 */
--text-base: 1rem;      /* 16px - 本文 */
--text-lg: 1.125rem;    /* 18px - サブ見出し */
--text-xl: 1.25rem;     /* 20px - 中見出し */
--text-2xl: 1.563rem;   /* 25px - 大見出し */
--text-3xl: 1.953rem;   /* 31.25px - セクションタイトル */
```

### タイポグラフィルール
```css
font-weight: 600;        /* 標準 */
font-weight: 700;        /* 強調 */
letter-spacing: .04em;   /* 標準字間 */
letter-spacing: .02em;   /* タイトル字間 */
line-height: 1.2;        /* 見出し */
line-height: 1.6;        /* 本文 */
```

---

## 🔲 スペーシングシステム

### 8pxグリッドベース
```css
--space-1: 0.5rem;    /* 8px */
--space-2: 1rem;      /* 16px */
--space-3: 1.5rem;    /* 24px */
--space-4: 2rem;      /* 32px */
--space-6: 3rem;      /* 48px */
--space-8: 4rem;      /* 64px */
--space-12: 6rem;     /* 96px */
```

### 使用例
- カード内パディング: `--space-3` または `--space-4`
- グリッドギャップ: `--space-2`
- セクション間隔: `--space-8`

---

## 🎭 トランジション

### トランジション速度
```css
--transition-fast: 150ms;   /* ホバー */
--transition-base: 300ms;   /* 標準 */
--transition-slow: 450ms;   /* モーダル */
```

### イージング
```css
--ease-out-cubic: cubic-bezier(0.33, 1, 0.68, 1);  /* 標準 */
```

---

## 🔄 ホバーエフェクト

### ⚠️ 重要原則
**クリック可能な要素のみホバー効果を適用**

### 適用対象
✅ ボタン、リンク
✅ クリック可能なカード（モーダル表示など）
✅ フィルターボタン

❌ 装飾タグ（`.tag`）
❌ 静的なカード
❌ テキストのみ

### 🚫 禁止エフェクト
**グロー効果（box-shadow）は全面禁止**
- ❌ `box-shadow: 0 8px 32px rgba(155, 126, 222, 0.3);`
- ❌ `box-shadow` を使った光る演出全般
- ❌ ドロップシャドウ全般

**理由**: ミニマリストデザインコンセプトに反するため

### パターン1: カード（translateY）
```css
.work-item {
    border: solid 1px rgba(255, 255, 255, 0.12);
    transition: all var(--transition-base);
}
.work-item:hover {
    border-color: var(--color-purple-primary);
    transform: translateY(-4px);
}
```

### パターン2: ボタン（グラデーション反転）
```css
.btn-primary {
    background: linear-gradient(135deg,
        var(--color-purple-primary),
        var(--color-purple-tertiary)
    );
}
.btn-primary:hover {
    transform: translateY(-2px);
}
```

### パターン3: リンク（カラー変更）
```css
.nav-link {
    color: var(--color-text-secondary);
    transition: color var(--transition-base);
}
.nav-link:hover {
    color: var(--color-purple-secondary);
}
```

---

## ✅ 実装チェックリスト

新しいコンポーネント追加時の確認項目:

### デザイン
- [ ] CSS変数を使用している（`var(--color-purple-primary)`など）
- [ ] フォントサイズは統一スケールに従っている
- [ ] スペーシングは8pxベースのシステムに従っている
- [ ] トランジションは`var(--transition-base)`を使用

### カラー
- [ ] 背景は常に`#000000`
- [ ] アクセントは`--color-purple-*`を使用
- [ ] ジャンル別カラーを適切に使用（タグなど）

### ホバー効果
- [ ] クリック可能な要素のみホバー効果を適用
- [ ] `translateY(-4px)`または`translateY(-2px)`を使用
- [ ] トランジションは`300ms`

### タイポグラフィ
- [ ] `font-weight: 600`または`700`
- [ ] `letter-spacing: .02em`または`.04em`
- [ ] 行間は用途に応じて適切に設定

### アクセシビリティ
- [ ] 十分なカラーコントラスト（WCAG AA準拠）
- [ ] 画像に`alt`属性
- [ ] `aria-label`を適切に使用

---

**最終更新**: 2025年1月
