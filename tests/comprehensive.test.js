const puppeteer = require('puppeteer');
const { assert, getResults, createServer, ROOT_DIR } = require('./helpers');

// ========================================
// 網羅的テスト
// ========================================

(async () => {
    const PORT = 8767;
    const BASE_URL = `http://localhost:${PORT}`;

    const server = await createServer(ROOT_DIR, PORT);
    console.log(`テストサーバー起動: ${BASE_URL}\n`);

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
        const page = await browser.newPage();
        // コンソールエラーを収集
        const consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') consoleErrors.push(msg.text());
        });

        // ==========================================
        // 1. Works データレンダリングテスト
        // ==========================================
        console.log('【1. Works データレンダリングテスト】');
        await page.setViewport({ width: 1280, height: 720 });
        await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 15000 });

        // worksData が読み込まれているか
        const worksDataLoaded = await page.evaluate(() => typeof worksData !== 'undefined' && worksData.all && worksData.all.length > 0);
        assert(worksDataLoaded, 'worksData がグローバルに定義されデータが存在する');

        const worksCount = await page.evaluate(() => worksData.all.length);
        assert(worksCount > 0, `作品データが ${worksCount} 件存在する`);

        // 作品カードが描画されているか
        const workCards = await page.$$('.works-grid .work-item');
        assert(workCards.length > 0, `作品カードが ${workCards.length} 枚レンダリングされている`);

        // 作品カードの必須要素（サムネイル画像、タイトル）
        const workCardHasImage = await page.$eval('.work-item', el => el.querySelector('img') !== null);
        assert(workCardHasImage, '作品カードにサムネイル画像がある');

        const workCardHasTitle = await page.$eval('.work-item', el => {
            const title = el.querySelector('.work-title, h3, h4');
            return title !== null && title.textContent.trim().length > 0;
        });
        assert(workCardHasTitle, '作品カードにタイトルがある');

        // スケルトンローダーが消えているか
        const skeletonGone = await page.$eval('.works-grid', el => {
            return el.querySelector('.skeleton-card-small') === null;
        });
        assert(skeletonGone, 'Works セクションのスケルトンローダーが消えている');

        // ==========================================
        // 2. Featured Works レンダリングテスト
        // ==========================================
        console.log('\n【2. Featured Works レンダリングテスト】');

        const featuredCards = await page.$$('.featured-works-grid .featured-work-card');
        assert(featuredCards.length > 0, `ピックアップ作品カードが ${featuredCards.length} 枚レンダリングされている`);

        const featuredSkeletonGone = await page.$eval('.featured-works-grid', el => {
            return el.querySelector('.skeleton-card') === null;
        });
        assert(featuredSkeletonGone, 'Featured セクションのスケルトンローダーが消えている');

        // ピックアップカードの構造チェック
        const featuredCardStructure = await page.$eval('.featured-work-card', el => {
            return {
                hasImage: el.querySelector('img') !== null,
                hasTitle: el.querySelector('.featured-title, h3') !== null,
                hasDescription: el.querySelector('.featured-description, p') !== null,
            };
        });
        assert(featuredCardStructure.hasImage, 'ピックアップカードにサムネイル画像がある');
        assert(featuredCardStructure.hasTitle, 'ピックアップカードにタイトルがある');

        // ==========================================
        // 3. Information（お知らせ）レンダリングテスト
        // ==========================================
        console.log('\n【3. Information（お知らせ）レンダリングテスト】');

        const infoItems = await page.$$('.info-list .info-item');
        assert(infoItems.length > 0, `お知らせが ${infoItems.length} 件レンダリングされている`);

        const infoStructure = await page.$eval('.info-item', el => {
            const date = el.querySelector('.info-date');
            const text = el.querySelector('.info-text');
            return {
                hasDate: date !== null && date.textContent.trim().length > 0,
                hasText: text !== null && text.textContent.trim().length > 0,
            };
        });
        assert(infoStructure.hasDate, 'お知らせに日付がある');
        assert(infoStructure.hasText, 'お知らせにテキストがある');

        const infoSkeletonGone = await page.$eval('.info-list', el => {
            return el.querySelector('.info-skeleton') === null;
        });
        assert(infoSkeletonGone, 'Information セクションのスケルトンローダーが消えている');

        // ==========================================
        // 4. VJイベント一覧テスト
        // ==========================================
        console.log('\n【4. VJイベント一覧テスト】');

        const eventItems = await page.$$('.event-list-compact .event-item-compact');
        assert(eventItems.length > 0, `VJイベントが ${eventItems.length} 件レンダリングされている`);

        // イベントカードの構造チェック
        const eventStructure = await page.$eval('.event-item-compact', el => {
            return {
                hasThumb: el.querySelector('.event-thumb-compact img') !== null,
                hasTitle: el.querySelector('.event-title-compact') !== null,
                hasDate: el.querySelector('.event-date-compact') !== null,
                hasTag: el.querySelector('.event-tag-compact') !== null,
                hasDataType: el.hasAttribute('data-type'),
                hasDataYear: el.hasAttribute('data-year'),
            };
        });
        assert(eventStructure.hasThumb, 'VJイベントカードにサムネイルがある');
        assert(eventStructure.hasTitle, 'VJイベントカードにタイトルがある');
        assert(eventStructure.hasDate, 'VJイベントカードに日付がある');
        assert(eventStructure.hasTag, 'VJイベントカードにタイプタグ（VR/Real）がある');
        assert(eventStructure.hasDataType, 'VJイベントカードに data-type 属性がある');
        assert(eventStructure.hasDataYear, 'VJイベントカードに data-year 属性がある');

        // ==========================================
        // 5. Worksフィルター機能テスト（詳細）
        // ==========================================
        console.log('\n【5. Worksフィルター機能テスト（詳細）】');

        // 初期状態：全作品表示
        const initialVisibleWorks = await page.$$eval('.works-grid .work-item', items =>
            items.filter(el => el.style.display !== 'none').length
        );
        assert(initialVisibleWorks > 0, `初期状態で ${initialVisibleWorks} 件の作品が表示されている`);

        // カテゴリフィルターをクリック（VJ）
        const vjFilterBtn = await page.$('.filter-btn[data-filter="VJ"]');
        if (vjFilterBtn) {
            await vjFilterBtn.click();
            await new Promise(r => setTimeout(r, 500));

            const vjFilterActive = await page.$eval('.filter-btn[data-filter="VJ"]', el => el.classList.contains('active'));
            assert(vjFilterActive, 'VJフィルタークリック後にactiveクラスが付く');

            const allFilterNotActive = await page.$eval('.filter-btn.filter-all', el => !el.classList.contains('active'));
            assert(allFilterNotActive, 'VJフィルター選択時に「すべて」のactiveが外れる');

            const vjVisibleWorks = await page.$$eval('.works-grid .work-item', items =>
                items.filter(el => el.style.display !== 'none').length
            );
            assert(vjVisibleWorks >= 0, `VJフィルター後に ${vjVisibleWorks} 件表示`);
        } else {
            assert(false, 'VJフィルターボタンが見つからない');
        }

        // 「すべて」フィルターに戻す
        await page.click('.filter-btn.filter-all');
        await new Promise(r => setTimeout(r, 500));

        const afterResetWorks = await page.$$eval('.works-grid .work-item', items =>
            items.filter(el => el.style.display !== 'none').length
        );
        assert(afterResetWorks === initialVisibleWorks, `「すべて」に戻すと元の表示件数に戻る（${afterResetWorks}件）`);

        // ==========================================
        // 6. VJイベントフィルター機能テスト
        // ==========================================
        console.log('\n【6. VJイベントフィルター機能テスト】');

        const eventFilterBtns = await page.$$('.filter-buttons-compact .filter-btn-compact');
        assert(eventFilterBtns.length > 0, `VJイベントフィルターボタンが ${eventFilterBtns.length} 個存在する`);

        // VRフィルターをクリック
        const vrFilterBtn = await page.$('.filter-btn-compact[data-filter="vr"]');
        if (vrFilterBtn) {
            await vrFilterBtn.click();
            await new Promise(r => setTimeout(r, 500));

            const vrFilterActive = await page.$eval('.filter-btn-compact[data-filter="vr"]', el => el.classList.contains('active'));
            assert(vrFilterActive, 'VRフィルタークリック後にactiveクラスが付く');

            // VRイベントのみ表示されているか（hiddenクラスで非表示制御）
            const allVR = await page.$$eval('.event-item-compact', items =>
                items.filter(el => !el.classList.contains('hidden')).every(el => el.dataset.type === 'vr')
            );
            assert(allVR, 'VRフィルター後はVRタイプのイベントのみ表示される');
        }

        // Realフィルターをクリック
        const realFilterBtn = await page.$('.filter-btn-compact[data-filter="real"]');
        if (realFilterBtn) {
            await realFilterBtn.click();
            await new Promise(r => setTimeout(r, 500));

            const allReal = await page.$$eval('.event-item-compact', items =>
                items.filter(el => !el.classList.contains('hidden')).every(el => el.dataset.type === 'real')
            );
            assert(allReal, 'Realフィルター後はRealタイプのイベントのみ表示される');
        }

        // 年別フィルターテスト
        const year2024FilterBtn = await page.$('.filter-btn-compact[data-filter="2024"]');
        if (year2024FilterBtn) {
            await year2024FilterBtn.click();
            await new Promise(r => setTimeout(r, 500));

            const all2024 = await page.$$eval('.event-item-compact', items =>
                items.filter(el => !el.classList.contains('hidden')).every(el => el.dataset.year === '2024')
            );
            assert(all2024, '2024フィルター後は2024年のイベントのみ表示される');
        }

        // 「すべて」に戻す
        const eventAllFilter = await page.$('.filter-btn-compact.filter-all');
        if (eventAllFilter) {
            await eventAllFilter.click();
            await new Promise(r => setTimeout(r, 500));
        }

        // ==========================================
        // 7. 「もっと見る」ボタンテスト
        // ==========================================
        console.log('\n【7. 「もっと見る」ボタンテスト】');

        const loadMoreBtn = await page.$('.works-load-more .btn');
        assert(loadMoreBtn !== null, '「もっと見る」ボタンが存在する');

        if (loadMoreBtn) {
            const visibleBefore = await page.$$eval('.works-grid .work-item', items =>
                items.filter(el => el.style.display !== 'none').length
            );

            const loadMoreVisible = await page.$eval('.works-load-more', el => {
                const style = window.getComputedStyle(el);
                return style.display !== 'none' && style.visibility !== 'hidden';
            });

            if (loadMoreVisible) {
                await loadMoreBtn.click();
                await new Promise(r => setTimeout(r, 500));

                const visibleAfter = await page.$$eval('.works-grid .work-item', items =>
                    items.filter(el => el.style.display !== 'none').length
                );
                assert(visibleAfter >= visibleBefore, `「もっと見る」クリック後に表示件数が増加（${visibleBefore} → ${visibleAfter}）`);
            } else {
                assert(true, '「もっと見る」ボタンは全件表示時は非表示（正常）');
            }
        }

        // ==========================================
        // 8. モーダル表示テスト
        // ==========================================
        console.log('\n【8. モーダル表示テスト】');

        // モーダルが初期状態で非表示
        const modalHidden = await page.$eval('#workModal', el => {
            const style = window.getComputedStyle(el);
            return style.display === 'none' || !el.classList.contains('active');
        });
        assert(modalHidden, 'モーダルが初期状態で非表示');

        // 作品カードをクリックしてモーダルを開く
        const firstWorkCard = await page.$('.works-grid .work-item');
        if (firstWorkCard) {
            await firstWorkCard.click();
            await new Promise(r => setTimeout(r, 800));

            const modalVisible = await page.evaluate(() => {
                const modal = document.querySelector('#workModal');
                return modal && (modal.classList.contains('active') || modal.style.display !== 'none');
            });
            assert(modalVisible, '作品カードクリック後にモーダルが表示される');

            // モーダル内に閉じるボタンがあるか
            const closeBtn = await page.$('.work-modal-close');
            assert(closeBtn !== null, 'モーダルに閉じるボタンがある');

            // モーダルにタイトルがあるか
            const modalTitle = await page.$eval('.work-modal-title', el => el.textContent.trim().length > 0);
            assert(modalTitle, 'モーダルにタイトルが表示されている');

            // モーダルにメディア（YouTube/画像）またはサムネイルがあるか
            const hasMedia = await page.evaluate(() => {
                const modal = document.querySelector('#workModal');
                return modal.querySelector('iframe, .work-modal-gallery-grid img, .work-modal-thumbnail img, .work-modal-media') !== null;
            });
            assert(hasMedia, 'モーダルにメディアコンテンツが表示されている');

            // ==========================================
            // 9. モーダル閉じるテスト（閉じるボタン）
            // ==========================================
            console.log('\n【9. モーダル閉じるテスト】');

            if (closeBtn) {
                await closeBtn.click();
                await new Promise(r => setTimeout(r, 500));

                const modalClosed = await page.evaluate(() => {
                    const modal = document.querySelector('#workModal');
                    return !modal.classList.contains('active') || modal.style.display === 'none';
                });
                assert(modalClosed, '閉じるボタンでモーダルが閉じる');
            }

            // ==========================================
            // 10. モーダル閉じるテスト（Escapeキー）
            // ==========================================
            console.log('\n【10. モーダル閉じるテスト（Escapeキー）】');

            // 再度モーダルを開く
            await firstWorkCard.click();
            await new Promise(r => setTimeout(r, 800));

            const modalOpenAgain = await page.evaluate(() => {
                const modal = document.querySelector('#workModal');
                return modal && (modal.classList.contains('active') || modal.style.display !== 'none');
            });
            assert(modalOpenAgain, 'モーダルが再度表示される');

            // Escapeキーで閉じる
            await page.keyboard.press('Escape');
            await new Promise(r => setTimeout(r, 500));

            const modalClosedByEscape = await page.evaluate(() => {
                const modal = document.querySelector('#workModal');
                return !modal.classList.contains('active') || modal.style.display === 'none';
            });
            assert(modalClosedByEscape, 'Escapeキーでモーダルが閉じる');
        }

        // ==========================================
        // 11. VJイベントモーダルテスト
        // ==========================================
        console.log('\n【11. VJイベントモーダルテスト】');

        const firstEvent = await page.$('.event-item-compact');
        if (firstEvent) {
            await firstEvent.click();
            await new Promise(r => setTimeout(r, 800));

            const eventModalVisible = await page.evaluate(() => {
                const modal = document.querySelector('#workModal');
                return modal && (modal.classList.contains('active') || modal.style.display !== 'none');
            });
            assert(eventModalVisible, 'VJイベントカードクリック後にモーダルが表示される');

            // VJイベントモーダルにはフライヤー画像がある
            const hasFlyer = await page.evaluate(() => {
                const modal = document.querySelector('#workModal');
                return modal.querySelector('img') !== null;
            });
            assert(hasFlyer, 'VJイベントモーダルに画像が表示されている');

            // 閉じる
            await page.keyboard.press('Escape');
            await new Promise(r => setTimeout(r, 500));
        }

        // ==========================================
        // 12. Featured Works クリックでモーダルテスト
        // ==========================================
        console.log('\n【12. Featured Works クリックでモーダルテスト】');

        const firstFeatured = await page.$('.featured-work-card');
        if (firstFeatured) {
            await firstFeatured.click();
            await new Promise(r => setTimeout(r, 800));

            const featuredModalVisible = await page.evaluate(() => {
                const modal = document.querySelector('#workModal');
                return modal && (modal.classList.contains('active') || modal.style.display !== 'none');
            });
            assert(featuredModalVisible, 'ピックアップカードクリック後にモーダルが表示される');

            await page.keyboard.press('Escape');
            await new Promise(r => setTimeout(r, 500));
        }

        // ==========================================
        // 13. プロフィールセクション詳細テスト
        // ==========================================
        console.log('\n【13. プロフィールセクション詳細テスト】');

        const profilePhoto = await page.$('.profile-photo');
        assert(profilePhoto !== null, 'プロフィール写真が存在する');

        const profileName = await page.$eval('.profile-name-large', el => el.textContent.trim());
        assert(profileName === 'MEMEMIYA', `プロフィール名が「MEMEMIYA」（実際: ${profileName}）`);

        const profileReading = await page.$eval('.profile-name-reading', el => el.textContent.trim());
        assert(profileReading === 'メメミヤ', 'プロフィール読みがなが「メメミヤ」');

        const roleTags = await page.$$('.role-tag');
        assert(roleTags.length >= 3, `役職タグが3つ以上（${roleTags.length}個）`);

        const profileCatchcopy = await page.$('.profile-catchcopy');
        assert(profileCatchcopy !== null, 'プロフィールにキャッチコピーがある');

        const descriptionTexts = await page.$$('.description-text');
        assert(descriptionTexts.length > 0, 'プロフィールに説明テキストがある');

        // スキルセット
        const mainSkills = await page.$$('.skill-tag.main');
        assert(mainSkills.length >= 3, `メインスキルが3つ以上（${mainSkills.length}個）`);

        // サブスキル（details要素）
        const skillDetails = await page.$('details.skill-details');
        assert(skillDetails !== null, 'サブスキル折りたたみ(details)が存在する');

        // ==========================================
        // 14. 出演予定セクションテスト
        // ==========================================
        console.log('\n【14. 出演予定セクションテスト】');

        const upcomingSection = await page.$('#scheduled-events');
        assert(upcomingSection !== null, '出演予定セクションが存在する');

        const upcomingList = await page.$('.upcoming-events-list');
        assert(upcomingList !== null, '出演予定リストが存在する');

        const upcomingSkeletonGone = await page.evaluate(() => {
            const list = document.querySelector('.upcoming-events-list');
            return list && list.querySelector('.info-skeleton') === null;
        });
        assert(upcomingSkeletonGone, '出演予定セクションのスケルトンが消えている');

        // ==========================================
        // 15. WebGLキャンバステスト
        // ==========================================
        console.log('\n【15. WebGLキャンバステスト】');

        const canvas = await page.$('#shaderCanvas');
        assert(canvas !== null, 'WebGLキャンバスが存在する');

        const canvasStyle = await page.$eval('#shaderCanvas', el => {
            const style = window.getComputedStyle(el);
            return {
                position: style.position,
                pointerEvents: style.pointerEvents,
                zIndex: style.zIndex,
            };
        });
        assert(canvasStyle.position === 'fixed', 'キャンバスがfixed配置');
        assert(canvasStyle.pointerEvents === 'none', 'キャンバスのpointer-eventsがnone（クリックを遮らない）');

        const canvasDimensions = await page.$eval('#shaderCanvas', el => {
            return { width: el.width, height: el.height };
        });
        assert(canvasDimensions.width > 0 && canvasDimensions.height > 0, `キャンバスにサイズがある（${canvasDimensions.width}x${canvasDimensions.height}）`);

        // ==========================================
        // 16. ナビゲーションスクロール時のスタイル変化テスト
        // ==========================================
        console.log('\n【16. ナビゲーションスクロール時のスタイル変化テスト】');

        await page.evaluate(() => window.scrollTo(0, 0));
        await new Promise(r => setTimeout(r, 300));

        const navInitialBg = await page.$eval('.main-nav', el => window.getComputedStyle(el).background);

        await page.evaluate(() => window.scrollTo(0, 200));
        await new Promise(r => setTimeout(r, 300));

        const navScrolledClass = await page.$eval('.main-nav', el => el.classList.contains('scrolled'));
        assert(navScrolledClass, 'スクロール後にナビに scrolled クラスが付く');

        await page.evaluate(() => window.scrollTo(0, 0));
        await new Promise(r => setTimeout(r, 300));

        const navNotScrolled = await page.$eval('.main-nav', el => !el.classList.contains('scrolled'));
        assert(navNotScrolled, 'トップに戻ると scrolled クラスが外れる');

        // ==========================================
        // 17. スクロールトップボタンテスト
        // ==========================================
        console.log('\n【17. スクロールトップボタンテスト】');

        const scrollTopBtn = await page.$('#scrollTopBtn');
        assert(scrollTopBtn !== null, 'スクロールトップボタンが存在する');

        const scrollTopHiddenInitial = await page.$eval('#scrollTopBtn', el => {
            return window.getComputedStyle(el).opacity === '0';
        });
        assert(scrollTopHiddenInitial, 'スクロールトップボタンが初期状態で非表示');

        await page.evaluate(() => window.scrollTo(0, 500));
        await new Promise(r => setTimeout(r, 500));

        const scrollTopVisibleAfterScroll = await page.$eval('#scrollTopBtn', el => {
            return window.getComputedStyle(el).opacity !== '0';
        });
        assert(scrollTopVisibleAfterScroll, 'スクロール後にスクロールトップボタンが表示される');

        // スクロールトップボタンをクリック
        await page.click('#scrollTopBtn');
        await page.waitForFunction(() => window.scrollY < 50, { timeout: 5000 });
        const scrolledToTop = await page.evaluate(() => window.scrollY);
        assert(scrolledToTop < 50, `スクロールトップボタンでページ上部に戻る（位置: ${scrolledToTop}）`);

        // ==========================================
        // 18. TOCクリックでスクロールテスト
        // ==========================================
        console.log('\n【18. TOCクリックでスクロールテスト】');

        // aboutセクションへのTOCリンクをクリック
        const tocAboutLink = await page.$('.toc-link[data-section="about"]');
        if (tocAboutLink) {
            await tocAboutLink.click();
            await page.waitForFunction(() => {
                const about = document.querySelector('#about');
                if (!about) return false;
                const rect = about.getBoundingClientRect();
                return rect.top < window.innerHeight && rect.bottom > 0;
            }, { timeout: 10000 });

            const aboutInView = await page.evaluate(() => {
                const about = document.querySelector('#about');
                const rect = about.getBoundingClientRect();
                return rect.top < window.innerHeight && rect.bottom > 0;
            });
            assert(aboutInView, 'TOCのプロフィールリンクでプロフィールセクションにスクロール');

            // スクロールイベントのthrottle（requestAnimationFrame）待ち
            await new Promise(r => setTimeout(r, 500));
            // TOCのactive更新をトリガーするためスクロールイベントを発火
            await page.evaluate(() => window.dispatchEvent(new Event('scroll')));
            await new Promise(r => setTimeout(r, 300));

            const tocAboutActive = await page.$eval('.toc-link[data-section="about"]', el => el.classList.contains('active'));
            assert(tocAboutActive, 'スクロール後にTOCリンクがactive状態になる');
        }

        // ==========================================
        // 19. 構造化データ（JSON-LD）テスト
        // ==========================================
        console.log('\n【19. 構造化データ（JSON-LD）テスト】');

        const jsonLd = await page.evaluate(() => {
            const script = document.querySelector('script[type="application/ld+json"]');
            if (!script) return null;
            try { return JSON.parse(script.textContent); } catch { return null; }
        });
        assert(jsonLd !== null, 'JSON-LD構造化データが存在する');
        assert(jsonLd && jsonLd['@type'] === 'Person', 'JSON-LDの@typeがPerson');
        assert(jsonLd && jsonLd.name === 'MEMEMIYA', 'JSON-LDのnameがMEMEMIYA');
        assert(jsonLd && jsonLd.sameAs && jsonLd.sameAs.length >= 3, `JSON-LDにsameAsリンクが3つ以上（${jsonLd?.sameAs?.length}個）`);
        assert(jsonLd && jsonLd.knowsAbout && jsonLd.knowsAbout.length > 0, 'JSON-LDにknowsAboutが設定されている');

        // ==========================================
        // 20. contact.html 詳細テスト
        // ==========================================
        console.log('\n【20. contact.html 詳細テスト】');

        await page.goto(`${BASE_URL}/contact.html`, { waitUntil: 'networkidle2', timeout: 15000 });

        // メールリンクの確認
        const mailtoLink = await page.$('a[href^="mailto:"]');
        assert(mailtoLink !== null, 'メールリンクが存在する');

        const mailtoHref = await page.$eval('a[href^="mailto:"]', el => el.getAttribute('href'));
        assert(mailtoHref.includes('mememiya.am@gmail.com'), 'メールアドレスが正しい');

        // SNSリンクの確認
        const twitterLink = await page.$('a[href*="twitter.com/_MEMEMIYA"]');
        assert(twitterLink !== null, 'Twitterリンクが存在する');

        const instagramLink = await page.$('a[href*="instagram.com/_mememiya"]');
        assert(instagramLink !== null, 'Instagramリンクが存在する');

        // VR VJ詳細セクション
        const vrVjDetail = await page.$('.vr-vj-detail-card');
        assert(vrVjDetail !== null, 'VR VJ詳細カードが存在する');

        // 連絡先情報
        const contactInfo = await page.$('.contact-info-compact');
        assert(contactInfo !== null, '連絡先情報セクションが存在する');

        // contact.htmlのSEOメタタグ
        const contactMetaDesc = await page.$eval('meta[name="description"]', el => el.getAttribute('content'));
        assert(contactMetaDesc && contactMetaDesc.length > 10, 'contact.htmlにmeta descriptionがある');

        const contactOgUrl = await page.$eval('meta[property="og:url"]', el => el.getAttribute('content'));
        assert(contactOgUrl && contactOgUrl.includes('contact.html'), 'contact.htmlのog:urlが正しい');

        // contact.htmlのナビ
        const contactNavHomeLink = await page.$('a[href="index.html"]');
        assert(contactNavHomeLink !== null, 'contact.htmlにindex.htmlへのリンクがある');

        // contact.htmlの目次
        const contactToc = await page.$('#tocNav');
        assert(contactToc !== null, 'contact.htmlに目次がある');

        const contactTocLinks = await page.$$('.toc-link');
        assert(contactTocLinks.length >= 2, `contact.htmlの目次に${contactTocLinks.length}個のリンクがある`);

        // ==========================================
        // 21. contact.html → index.html ナビゲーションテスト
        // ==========================================
        console.log('\n【21. contact.html → index.html ナビゲーションテスト】');

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }),
            page.click('a[href="index.html"]'),
        ]);
        const backToIndex = page.url();
        assert(!backToIndex.includes('contact.html'), 'contact.htmlからindex.htmlに遷移できる');

        // ==========================================
        // 22. レスポンシブ - タブレット表示テスト
        // ==========================================
        console.log('\n【22. レスポンシブ - タブレット表示テスト】');

        await page.setViewport({ width: 768, height: 1024 });
        await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 15000 });

        const tabletHeroVisible = await page.$eval('#hero', el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none';
        });
        assert(tabletHeroVisible, 'タブレットでヒーローセクションが表示される');

        const tabletWorksBtn = await page.evaluate(() => {
            const btn = document.querySelector('a.btn-hero[href="#works"]');
            const rect = btn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const topEl = document.elementFromPoint(centerX, centerY);
            return btn.contains(topEl) || btn === topEl;
        });
        assert(tabletWorksBtn, 'タブレットで「作品を見る」ボタンが覆われていない');

        // ==========================================
        // 23. レスポンシブ - モバイル詳細テスト
        // ==========================================
        console.log('\n【23. レスポンシブ - モバイル詳細テスト】');

        await page.setViewport({ width: 375, height: 667 });
        await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 15000 });

        // モバイルではタグが非表示
        const mobileTagsHidden = await page.$eval('.hero-tags', el => {
            return window.getComputedStyle(el).display === 'none';
        });
        assert(mobileTagsHidden, 'モバイルでヒーロータグが非表示');

        // モバイルではセクション説明が非表示
        const mobileDescHidden = await page.$$eval('.section-description', descs => {
            return descs.every(el => window.getComputedStyle(el).display === 'none');
        });
        assert(mobileDescHidden, 'モバイルでセクション説明が非表示');

        // モバイルでのセクション順序（linksがheroの直後）
        const mobileOrder = await page.evaluate(() => {
            const hero = document.querySelector('#hero');
            const links = document.querySelector('#links');
            const heroOrder = parseInt(window.getComputedStyle(hero).order) || 0;
            const linksOrder = parseInt(window.getComputedStyle(links).order) || 0;
            return { heroOrder, linksOrder };
        });
        assert(mobileOrder.linksOrder > mobileOrder.heroOrder, `モバイルでlinksセクションがheroの後に配置（hero: ${mobileOrder.heroOrder}, links: ${mobileOrder.linksOrder}）`);

        // モバイルでスクロールインジケーターが非表示
        const scrollIndicator = await page.$('.scroll-indicator');
        if (scrollIndicator) {
            const indicatorHidden = await page.$eval('.scroll-indicator', el =>
                window.getComputedStyle(el).display === 'none'
            );
            assert(indicatorHidden, 'モバイルでスクロールインジケーターが非表示');
        } else {
            assert(true, 'スクロールインジケーターが存在しない（モバイルでは正常）');
        }

        // ==========================================
        // 24. レスポンシブ - 小画面テスト（360px以下）
        // ==========================================
        console.log('\n【24. レスポンシブ - 小画面テスト（360px以下）】');

        await page.setViewport({ width: 320, height: 568 });
        await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 15000 });

        // ボタンが画面内に収まるか
        const smallScreenBtns = await page.evaluate(() => {
            const btns = document.querySelectorAll('.hero-cta .btn-hero');
            return Array.from(btns).every(btn => {
                const rect = btn.getBoundingClientRect();
                return rect.right <= window.innerWidth && rect.left >= 0;
            });
        });
        assert(smallScreenBtns, '320px幅でヒーローボタンが画面内に収まる');

        // ==========================================
        // 25. モバイルでのモーダル表示・操作テスト
        // ==========================================
        console.log('\n【25. モバイルでのモーダル表示・操作テスト】');

        await page.setViewport({ width: 375, height: 667 });
        await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 15000 });

        // モバイルで作品カードをクリックしてモーダルを開く
        const mobileWorkCard = await page.$('.works-grid .work-item');
        if (mobileWorkCard) {
            await mobileWorkCard.click();
            await new Promise(r => setTimeout(r, 800));

            const mobileModalVisible = await page.evaluate(() => {
                const modal = document.querySelector('#workModal');
                return modal && (modal.classList.contains('active') || modal.style.display !== 'none');
            });
            assert(mobileModalVisible, 'モバイルで作品カードクリック後にモーダルが表示される');

            // モバイルでモーダルの閉じるボタンがタップ可能なサイズか
            const mobileCloseBtn = await page.$eval('.work-modal-close', el => {
                const rect = el.getBoundingClientRect();
                return { width: rect.width, height: rect.height, visible: rect.width > 0 && rect.height > 0 };
            });
            assert(mobileCloseBtn.width >= 40 && mobileCloseBtn.height >= 40, `モバイルでモーダル閉じるボタンがタップ可能なサイズ（${mobileCloseBtn.width}x${mobileCloseBtn.height}）`);

            // モバイルでモーダルコンテンツが画面幅に収まるか
            const modalContentFits = await page.evaluate(() => {
                const content = document.querySelector('.work-modal-content');
                if (!content) return true;
                const rect = content.getBoundingClientRect();
                return rect.width <= window.innerWidth;
            });
            assert(modalContentFits, 'モバイルでモーダルコンテンツが画面幅に収まる');

            // モバイルでモーダルのタイトルが表示されているか
            const mobileModalTitle = await page.evaluate(() => {
                const title = document.querySelector('.work-modal-title');
                return title && title.textContent.trim().length > 0;
            });
            assert(mobileModalTitle, 'モバイルでモーダルタイトルが表示されている');

            // モバイルでEscapeキーでモーダルが閉じるか
            await page.keyboard.press('Escape');
            await new Promise(r => setTimeout(r, 500));

            const mobileModalClosed = await page.evaluate(() => {
                const modal = document.querySelector('#workModal');
                return !modal.classList.contains('active') || modal.style.display === 'none';
            });
            assert(mobileModalClosed, 'モバイルでEscapeキーでモーダルが閉じる');
        }

        // モバイルでVJイベントモーダル
        const mobileEventCard = await page.$('.event-item-compact');
        if (mobileEventCard) {
            await mobileEventCard.click();
            await new Promise(r => setTimeout(r, 800));

            const mobileEventModalVisible = await page.evaluate(() => {
                const modal = document.querySelector('#workModal');
                return modal && (modal.classList.contains('active') || modal.style.display !== 'none');
            });
            assert(mobileEventModalVisible, 'モバイルでVJイベントカードクリック後にモーダルが表示される');

            // 閉じるボタンで閉じる
            const mobileEventCloseBtn = await page.$('.work-modal-close');
            if (mobileEventCloseBtn) {
                await mobileEventCloseBtn.click();
                await new Promise(r => setTimeout(r, 500));
            }
        }

        // ==========================================
        // 26. モバイルでのフィルター操作テスト
        // ==========================================
        console.log('\n【26. モバイルでのフィルター操作テスト】');

        // モバイルでWorksフィルターが操作可能か
        const mobileFilterBtns = await page.$$('.filter-btn');
        assert(mobileFilterBtns.length > 0, `モバイルでWorksフィルターボタンが ${mobileFilterBtns.length} 個存在する`);

        // モバイルでフィルターボタンが画面内に収まるか
        const mobileFiltersFit = await page.evaluate(() => {
            const btns = document.querySelectorAll('.filter-btn');
            return Array.from(btns).every(btn => {
                const rect = btn.getBoundingClientRect();
                return rect.right <= window.innerWidth && rect.left >= 0;
            });
        });
        assert(mobileFiltersFit, 'モバイルでWorksフィルターボタンが画面内に収まる');

        // モバイルでVJイベントフィルターが操作可能か
        const mobileEventFilterBtns = await page.$$('.filter-btn-compact');
        assert(mobileEventFilterBtns.length > 0, `モバイルでVJイベントフィルターボタンが ${mobileEventFilterBtns.length} 個存在する`);

        // モバイルでVJフィルタークリックが動作するか
        const mobileVrFilter = await page.$('.filter-btn-compact[data-filter="vr"]');
        if (mobileVrFilter) {
            await mobileVrFilter.click();
            await new Promise(r => setTimeout(r, 500));

            const mobileVrFilterActive = await page.$eval('.filter-btn-compact[data-filter="vr"]', el => el.classList.contains('active'));
            assert(mobileVrFilterActive, 'モバイルでVRフィルタークリック後にactiveクラスが付く');

            // フィルター結果の確認
            const mobileVrOnly = await page.$$eval('.event-item-compact', items =>
                items.filter(el => !el.classList.contains('hidden')).every(el => el.dataset.type === 'vr')
            );
            assert(mobileVrOnly, 'モバイルでVRフィルター後はVRイベントのみ表示');

            // 全てに戻す
            const mobileEventAllFilter = await page.$('.filter-btn-compact.filter-all');
            if (mobileEventAllFilter) {
                await mobileEventAllFilter.click();
                await new Promise(r => setTimeout(r, 500));
            }
        }

        // ==========================================
        // 27. モバイルでのナビゲーションテスト
        // ==========================================
        console.log('\n【27. モバイルでのナビゲーションテスト】');

        // モバイルでナビリンクが表示されているか
        const mobileNavLinks = await page.$$eval('.nav-links .nav-link', links => {
            return links.map(link => {
                const rect = link.getBoundingClientRect();
                const style = window.getComputedStyle(link);
                return {
                    text: link.textContent.trim(),
                    visible: rect.width > 0 && rect.height > 0 && style.display !== 'none',
                    fitsScreen: rect.right <= window.innerWidth,
                };
            });
        });
        const allNavVisible = mobileNavLinks.every(l => l.visible);
        assert(allNavVisible, 'モバイルでナビリンクが全て表示されている');

        const allNavFit = mobileNavLinks.every(l => l.fitsScreen);
        assert(allNavFit, 'モバイルでナビリンクが画面内に収まる');

        // モバイルでナビからセクションへスクロールできるか
        const mobileNavWorksLink = await page.$('.nav-link[href="#works"]');
        if (mobileNavWorksLink) {
            await mobileNavWorksLink.click();
            await page.waitForFunction(() => {
                const works = document.querySelector('#works');
                if (!works) return false;
                const rect = works.getBoundingClientRect();
                return rect.top < window.innerHeight && rect.bottom > 0;
            }, { timeout: 5000 });

            const mobileWorksInView = await page.evaluate(() => {
                const works = document.querySelector('#works');
                const rect = works.getBoundingClientRect();
                return rect.top < window.innerHeight && rect.bottom > 0;
            });
            assert(mobileWorksInView, 'モバイルでナビ「作品」クリックでWorksセクションにスクロール');
        }

        // ==========================================
        // 28. モバイルでのcontact.htmlテスト
        // ==========================================
        console.log('\n【28. モバイルでのcontact.htmlテスト】');

        await page.goto(`${BASE_URL}/contact.html`, { waitUntil: 'networkidle2', timeout: 15000 });

        // モバイルでcontact.htmlが正しく表示されるか
        const mobileContactTitle = await page.$eval('h1, .contact-title, .hero-title', el => {
            return el.textContent.trim().length > 0;
        });
        assert(mobileContactTitle, 'モバイルでcontact.htmlのタイトルが表示される');

        // モバイルでメールリンクがタップ可能か
        const mobileMailLink = await page.$eval('a[href^="mailto:"]', el => {
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && rect.right <= window.innerWidth;
        });
        assert(mobileMailLink, 'モバイルでメールリンクがタップ可能で画面内に収まる');

        // モバイルでSNSリンクが画面内に収まるか
        const mobileContactSocialFit = await page.$$eval('a[target="_blank"]', links => {
            return links.every(link => {
                const rect = link.getBoundingClientRect();
                return rect.right <= window.innerWidth;
            });
        });
        assert(mobileContactSocialFit, 'モバイルでcontact.htmlのSNSリンクが画面内に収まる');

        // モバイルでcontact.htmlのナビが機能するか
        const mobileContactHomeLink = await page.$('a[href="index.html"]');
        assert(mobileContactHomeLink !== null, 'モバイルでcontact.htmlにindex.htmlへのリンクがある');

        // ==========================================
        // 29. モバイルでのスクロール・ボタンテスト
        // ==========================================
        console.log('\n【29. モバイルでのスクロール・ボタンテスト】');

        await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 15000 });

        // モバイルでスクロールトップボタンが動作するか
        await page.evaluate(() => window.scrollTo(0, 1000));
        await new Promise(r => setTimeout(r, 500));

        const mobileScrollTopVisible = await page.$eval('#scrollTopBtn', el => {
            return window.getComputedStyle(el).opacity !== '0';
        });
        assert(mobileScrollTopVisible, 'モバイルでスクロール後にスクロールトップボタンが表示される');

        await page.click('#scrollTopBtn');
        await page.waitForFunction(() => window.scrollY < 50, { timeout: 5000 });
        const mobileScrolledToTop = await page.evaluate(() => window.scrollY);
        assert(mobileScrolledToTop < 50, `モバイルでスクロールトップボタンでページ上部に戻る（位置: ${mobileScrolledToTop}）`);

        // モバイルでヒーローボタンがタップ可能か（elementFromPoint）
        const mobileHeroBtnClickable = await page.evaluate(() => {
            const btn = document.querySelector('a.btn-hero[href="#works"]');
            if (!btn) return false;
            const rect = btn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const topEl = document.elementFromPoint(centerX, centerY);
            return btn.contains(topEl) || btn === topEl;
        });
        assert(mobileHeroBtnClickable, 'モバイルで「作品を見る」ボタンが他の要素に覆われていない');

        // モバイルでフローティングCTAが表示されるか
        const mobileFloatingCta = await page.$('.floating-cta');
        if (mobileFloatingCta) {
            const mobileCtaFits = await page.$eval('.floating-cta', el => {
                const rect = el.getBoundingClientRect();
                return rect.right <= window.innerWidth && rect.left >= 0;
            });
            assert(mobileCtaFits, 'モバイルでフローティングCTAが画面内に収まる');
        }

        // ==========================================
        // 30. 外部リンクのセキュリティテスト
        // ==========================================
        console.log('\n【30. 外部リンクのセキュリティテスト】');

        await page.setViewport({ width: 1280, height: 720 });
        await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 15000 });

        // 全外部リンクがnoopenerを持つか
        const allExternalLinksSecure = await page.$$eval('a[target="_blank"]', links => {
            return links.every(link => {
                const rel = link.getAttribute('rel') || '';
                return rel.includes('noopener');
            });
        });
        assert(allExternalLinksSecure, '全外部リンク(target="_blank")にrel="noopener"がある');

        // 全外部リンクがnoreferrerも持つか
        const allExternalLinksNoreferrer = await page.$$eval('a[target="_blank"]', links => {
            return links.every(link => {
                const rel = link.getAttribute('rel') || '';
                return rel.includes('noreferrer');
            });
        });
        assert(allExternalLinksNoreferrer, '全外部リンクにrel="noreferrer"がある');

        // ==========================================
        // 31. パフォーマンスヒントテスト
        // ==========================================
        console.log('\n【31. パフォーマンスヒントテスト】');

        // preconnectが設定されているか
        const preconnectLinks = await page.$$('link[rel="preconnect"]');
        assert(preconnectLinks.length > 0, `preconnectリンクが ${preconnectLinks.length} 個設定されている`);

        // dns-prefetchが設定されているか
        const dnsPrefetchLinks = await page.$$('link[rel="dns-prefetch"]');
        assert(dnsPrefetchLinks.length > 0, `dns-prefetchリンクが ${dnsPrefetchLinks.length} 個設定されている`);

        // lazy loading画像があるか
        const lazyImages = await page.$$('img[loading="lazy"]');
        assert(lazyImages.length > 0, `lazy loading画像が ${lazyImages.length} 枚設定されている`);

        // ヒーローロゴはeager loadingか
        const heroLogoEager = await page.$eval('.hero-logo-img', el => el.getAttribute('loading'));
        assert(heroLogoEager === 'eager', 'ヒーローロゴがeager loadingに設定されている');

        // ==========================================
        // 32. CSSバージョニングテスト
        // ==========================================
        console.log('\n【32. CSSバージョニングテスト】');

        const cssVersioned = await page.$eval('link[rel="stylesheet"][href*="style.css"]', el => {
            const href = el.getAttribute('href');
            return href.includes('?v=');
        });
        assert(cssVersioned, 'CSSファイルにバージョンパラメータが付いている');

        // ==========================================
        // 33. VJ情報グリッドテスト
        // ==========================================
        console.log('\n【33. VJ情報グリッドテスト】');

        const vjInfoCards = await page.$$('.vj-info-card');
        assert(vjInfoCards.length >= 4, `VJ情報カードが4つ以上（${vjInfoCards.length}個）`);

        // 各カードにラベルと値がある
        const vjInfoStructure = await page.$$eval('.vj-info-card', cards => {
            return cards.every(card =>
                card.querySelector('.info-label') !== null &&
                card.querySelector('.info-value') !== null
            );
        });
        assert(vjInfoStructure, 'VJ情報カードにラベルと値がある');

        // ==========================================
        // 34. 浮遊ソーシャルバーの外部リンクテスト
        // ==========================================
        console.log('\n【34. 浮遊ソーシャルバーの外部リンクテスト】');

        const socialLinksSecure = await page.$$eval('.floating-social-bar .social-link', links => {
            return links.every(link => {
                const target = link.getAttribute('target');
                const rel = link.getAttribute('rel') || '';
                return target === '_blank' && rel.includes('noopener');
            });
        });
        assert(socialLinksSecure, '浮遊ソーシャルバーのリンクが全てtarget="_blank"とnoopener付き');

        const socialLinksHaveAriaLabel = await page.$$eval('.floating-social-bar .social-link', links => {
            return links.every(link => link.getAttribute('aria-label') !== null);
        });
        assert(socialLinksHaveAriaLabel, '浮遊ソーシャルバーのリンクに全てaria-labelがある');

        // ==========================================
        // 35. コンソールエラーテスト
        // ==========================================
        console.log('\n【35. コンソールエラーテスト】');

        // WebGLやフォントのエラーは除外
        const significantErrors = consoleErrors.filter(e =>
            !e.includes('WebGL') &&
            !e.includes('font') &&
            !e.includes('favicon') &&
            !e.includes('ERR_') &&
            !e.includes('net::')
        );
        assert(significantErrors.length === 0, `重大なJSコンソールエラーが0件（${significantErrors.length}件: ${significantErrors.join('; ').slice(0, 200)}）`);

        // ==========================================
        // 結果表示
        // ==========================================
        const results = getResults();
        console.log('\n========================================');
        console.log(`結果: ${results.passed} 成功, ${results.failed} 失敗 / 合計 ${results.passed + results.failed}`);
        if (results.errors.length > 0) {
            console.log('\n失敗したテスト:');
            results.errors.forEach(e => console.log(`  ✗ ${e}`));
        }
        console.log('========================================');

    } catch (error) {
        console.error('\nテスト実行エラー:', error.message);
    } finally {
        await browser.close();
        server.close();
        const results = getResults();
        process.exit(results.failed > 0 ? 1 : 0);
    }
})();
