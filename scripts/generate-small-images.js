// 小さい圧縮版画像を生成するスクリプト
// 元画像はそのまま残し、small/ フォルダに圧縮版を生成する

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// 処理対象フォルダと設定
const targets = [
    {
        input:  path.join(ROOT, 'assets/images/thumbnails'),
        output: path.join(ROOT, 'assets/images/thumbnails/small'),
        maxWidth: 400,
        quality: 60,
    },
    {
        input:  path.join(ROOT, 'assets/images/flyers'),
        output: path.join(ROOT, 'assets/images/flyers/small'),
        maxWidth: 300,
        quality: 55,
    },
    {
        input:  path.join(ROOT, 'assets/images/artistPhoto'),
        output: path.join(ROOT, 'assets/images/artistPhoto/small'),
        maxWidth: 400,
        quality: 60,
    },
];

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];

async function processImage(inputPath, outputPath, maxWidth, quality) {
    try {
        await sharp(inputPath)
            .resize({ width: maxWidth, withoutEnlargement: true })
            .jpeg({ quality, mozjpeg: true })
            .toFile(outputPath);

        const inSize  = fs.statSync(inputPath).size;
        const outSize = fs.statSync(outputPath).size;
        const ratio   = Math.round((1 - outSize / inSize) * 100);
        console.log(`  OK  ${path.basename(inputPath)} → ${Math.round(outSize / 1024)}KB (${ratio}%削減)`);
    } catch (err) {
        console.error(`  NG  ${path.basename(inputPath)}: ${err.message}`);
    }
}

async function processFolder({ input, output, maxWidth, quality }) {
    if (!fs.existsSync(input)) return;
    if (!fs.existsSync(output)) fs.mkdirSync(output, { recursive: true });

    const files = fs.readdirSync(input).filter(f => {
        const ext = path.extname(f).toLowerCase();
        return IMAGE_EXTS.includes(ext) && !fs.statSync(path.join(input, f)).isDirectory();
    });

    console.log(`\n[${path.relative(ROOT, input)}] → [${path.relative(ROOT, output)}]`);
    for (const file of files) {
        const inputPath  = path.join(input, file);
        // 出力は常に .jpg
        const baseName   = path.basename(file, path.extname(file));
        const outputPath = path.join(output, baseName + '.jpg');
        await processImage(inputPath, outputPath, maxWidth, quality);
    }
}

(async () => {
    console.log('=== 小サイズ画像生成 ===');
    for (const target of targets) {
        await processFolder(target);
    }
    console.log('\n完了');
})();
