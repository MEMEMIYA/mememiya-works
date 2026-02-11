const puppeteer = require('puppeteer');
const path = require('path');
const http = require('http');
const fs = require('fs');

// ========================================
// テストユーティリティ
// ========================================

let passed = 0;
let failed = 0;
const errors = [];

function assert(condition, message) {
    if (condition) {
        passed++;
        console.log(`  ✓ ${message}`);
    } else {
        failed++;
        errors.push(message);
        console.log(`  ✗ ${message}`);
    }
}

// 簡易HTTPサーバー（file://ではnavigationテストが不安定なため）
function createServer(rootDir, port) {
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.mp4': 'video/mp4',
        '.svg': 'image/svg+xml',
        '.json': 'application/json',
    };

    const server = http.createServer((req, res) => {
        let filePath = path.join(rootDir, decodeURIComponent(req.url === '/' ? '/index.html' : req.url.split('?')[0]));
        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end('Not Found');
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });
    });

    return new Promise((resolve) => {
        server.listen(port, () => resolve(server));
    });
}

// ========================================
// テスト本体
// ========================================

(async () => {
    const rootDir = path.resolve(__dirname, '..');
    const PORT = 8765;
    const BASE_URL = `http://localhost:${PORT}`;

    const server = await createServer(rootDir, PORT);
    console.log(`テストサーバー起動: ${BASE_URL}\n`);

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
        // ==========================================
        // 1. ページ読み込みテスト
        // ==========================================
        console.log('【1. ページ読み込みテスト】');

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 720 });

        const response = await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 15000 });
        assert(response.status() === 200, 'index.html が正常に読み込まれる（200）');

        const title = await page.title();
        assert(title.includes('MEMEMIYA'), 'ページタイトルに「MEMEMIYA」が含まれる');

        // ==========================================
        // 2. ヒーローセクションの表示テスト
        // ==========================================
        console.log('\n【2. ヒーローセクションの表示テスト】');

        const heroSection = await page.$('#hero');
        assert(heroSection !== null, 'ヒーローセクション(#hero)が存在する');

        const heroVisible = await page.$eval('#hero', el => {
            const style = window.getComputedStyle(el);
            return style.opacity !== '0' && style.visibility !== 'hidden' && style.display !== 'none';
        });
        assert(heroVisible, 'ヒーローセクションが表示されている（opacity > 0）');

        const heroLogo = await page.$('.hero-logo-img');
        assert(heroLogo !== null, 'ヒーローロゴ画像が存在する');

        const heroSubtitle = await page.$('.hero-subtitle');
        assert(heroSubtitle !== null, 'ヒーローサブタイトルが存在する');

        // ==========================================
        // 3. ヒーローボタンの存在・表示テスト
        // ==========================================
        console.log('\n【3. ヒーローボタンの存在・表示テスト】');

        const worksBtn = await page.$('a.btn-hero[href="#works"]');
        assert(worksBtn !== null, '「作品を見る」ボタン(href="#works")が存在する');

        const contactBtn = await page.$('a.btn-hero[href="contact.html"]');
        assert(contactBtn !== null, '「依頼・相談」ボタン(href="contact.html")が存在する');

        const worksBtnText = await page.$eval('a.btn-hero[href="#works"]', el => el.textContent.trim());
        assert(worksBtnText === '作品を見る', '「作品を見る」ボタンのテキストが正しい');

        const contactBtnText = await page.$eval('a.btn-hero[href="contact.html"]', el => el.textContent.trim());
        assert(contactBtnText === '依頼・相談', '「依頼・相談」ボタンのテキストが正しい');

        // ==========================================
        // 4. ヒーローボタンのクリック可能性テスト
        // ==========================================
        console.log('\n【4. ヒーローボタンのクリック可能性テスト】');

        // ボタンが pointer-events: none でないことを確認
        const worksBtnClickable = await page.$eval('a.btn-hero[href="#works"]', el => {
            const style = window.getComputedStyle(el);
            return style.pointerEvents !== 'none';
        });
        assert(worksBtnClickable, '「作品を見る」ボタンの pointer-events が none ではない');

        const contactBtnClickable = await page.$eval('a.btn-hero[href="contact.html"]', el => {
            const style = window.getComputedStyle(el);
            return style.pointerEvents !== 'none';
        });
        assert(contactBtnClickable, '「依頼・相談」ボタンの pointer-events が none ではない');

        // ボタンの z-index が適切かテスト
        const heroCTAZIndex = await page.$eval('.hero-cta', el => {
            const style = window.getComputedStyle(el);
            return parseInt(style.zIndex) || 0;
        });
        assert(heroCTAZIndex >= 1, `hero-cta の z-index が 1 以上（実際: ${heroCTAZIndex}）`);

        // ボタンが他の要素に覆われていないかテスト（elementFromPointで確認）
        const worksBtnNotCovered = await page.evaluate(() => {
            const btn = document.querySelector('a.btn-hero[href="#works"]');
            const rect = btn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const topEl = document.elementFromPoint(centerX, centerY);
            return btn.contains(topEl) || btn === topEl;
        });
        assert(worksBtnNotCovered, '「作品を見る」ボタンが他の要素に覆われていない');

        const contactBtnNotCovered = await page.evaluate(() => {
            const btn = document.querySelector('a.btn-hero[href="contact.html"]');
            const rect = btn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const topEl = document.elementFromPoint(centerX, centerY);
            return btn.contains(topEl) || btn === topEl;
        });
        assert(contactBtnNotCovered, '「依頼・相談」ボタンが他の要素に覆われていない');

        // ==========================================
        // 5. 「作品を見る」ボタンのスクロール動作テスト
        // ==========================================
        console.log('\n【5. 「作品を見る」ボタンのスクロール動作テスト】');

        const scrollBefore = await page.evaluate(() => window.scrollY);
        assert(scrollBefore === 0, `初期スクロール位置が0（実際: ${scrollBefore}）`);

        await page.click('a.btn-hero[href="#works"]');
        // スムーススクロールの完了を待つ（worksセクションがビューポート内に入るまで）
        await page.waitForFunction(() => {
            const works = document.querySelector('#works');
            if (!works) return false;
            const rect = works.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0;
        }, { timeout: 10000 });
        const scrollAfterWorksClick = await page.evaluate(() => window.scrollY);
        assert(scrollAfterWorksClick > 100, `「作品を見る」クリック後にスクロール（位置: ${scrollAfterWorksClick}）`);

        const worksInView = true; // waitForFunctionで既に確認済み
        assert(worksInView, '「作品を見る」クリック後にworksセクションがビューポート内にある');

        // ==========================================
        // 6. 「依頼・相談」ボタンのナビゲーションテスト
        // ==========================================
        console.log('\n【6. 「依頼・相談」ボタンのナビゲーションテスト】');

        // トップに戻る
        await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 15000 });

        // 依頼・相談ボタンをクリック
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }),
            page.click('a.btn-hero[href="contact.html"]'),
        ]);

        const currentUrl = page.url();
        assert(currentUrl.includes('contact.html'), `「依頼・相談」クリック後にcontact.htmlに遷移（URL: ${currentUrl}）`);

        const contactTitle = await page.title();
        assert(contactTitle.includes('Contact'), 'contact.htmlのタイトルに「Contact」が含まれる');

        // ==========================================
        // 7. ナビゲーションバーテスト
        // ==========================================
        console.log('\n【7. ナビゲーションバーテスト】');

        await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 15000 });

        const nav = await page.$('.main-nav');
        assert(nav !== null, 'ナビゲーションバーが存在する');

        const navFixed = await page.$eval('.main-nav', el => {
            return window.getComputedStyle(el).position === 'fixed';
        });
        assert(navFixed, 'ナビゲーションバーがfixed配置');

        const navZIndex = await page.$eval('.main-nav', el => {
            return parseInt(window.getComputedStyle(el).zIndex);
        });
        assert(navZIndex >= 1000, `ナビゲーションバーのz-indexが1000以上（実際: ${navZIndex}）`);

        // ナビゲーションリンクの存在確認
        const navHomeLink = await page.$('.nav-link[href="#hero"]');
        assert(navHomeLink !== null, 'ナビのHomeリンクが存在する');

        const navContactLink = await page.$('.nav-link[href="contact.html"]');
        assert(navContactLink !== null, 'ナビの依頼・相談リンクが存在する');

        // ==========================================
        // 8. セクション構造テスト
        // ==========================================
        console.log('\n【8. セクション構造テスト】');

        const sectionIds = ['hero', 'information', 'scheduled-events', 'featured', 'about', 'works', 'process', 'links', 'contact'];
        for (const id of sectionIds) {
            const section = await page.$(`#${id}`);
            assert(section !== null, `セクション #${id} が存在する`);
        }

        // ==========================================
        // 9. Worksセクションのフィルターテスト
        // ==========================================
        console.log('\n【9. Worksセクションのフィルターテスト】');

        const filterBtns = await page.$$('.works-filter-buttons .filter-btn');
        assert(filterBtns.length > 0, `フィルターボタンが存在する（${filterBtns.length}個）`);

        const allFilterActive = await page.$eval('.filter-btn.filter-all', el => el.classList.contains('active'));
        assert(allFilterActive, '「すべて」フィルターが初期状態でアクティブ');

        // ==========================================
        // 10. フッターテスト
        // ==========================================
        console.log('\n【10. フッターテスト】');

        const footer = await page.$('footer.footer');
        assert(footer !== null, 'フッターが存在する');

        const footerLogo = await page.$('.footer-logo-img');
        assert(footerLogo !== null, 'フッターロゴが存在する');

        const footerLinks = await page.$$('.footer-link');
        assert(footerLinks.length >= 2, `フッターリンクが2つ以上存在する（${footerLinks.length}個）`);

        const footerSocialLinks = await page.$$('.footer-social-link');
        assert(footerSocialLinks.length >= 3, `フッターSNSリンクが3つ以上存在する（${footerSocialLinks.length}個）`);

        // ==========================================
        // 11. 外部リンクセクションテスト
        // ==========================================
        console.log('\n【11. 外部リンクセクションテスト】');

        const linkCards = await page.$$('.links-grid .link-card');
        assert(linkCards.length >= 5, `外部リンクカードが5つ以上存在する（${linkCards.length}個）`);

        // 外部リンクがtarget="_blank"を持つか
        const externalLinksCorrect = await page.$$eval('.link-card', cards => {
            return cards.every(card =>
                card.getAttribute('target') === '_blank' &&
                card.getAttribute('rel')?.includes('noopener')
            );
        });
        assert(externalLinksCorrect, '外部リンクが target="_blank" と rel="noopener" を持つ');

        // ==========================================
        // 12. 目次（TOC）テスト
        // ==========================================
        console.log('\n【12. 目次（TOC）テスト】');

        const toc = await page.$('#tocNav');
        assert(toc !== null, '目次ナビゲーションが存在する');

        const tocLinks = await page.$$('.toc-link');
        assert(tocLinks.length >= 5, `目次リンクが5つ以上存在する（${tocLinks.length}個）`);

        // ==========================================
        // 13. contact.html テスト
        // ==========================================
        console.log('\n【13. contact.html テスト】');

        await page.goto(`${BASE_URL}/contact.html`, { waitUntil: 'networkidle2', timeout: 15000 });

        const contactPageSection = await page.$('.contact-page-section');
        assert(contactPageSection !== null, 'contact.htmlのメインセクションが存在する');

        const pageTitle = await page.$eval('.page-title', el => el.textContent.trim());
        assert(pageTitle === '依頼・相談', 'contact.htmlのタイトルが「依頼・相談」');

        // サービスセクション
        const serviceCards = await page.$$('.service-compact-card');
        assert(serviceCards.length >= 3, `サービスカードが3つ以上存在する（${serviceCards.length}個）`);

        // FAQセクション
        const faqItems = await page.$$('.faq-compact-item');
        assert(faqItems.length >= 3, `FAQアイテムが3つ以上存在する（${faqItems.length}個）`);

        // contact.htmlからindex.htmlへ戻れるか
        const homeLink = await page.$('a[href="index.html"]');
        assert(homeLink !== null, 'contact.htmlにホームへのリンクが存在する');

        // ==========================================
        // 14. モバイル表示テスト
        // ==========================================
        console.log('\n【14. モバイル表示テスト】');

        await page.setViewport({ width: 375, height: 667 });
        await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 15000 });

        // モバイルでヒーローボタンが存在・表示されるか
        const mobileWorksBtn = await page.$('a.btn-hero[href="#works"]');
        assert(mobileWorksBtn !== null, 'モバイルで「作品を見る」ボタンが存在する');

        const mobileContactBtn = await page.$('a.btn-hero[href="contact.html"]');
        assert(mobileContactBtn !== null, 'モバイルで「依頼・相談」ボタンが存在する');

        // モバイルでボタンが覆われていないかテスト
        const mobileWorksBtnNotCovered = await page.evaluate(() => {
            const btn = document.querySelector('a.btn-hero[href="#works"]');
            const rect = btn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const topEl = document.elementFromPoint(centerX, centerY);
            return btn.contains(topEl) || btn === topEl;
        });
        assert(mobileWorksBtnNotCovered, 'モバイルで「作品を見る」ボタンが覆われていない');

        const mobileContactBtnNotCovered = await page.evaluate(() => {
            const btn = document.querySelector('a.btn-hero[href="contact.html"]');
            const rect = btn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const topEl = document.elementFromPoint(centerX, centerY);
            return btn.contains(topEl) || btn === topEl;
        });
        assert(mobileContactBtnNotCovered, 'モバイルで「依頼・相談」ボタンが覆われていない');

        // モバイルで「作品を見る」クリック後のスクロール
        await page.click('a.btn-hero[href="#works"]');
        await page.waitForFunction(() => window.scrollY > 50, { timeout: 5000 });
        const mobileScrollAfterClick = await page.evaluate(() => window.scrollY);
        assert(mobileScrollAfterClick > 50, `モバイルで「作品を見る」クリック後にスクロール（位置: ${mobileScrollAfterClick}）`);

        // モバイルで「依頼・相談」クリック後のナビゲーション
        await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 15000 });
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }),
            page.click('a.btn-hero[href="contact.html"]'),
        ]);
        const mobileContactUrl = page.url();
        assert(mobileContactUrl.includes('contact.html'), `モバイルで「依頼・相談」クリック後にcontact.htmlに遷移`);

        // ==========================================
        // 15. メタタグ・SEOテスト
        // ==========================================
        console.log('\n【15. メタタグ・SEOテスト】');

        await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 15000 });

        const metaDesc = await page.$eval('meta[name="description"]', el => el.getAttribute('content'));
        assert(metaDesc && metaDesc.length > 10, 'metaのdescriptionが設定されている');

        const ogTitle = await page.$eval('meta[property="og:title"]', el => el.getAttribute('content'));
        assert(ogTitle && ogTitle.includes('MEMEMIYA'), 'OGPタイトルにMEMEMIYAが含まれる');

        const ogImage = await page.$eval('meta[property="og:image"]', el => el.getAttribute('content'));
        assert(ogImage && ogImage.length > 0, 'OGP画像が設定されている');

        const twitterCard = await page.$eval('meta[property="twitter:card"]', el => el.getAttribute('content'));
        assert(twitterCard === 'summary_large_image', 'Twitter cardがsummary_large_imageに設定');

        // ==========================================
        // 16. アクセシビリティテスト
        // ==========================================
        console.log('\n【16. アクセシビリティテスト】');

        const navAriaLabel = await page.$eval('#mainNav', el => el.getAttribute('aria-label'));
        assert(navAriaLabel !== null, 'ナビゲーションにaria-labelが設定されている');

        const htmlLang = await page.$eval('html', el => el.getAttribute('lang'));
        assert(htmlLang === 'ja', 'htmlのlangが「ja」に設定されている');

        const favicon = await page.$('link[rel="icon"]');
        assert(favicon !== null, 'faviconが設定されている');

        // 画像にalt属性があるか
        const imagesWithoutAlt = await page.$$eval('img:not([alt])', imgs => imgs.length);
        assert(imagesWithoutAlt === 0, `alt属性のない画像が0個（実際: ${imagesWithoutAlt}個）`);

        // ==========================================
        // 17. 浮遊ソーシャルバーテスト
        // ==========================================
        console.log('\n【17. 浮遊ソーシャルバーテスト】');

        await page.setViewport({ width: 1280, height: 720 });
        await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 15000 });

        const socialBar = await page.$('.floating-social-bar');
        assert(socialBar !== null, '浮遊ソーシャルバーが存在する');

        const socialLinks = await page.$$('.floating-social-bar .social-link');
        assert(socialLinks.length >= 5, `ソーシャルリンクが5つ以上存在する（${socialLinks.length}個）`);

        // ==========================================
        // 18. 浮遊CTAボタンテスト
        // ==========================================
        console.log('\n【18. 浮遊CTAボタンテスト】');

        const floatingCta = await page.$('.floating-cta');
        assert(floatingCta !== null, '浮遊CTAボタンが存在する');

        const floatingCtaLink = await page.$eval('.btn-floating', el => el.getAttribute('href'));
        assert(floatingCtaLink === 'contact.html', '浮遊CTAがcontact.htmlにリンクしている');

        // スクロール前は非表示、スクロール後は表示
        const ctaHiddenInitial = await page.$eval('.floating-cta', el => {
            const style = window.getComputedStyle(el);
            return style.opacity === '0' || style.visibility === 'hidden';
        });
        assert(ctaHiddenInitial, '浮遊CTAがページ上部では非表示');

        await page.evaluate(() => window.scrollTo(0, 500));
        await new Promise(resolve => setTimeout(resolve, 500));

        const ctaVisibleAfterScroll = await page.$eval('.floating-cta', el => {
            const style = window.getComputedStyle(el);
            return style.opacity !== '0' && style.visibility !== 'hidden';
        });
        assert(ctaVisibleAfterScroll, '浮遊CTAがスクロール後に表示される');

        // ==========================================
        // 結果表示
        // ==========================================
        console.log('\n========================================');
        console.log(`結果: ${passed} 成功, ${failed} 失敗 / 合計 ${passed + failed}`);
        if (errors.length > 0) {
            console.log('\n失敗したテスト:');
            errors.forEach(e => console.log(`  ✗ ${e}`));
        }
        console.log('========================================');

    } catch (error) {
        console.error('\nテスト実行エラー:', error.message);
        failed++;
    } finally {
        await browser.close();
        server.close();
        process.exit(failed > 0 ? 1 : 0);
    }
})();
