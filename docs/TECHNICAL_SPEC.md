# 技術仕様

**最終更新**: 2026年1月

---

## 📁 ファイル構成

```
mememiya-website/
├── index.html              # メインページ
├── contact.html            # お問い合わせページ
├── CNAME                   # カスタムドメイン設定
│
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages自動デプロイ
│
├── assets/
│   ├── css/
│   │   ├── style.css       # メインCSS（モジュールインポート）
│   │   └── modules/        # CSSモジュール（20ファイル）
│   │       ├── variables.css
│   │       ├── base.css
│   │       ├── navigation.css
│   │       ├── hero.css
│   │       ├── works.css
│   │       ├── works-modal.css
│   │       └── ...
│   │
│   ├── js/
│   │   ├── script.js           # UI・インタラクション
│   │   ├── background.js       # WebGLシェーダー背景
│   │   ├── works-data.js       # 作品データ
│   │   ├── works-render.js     # 作品グリッド・フィルター
│   │   ├── featured-works.js   # 注目作品ID定義
│   │   ├── vj-events-data.js   # VJイベント履歴
│   │   └── information-data.js # お知らせデータ
│   │
│   ├── images/
│   │   ├── thumbnails/     # 作品サムネイル
│   │   ├── subImage/       # ギャラリー画像
│   │   ├── flyers/         # イベントフライヤー
│   │   ├── ogp/            # OGP画像
│   │   ├── favicon/        # ファビコン
│   │   ├── logo/           # SNSロゴ等
│   │   └── fallback/       # フォールバック画像
│   │
│   └── videos/
│       └── hero-video_03.mp4   # ヒーロー背景動画
│
└── docs/                   # ドキュメント
```

---

## 🖥️ 技術スタック

- **HTML5** - セマンティックマークアップ
- **CSS3** - CSS変数、Flexbox、Grid、モジュール分割
- **JavaScript (ES6+)** - バニラJS、WebGL、Intersection Observer
- **WebGL** - レイマーチングシェーダー背景

---

## 🎨 background.js

### WebGLレイマーチング背景

```javascript
// レイマーチング手法で3Dワイヤーフレームを描画
// - 立方体、球体、トーラス、八面体
// - パースペクティブグリッド
// - 中央スポットライト効果
// - 自動回転カメラ
```

**主要機能:**
- SDF (Signed Distance Function)
- ワイヤーフレーム検出
- フォグ効果
- ビネット効果

---

## 🎯 script.js

### UIインタラクション

```javascript
// スクロールアニメーション
// - Intersection Observer
// - フェードイン効果

// ナビゲーション
// - スムーズスクロール
// - モバイルメニュー
// - 目次ナビゲーション連動

// モーダル
// - 作品詳細表示
// - ギャラリー表示
// - YouTube埋め込み

// OGP取得
// - 外部リンクのプレビュー
// - キャッシュ機能
```

---

## 📐 CSSモジュール

### モジュール一覧

| ファイル | 役割 |
|---------|------|
| variables.css | デザイントークン（色、スペーシング） |
| base.css | ベーススタイル、リセット |
| navigation.css | ナビゲーションバー |
| hero.css | ヒーローセクション |
| profile.css | プロフィールセクション |
| works.css | 作品グリッド |
| works-filters.css | フィルター機能 |
| works-modal.css | 作品モーダル |
| modal-gallery.css | ギャラリーモーダル |
| vj-events.css | VJイベントセクション |
| links-contact.css | リンク・連絡先 |
| services.css | サービス一覧 |
| footer.css | フッター |
| buttons.css | ボタンスタイル |
| animations.css | アニメーション |
| table-of-contents.css | 目次ナビゲーション |

---

## 🚀 パフォーマンス最適化

### 実装済み

- **rel="preconnect"** - Google Fonts、YouTube
- **rel="dns-prefetch"** - 外部ドメイン
- **loading="lazy"** - 画像遅延読み込み
- **CSS/JSバージョニング** - キャッシュ無効化（?v=30）
- **WebGL** - GPU加速された背景描画
- **requestAnimationFrame** - 60 FPS維持
- **Intersection Observer** - 遅延アニメーション

### 目標値

- FPS: 60
- 初回描画: <1秒
- ページサイズ: <5MB（動画含む）

---

## 🌐 ブラウザ互換性

| 機能 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| WebGL | ✅ 90+ | ✅ 88+ | ✅ 14+ | ✅ 90+ |
| Intersection Observer | ✅ 51+ | ✅ 55+ | ✅ 12+ | ✅ 79+ |
| CSS Variables | ✅ 49+ | ✅ 31+ | ✅ 9+ | ✅ 79+ |
| CSS Grid | ✅ 57+ | ✅ 52+ | ✅ 10+ | ✅ 79+ |

---

## 🔧 開発

### ローカルサーバー

```bash
python -m http.server 8000
# http://localhost:8000 にアクセス
```

### デプロイ

mainブランチへpushすると、GitHub Actionsが自動でGitHub Pagesにデプロイ。

```bash
git add .
git commit -m "コミットメッセージ"
git push origin main
```

---

## 📋 SEO対応

- メタタグ（description, keywords, author）
- OGP（Open Graph Protocol）
- Twitter Card
- Schema.org構造化データ（JSON-LD）
- robots meta（index, follow）

---

**制作**: MEMEMIYA
