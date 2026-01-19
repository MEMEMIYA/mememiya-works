// ===========================
// Work Detail Modal
// ===========================

function initWorkModals() {
    // Create modal element if it doesn't exist
    let modal = document.getElementById('workModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'workModal';
        modal.className = 'work-modal';
        modal.innerHTML = `
            <button class="work-modal-close" aria-label="Close modal">×</button>
            <button class="work-modal-scroll-top" aria-label="Scroll to top">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <div class="work-modal-content">
                <div class="work-modal-category"></div>
                <div class="work-modal-header">
                    <h2 class="work-modal-title"></h2>
                    <div class="work-modal-info-grid">
                        <div class="work-modal-info-left">
                            <div class="work-modal-meta"></div>
                            <div class="work-modal-tags"></div>
                        </div>
                        <div class="work-modal-thumbnail"></div>
                    </div>
                </div>
                <div class="work-modal-description"></div>
                <div class="work-modal-media"></div>
                <div class="work-modal-gallery-grid"></div>
                <div class="work-modal-blog"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const closeBtn = modal.querySelector('.work-modal-close');
    const scrollTopBtn = modal.querySelector('.work-modal-scroll-top');
    const modalContent = modal.querySelector('.work-modal-content');

    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';

        // Clear content and reset styles
        const mediaContainer = modal.querySelector('.work-modal-media');
        const galleryGrid = modal.querySelector('.work-modal-gallery-grid');
        const modalContent = modal.querySelector('.work-modal-content');
        const categoryContainer = modal.querySelector('.work-modal-category');
        const headerContainer = modal.querySelector('.work-modal-header');
        const descriptionContainer = modal.querySelector('.work-modal-description');
        const blogContainer = modal.querySelector('.work-modal-blog');

        mediaContainer.innerHTML = '';
        galleryGrid.innerHTML = '';

        // Reset classes and inline styles to CSS defaults
        mediaContainer.classList.remove('single-flyer-mode');
        modalContent.classList.remove('single-flyer-container');
        galleryGrid.classList.remove('vj-works-gallery');
        mediaContainer.style.display = '';
        mediaContainer.style.aspectRatio = '';
        mediaContainer.style.maxHeight = '';
        mediaContainer.style.background = '';
        mediaContainer.style.alignItems = '';
        mediaContainer.style.justifyContent = '';
        galleryGrid.style.display = '';

        // Reset all modal content containers
        if (categoryContainer) {
            categoryContainer.textContent = '';
            categoryContainer.style.display = '';
        }
        if (headerContainer) {
            headerContainer.style.display = '';
        }
        if (descriptionContainer) {
            descriptionContainer.innerHTML = '';
            descriptionContainer.style.display = '';
        }
        if (blogContainer) {
            blogContainer.innerHTML = '';
            blogContainer.style.display = '';
        }

        // Reset scroll position and hide scroll top button
        modalContent.scrollTop = 0;
        scrollTopBtn.classList.remove('visible');
    }

    // Scroll to top button functionality
    scrollTopBtn.addEventListener('click', () => {
        modalContent.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Show/hide scroll to top button based on scroll position
    modalContent.addEventListener('scroll', () => {
        if (modalContent.scrollTop > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Close button
    closeBtn.addEventListener('click', closeModal);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // イベント委譲を使用（動的に追加された要素にも対応）
    document.addEventListener('click', (e) => {
        const item = e.target.closest('.work-item, .featured-work-card, .event-card, .event-item-compact, .video-work-card');
        if (!item) return;


        // Get work data from the clicked item or from data source
        const title = item.querySelector('.work-title, .featured-title, .event-title, .event-title-compact, .video-title')?.textContent || 'Work Title';
        let year = item.querySelector('.work-year, .featured-year, .event-date, .event-date-compact, .video-year')?.textContent || '';

        // For featured works, get description from data source
        let description = item.querySelector('.work-description, .featured-description, .event-desc, .video-description')?.textContent || '';
        let tags = Array.from(item.querySelectorAll('.work-tag, .featured-tags .tag, .video-tools .tool-tag')).map(tag => tag.textContent);
        let metaData = null;
        let blogUrls = null;
        let categories = [];
        let yearMonth = null; // モーダル用の年月データ

        // If this is a featured work card, get data from worksData.featured
        if (item.classList.contains('featured-work-card') && typeof worksData !== 'undefined' && worksData.featured) {
            const workData = worksData.featured.find(work => work.title === title);
            if (workData) {
                description = workData.description || description;
                tags = workData.tags || tags;
                metaData = workData.meta || null;
                categories = workData.categories || [];
                yearMonth = workData.yearMonth || null; // 年月データを取得
                // blogUrl(旧形式)とblogUrls(新形式)の両方に対応
                blogUrls = workData.blogUrls || (workData.blogUrl ? [workData.blogUrl] : null);
            }
        }

        // If this is an all works card, get data from worksData.all
        if (item.classList.contains('work-item') && typeof worksData !== 'undefined' && worksData.all) {
            const workData = worksData.all.find(work => work.title === title);
            if (workData) {
                description = workData.description || description;
                tags = workData.tags || tags;
                metaData = workData.meta || null;
                categories = workData.categories || [];
                yearMonth = workData.yearMonth || null; // 年月データを取得
                // blogUrl(旧形式)とblogUrls(新形式)の両方に対応
                blogUrls = workData.blogUrls || (workData.blogUrl ? [workData.blogUrl] : null);
            }
        }

        // モーダルで表示する年は yearMonth を優先
        const displayYear = yearMonth || year;

        // Get media (YouTube, image, or multiple images)
        const mediaContainer = modal.querySelector('.work-modal-media');
        const galleryGrid = modal.querySelector('.work-modal-gallery-grid');
        const youtubeData = item.dataset.youtube;
        const img = item.querySelector('.work-thumbnail, .featured-image, .event-flyer img, .event-thumb-compact img');
        const video = item.querySelector('.featured-video, .hero-video');
        const iframe = item.querySelector('iframe');

        // Check for data-gallery attribute for multiple images
        const galleryData = item.dataset.gallery;


        mediaContainer.innerHTML = '';
        galleryGrid.innerHTML = '';
        mediaContainer.style.display = 'none';
        galleryGrid.style.display = 'none';

        // VJ Worksのフライヤー画像（縦長）かどうかを判定
        const isVJWork = item.classList.contains('event-item-compact');
        const hasFlyerImage = (galleryData && galleryData.includes('/flyers/')) ||
                               (img && (img.src.includes('/flyers/') || img.src.includes('/fallback/')));

        // YouTube video handling - 複数対応
        if (youtubeData) {
            mediaContainer.style.display = 'block';

            // 以前のshorts-modeクラスをクリア
            mediaContainer.classList.remove('shorts-mode');

            // カンマ区切りで複数のYouTube IDに対応
            const youtubeIds = youtubeData.split(',').map(id => id.trim());

            // 複数の動画がある場合は縦に並べる
            if (youtubeIds.length > 1) {
                mediaContainer.style.position = 'relative';
                mediaContainer.style.height = 'auto';
                mediaContainer.style.aspectRatio = 'unset';
            }

            youtubeIds.forEach((youtubeId, index) => {
                // YouTubeショート対応: URLから動画IDを抽出
                let videoId = youtubeId;
                let isShorts = false;

                // フルURLの場合、IDを抽出
                if (youtubeId.includes('youtube.com') || youtubeId.includes('youtu.be')) {
                    // youtube.com/shorts/XXXXX の形式
                    const shortsMatch = youtubeId.match(/shorts\/([a-zA-Z0-9_-]+)/);
                    // youtu.be/XXXXX の形式
                    const youtubeMatch = youtubeId.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
                    // youtube.com/watch?v=XXXXX の形式
                    const watchMatch = youtubeId.match(/[?&]v=([a-zA-Z0-9_-]+)/);

                    if (shortsMatch) {
                        videoId = shortsMatch[1];
                        isShorts = true;
                    } else if (youtubeMatch) {
                        videoId = youtubeMatch[1];
                    } else if (watchMatch) {
                        videoId = watchMatch[1];
                    }
                }

                // ショート動画の場合はクラスを追加
                if (isShorts) {
                    mediaContainer.classList.add('shorts-mode');
                }

                // 動画の埋め込み
                const youtubeEmbed = document.createElement('iframe');
                youtubeEmbed.src = `https://www.youtube.com/embed/${videoId}`;
                youtubeEmbed.title = `${title}${youtubeIds.length > 1 ? ` - Video ${index + 1}` : ''}`;
                youtubeEmbed.setAttribute('frameborder', '0');
                youtubeEmbed.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                youtubeEmbed.allowFullscreen = true;

                if (!isShorts && youtubeIds.length === 1) {
                    // 通常の動画で1つの場合のみ絶対配置
                    youtubeEmbed.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;';
                    mediaContainer.appendChild(youtubeEmbed);
                } else if (youtubeIds.length > 1) {
                    // 複数動画の場合はラッパーで包む
                    const videoWrapper = document.createElement('div');
                    videoWrapper.style.cssText = 'position: relative; width: 100%; padding-bottom: 56.25%; margin-bottom: 20px;';
                    youtubeEmbed.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;';
                    videoWrapper.appendChild(youtubeEmbed);
                    mediaContainer.appendChild(videoWrapper);
                } else {
                    // ショート動画
                    youtubeEmbed.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;';
                    mediaContainer.appendChild(youtubeEmbed);
                }
            });
        }

        // ========================================
        // VJ Works と All Works のモーダル仕様を分離
        // ========================================
        const headerContainer = modal.querySelector('.work-modal-header');
        const descriptionContainer = modal.querySelector('.work-modal-description');
        const blogContainer = modal.querySelector('.work-modal-blog');

        if (isVJWork) {
            // ========================================
            // VJ Works専用モーダル: フライヤー画像のみ表示
            // ========================================
            headerContainer.style.display = 'none';
            descriptionContainer.style.display = 'none';
            blogContainer.style.display = 'none';

            const allImages = [];

            // パスを正規化する関数（重複チェック用）
            const normalizePath = (path) => {
                // URLの場合はpathnameを取得、相対パスの場合はそのまま
                const normalized = path.includes('://') ? new URL(path).pathname : path;
                // 先頭のスラッシュを削除
                let cleaned = normalized.replace(/^\/+/, '');
                // URLデコードして、小文字に変換
                try {
                    cleaned = decodeURIComponent(cleaned);
                } catch (e) {
                    // デコードに失敗した場合はそのまま使用
                }
                return cleaned.toLowerCase();
            };

            // サムネイル画像を追加
            if (img) {
                const normalizedPath = normalizePath(img.src);
                allImages.push({ src: img.src, normalizedPath: normalizedPath });
            }

            // ギャラリー画像を追加（サムネイルと重複する場合は除外）
            if (galleryData) {
                const galleryImages = galleryData.split(',').map(url => url.trim());
                const imageUrls = galleryImages.filter(url => !url.includes('youtube.com') && !url.includes('youtu.be'));
                imageUrls.forEach(imgUrl => {
                    const normalizedPath = normalizePath(imgUrl);
                    // サムネイルと同じ画像は追加しない（正規化されたパスで比較）
                    const isDuplicate = allImages.some(img => img.normalizedPath === normalizedPath);
                    if (!isDuplicate) {
                        allImages.push({ src: imgUrl, normalizedPath: normalizedPath });
                    }
                });
            }

            // 画像が1枚の場合は中央に大きく表示、複数の場合は折り返し表示
            if (allImages.length === 1) {
                // 1枚の場合: メインエリアに大きく表示（縦長フライヤー用に最適化）
                // モーダルコンテンツコンテナの幅制限を解除
                const modalContent = modal.querySelector('.work-modal-content');
                modalContent.classList.add('single-flyer-container');

                mediaContainer.style.display = 'block';
                mediaContainer.classList.add('single-flyer-mode');

                const imgClone = document.createElement('img');
                imgClone.src = allImages[0].src;
                imgClone.alt = title;
                imgClone.className = 'single-flyer-image';

                // インラインスタイルは削除 - CSSに完全に任せる
                mediaContainer.appendChild(imgClone);
            } else if (allImages.length > 1) {
                // 複数の場合: 折り返し表示（VJ Worksの縦長フライヤー用）
                galleryGrid.classList.add('vj-works-gallery');
                galleryGrid.style.display = 'flex';

                allImages.forEach((img, index) => {
                    const imgWrapper = document.createElement('div');
                    imgWrapper.className = 'gallery-grid-item';

                    const imgElement = document.createElement('img');
                    imgElement.src = img.src;
                    imgElement.alt = `${title} - Image ${index + 1}`;
                    imgElement.loading = 'lazy';

                    imgWrapper.appendChild(imgElement);
                    galleryGrid.appendChild(imgWrapper);
                });
            }
        }
        // ========================================
        // All Works専用モーダル: 通常のモーダル表示
        // ========================================
        else {
            // Multiple images gallery
            if (galleryData) {
                const galleryImages = galleryData.split(',').map(url => url.trim());
                const imageUrls = galleryImages.filter(url => !url.includes('youtube.com') && !url.includes('youtu.be'));

                if (imageUrls.length > 0) {
                    galleryGrid.style.display = 'grid';

                    // 画像を追加しながら、アスペクト比を判定
                    const imageElements = [];
                    let loadedCount = 0;

                    imageUrls.forEach((imgUrl, index) => {
                        const imgWrapper = document.createElement('div');
                        imgWrapper.className = 'gallery-grid-item';

                        const imgElement = document.createElement('img');
                        imgElement.src = imgUrl;
                        imgElement.alt = `${title} - Image ${index + 1}`;
                        imgElement.loading = 'lazy';

                        // 画像読み込み後にアスペクト比を判定
                        imgElement.onload = function() {
                            loadedCount++;
                            const aspectRatio = this.naturalWidth / this.naturalHeight;
                            imageElements.push({ element: this, ratio: aspectRatio });

                            // 全ての画像が読み込まれたら、レイアウトを決定
                            if (loadedCount === imageUrls.length) {
                                // 16:9 (1.777...) に近いかどうかを判定（許容範囲: 1.6〜1.9）
                                const is16by9 = (ratio) => ratio >= 1.6 && ratio <= 1.9;
                                const non16by9Count = imageElements.filter(img => !is16by9(img.ratio)).length;

                                // 16:9以外の画像がある場合は、縦並びレイアウト
                                if (non16by9Count > 0) {
                                    galleryGrid.style.display = 'flex';
                                    galleryGrid.style.flexDirection = 'column';
                                    galleryGrid.style.alignItems = 'center';
                                } else {
                                    // 全て16:9の場合は2カラムグリッド
                                    galleryGrid.style.display = 'grid';
                                    galleryGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(min(400px, 100%), 1fr))';
                                }
                            }
                        };

                        imgWrapper.appendChild(imgElement);
                        galleryGrid.appendChild(imgWrapper);
                    });
                }
            }

            // Embedded iframe (only if no YouTube)
            if (!youtubeData && iframe) {
                mediaContainer.style.display = 'block';
                const iframeClone = iframe.cloneNode(true);
                mediaContainer.appendChild(iframeClone);
            }
            // Video element
            else if (!youtubeData && video) {
                mediaContainer.style.display = 'block';
                const videoClone = video.cloneNode(true);
                videoClone.controls = true;
                mediaContainer.appendChild(videoClone);
            }
            // Single image - アスペクト比自動判定
            else if (!youtubeData && img && !galleryData) {
                mediaContainer.style.display = 'block';
                const imgClone = document.createElement('img');
                imgClone.src = img.src;
                imgClone.alt = title;
                imgClone.style.cursor = 'default';
                imgClone.style.pointerEvents = 'none';

                // 画像読み込み後にアスペクト比を判定
                imgClone.onload = function() {
                    const aspectRatio = this.naturalWidth / this.naturalHeight;
                    const modalContent = modal.querySelector('.work-modal-content');

                    // 縦長画像（ポートレート）の場合
                    if (aspectRatio < 0.8) {
                        modalContent.classList.add('single-flyer-container');
                        mediaContainer.classList.add('single-flyer-mode');
                        this.className = 'single-flyer-image';
                    }
                    // 横長画像（ランドスケープ）の場合
                    else {
                        // デフォルトの16:9表示のまま
                        mediaContainer.style.aspectRatio = '16 / 9';
                    }
                };

                mediaContainer.appendChild(imgClone);
            }
        }

        // ========================================
        // モーダルコンテンツの表示/非表示制御
        // ========================================
        if (isVJWork && hasFlyerImage) {
            // VJ Works: 画像のみ表示（既にheaderContainer等は非表示済み）
            // 追加の処理は不要
        } else {
            // All Works: 通常のモーダル表示
            headerContainer.style.display = 'block';

            // Populate modal content
            modal.querySelector('.work-modal-title').textContent = title;

            // 説明文の表示
            if (description) {
                descriptionContainer.innerHTML = `<p>${description}</p>`;
                descriptionContainer.style.display = 'block';
            } else {
                descriptionContainer.innerHTML = '';
                descriptionContainer.style.display = 'none';
            }

            // Populate meta
            const metaContainer = modal.querySelector('.work-modal-meta');

            // カテゴリの日本語マッピング
            const categoryLabels = {
                'live': 'ジェネVJ',
                'vr': 'VR',
                'event': 'イベント',
                'vj': 'VJ',
                'mv': 'MV',
                'Interactive': 'インタラクティブ',
                'TouchDesigner': 'TouchDesigner',
                'Kinect': 'Kinect',
                'kinect': 'Kinect',
                '3dcg': '3DCG',
                'webar': 'WebAR'
            };

            // メタラベルの日本語マッピング
            const metaLabelTranslations = {
                'duration': '制作期間',
                'tools': '使用ツール',
                'tech': '技術',
                'role': '担当',
                'client': 'クライアント',
                'year': '制作年'
            };

            // カテゴリを日本語に変換して左上に表示
            const categoryText = categories.length > 0
                ? categories.map(cat => categoryLabels[cat] || cat).join(' / ')
                : '';

            let categoryContainer = modal.querySelector('.work-modal-category');

            // カテゴリー要素が存在しない場合は再作成
            if (!categoryContainer) {
                categoryContainer = document.createElement('div');
                categoryContainer.className = 'work-modal-category';
                const modalContent = modal.querySelector('.work-modal-content');
                modalContent.insertAdjacentElement('afterbegin', categoryContainer);
            }

            // VJ Worksの場合はカテゴリー要素を削除
            if (isVJWork) {
                if (categoryContainer) {
                    categoryContainer.remove();
                }
            } else if (categoryText) {
                // カテゴリをスラッシュで分割
                const categoryArray = categories.map(cat => categoryLabels[cat] || cat);

                if (categoryArray.length > 0) {
                    // 最初のカテゴリのみ表示
                    const firstCategory = `<span class="category-main">${categoryArray[0]}</span>`;
                    categoryContainer.innerHTML = firstCategory;
                } else {
                    categoryContainer.textContent = categoryText;
                }
                categoryContainer.style.display = 'block';
            } else {
                categoryContainer.style.display = 'none';
            }

            let metaHTML = '';

            // 制作年を単独で1行目、制作期間と制作形態を2行目に横並び
            let yearItem = null;
            const secondRowItems = []; // 制作期間、制作形態
            const otherMetaItems = [];

            // Year (モーダル用のdisplayYearを使用)
            if (displayYear) {
                yearItem = {
                    label: '制作年',
                    value: displayYear
                };
            }

            // Duration と 制作形態 を metaData から抽出
            if (metaData) {
                Object.entries(metaData).forEach(([label, value]) => {
                    const japaneseLabel = metaLabelTranslations[label.toLowerCase()] || label;
                    const lowerLabel = label.toLowerCase();

                    if (lowerLabel === 'duration') {
                        secondRowItems.push({
                            label: japaneseLabel,
                            value: value
                        });
                    } else if (japaneseLabel === '制作形態') {
                        secondRowItems.push({
                            label: japaneseLabel,
                            value: value
                        });
                    } else {
                        otherMetaItems.push({
                            label: japaneseLabel,
                            value: value
                        });
                    }
                });
            }

            // 全角スペース区切りの値をタグ化する関数
            const formatMetaValue = (value) => {
                // 全角スペースで区切られている場合はタグ化
                if (value.includes('　')) {
                    const tags = value.split('　').filter(tag => tag.trim());
                    if (tags.length > 1) {
                        const tagsHTML = tags.map(tag => `<span class="meta-tag">${tag}</span>`).join('');
                        return `<span class="work-modal-meta-value has-tags">${tagsHTML}</span>`;
                    }
                }
                return `<span class="work-modal-meta-value">${value}</span>`;
            };

            // 1行目: 制作年（単独）
            if (yearItem) {
                metaHTML += `
                    <div class="work-modal-meta-item">
                        <span class="work-modal-meta-label">${yearItem.label}</span>
                        ${formatMetaValue(yearItem.value)}
                    </div>
                `;
            }

            // 2行目: 制作期間と制作形態（横並び）
            if (secondRowItems.length > 0) {
                metaHTML += '<div class="work-modal-meta-row">';
                secondRowItems.forEach(item => {
                    metaHTML += `
                        <div class="work-modal-meta-item">
                            <span class="work-modal-meta-label">${item.label}</span>
                            ${formatMetaValue(item.value)}
                        </div>
                    `;
                });
                metaHTML += '</div>';
            }

            // その他のメタ情報を通常通り表示
            otherMetaItems.forEach(item => {
                metaHTML += `
                    <div class="work-modal-meta-item">
                        <span class="work-modal-meta-label">${item.label}</span>
                        ${formatMetaValue(item.value)}
                    </div>
                `;
            });

            metaContainer.innerHTML = metaHTML;

            // Populate tags
            const tagsContainer = modal.querySelector('.work-modal-tags');
            tagsContainer.innerHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join('');

            // Populate thumbnail if available (常に表示、一番最後)
            const thumbnailContainer = modal.querySelector('.work-modal-thumbnail');

            // 前のサムネイルの高さをリセット
            thumbnailContainer.style.height = '';

            if (img) {
                thumbnailContainer.classList.add('active');
                const thumbnailImg = document.createElement('img');
                thumbnailImg.src = img.src;
                thumbnailImg.alt = title;
                thumbnailImg.className = 'work-modal-thumbnail-image';
                thumbnailImg.style.height = '';
                thumbnailContainer.innerHTML = '';
                thumbnailContainer.appendChild(thumbnailImg);
            } else {
                thumbnailContainer.innerHTML = '';
                thumbnailContainer.classList.remove('active');
            }

            // Populate blog links if available (複数対応)
            if (blogUrls && blogUrls.length > 0) {
                blogContainer.style.display = 'block';

                // スケルトンスクリーンを表示
                const skeletonHTML = blogUrls.map(() => `
                    <div class="blog-card-skeleton">
                        <div class="blog-card-skeleton-image">
                            <div class="blog-card-skeleton-icon">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor"/>
                                </svg>
                            </div>
                        </div>
                        <div class="blog-card-skeleton-content">
                            <div class="blog-card-skeleton-platform">
                                <span class="blog-skeleton-label">ブログ記事</span>
                            </div>
                            <div class="blog-card-skeleton-title"></div>
                            <div class="blog-card-skeleton-description"></div>
                            <div class="blog-card-skeleton-description short"></div>
                            <div class="blog-card-skeleton-link"></div>
                        </div>
                    </div>
                `).join('');
                blogContainer.innerHTML = skeletonHTML;

                // プラットフォーム判定
                const getPlatform = (url) => {
                    if (url.includes('note.com')) return 'note';
                    if (url.includes('qiita.com')) return 'Qiita';
                    if (url.includes('zenn.dev')) return 'Zenn';
                    return '記事';
                };

                // ブログカードをレンダリング
                const renderBlogCards = async () => {
                    const cardsHTML = await Promise.all(blogUrls.map(async (item) => {
                        // 文字列かオブジェクトかを判定
                        const isManual = typeof item === 'object' && item.url;
                        const url = isManual ? item.url : item;
                        const platform = getPlatform(url);

                        let title, description, image;

                        if (isManual && item.title && item.description && item.image) {
                            // 手動OGP情報が完全に提供されている場合は即座に使用
                            title = item.title;
                            description = item.description;
                            image = item.image;
                        } else if (isManual && (item.title || item.description)) {
                            // タイトルまたは説明のみ提供されている場合、画像は自動取得
                            title = item.title || `${platform}の記事`;
                            description = item.description || 'この作品について詳しく解説しています';
                            const ogp = await fetchOGP(url);
                            image = ogp.image || '';
                        } else {
                            // 手動OGP情報がない場合は完全に自動取得
                            const ogp = await fetchOGP(url);
                            title = ogp.title || `${platform}の記事`;
                            description = ogp.description || 'この作品について詳しく解説しています';
                            image = ogp.image || '';
                        }

                        // HTMLエンティティをエスケープ（テキストコンテンツ用）
                        const escapeHtml = (str) => {
                            const div = document.createElement('div');
                            div.textContent = str;
                            return div.innerHTML;
                        };

                        // 画像HTML（imgタグを使用してブラウザに自動デコードさせる）
                        const imageHTML = image ? `<div class="blog-card-image"><img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="lazy"></div>` : '';

                        return `
                            <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="blog-card">
                                ${imageHTML}
                                <div class="blog-card-content">
                                    <div class="blog-card-platform">${platform}</div>
                                    <h3 class="blog-card-title">${title}</h3>
                                    <p class="blog-card-description">${description}</p>
                                    <span class="blog-card-link">
                                        記事を読む
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                            <polyline points="15 3 21 3 21 9"></polyline>
                                            <line x1="10" y1="14" x2="21" y2="3"></line>
                                        </svg>
                                    </span>
                                </div>
                            </a>
                        `;
                    }));

                    blogContainer.innerHTML = cardsHTML.join('');
                };

                renderBlogCards();
            } else {
                blogContainer.innerHTML = '';
                blogContainer.style.display = 'none';
            }
        }

        // モーダルを一時的に表示して高さを計算（opacity: 0で非表示のまま）
        modal.style.opacity = '0';
        modal.style.visibility = 'visible';
        modal.classList.add('active');

        // サムネイルの高さをメタデータに合わせる
        const infoLeft = modal.querySelector('.work-modal-info-left');
        const thumbnailContainer = modal.querySelector('.work-modal-thumbnail');
        const thumbnailImg = modal.querySelector('.work-modal-thumbnail-image');

        if (infoLeft && thumbnailContainer && thumbnailContainer.classList.contains('active')) {
            // サムネイルを一旦非表示にしてメタデータの高さを取得
            thumbnailContainer.style.display = 'none';
            modal.offsetHeight; // reflow強制
            const height = infoLeft.offsetHeight;

            // サムネイルを再表示して高さを設定
            thumbnailContainer.style.display = 'block';
            if (height > 0) {
                thumbnailContainer.style.height = `${height}px`;
                if (thumbnailImg) {
                    thumbnailImg.style.height = `${height}px`;
                }
            }
        }

        // 次のフレームでモーダルを実際に表示
        requestAnimationFrame(() => {
            modal.style.opacity = '';
            modal.style.visibility = '';
            document.body.style.overflow = 'hidden';
        });
    });
}

// Initialize modals when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWorkModals);
} else {
    initWorkModals();
}
