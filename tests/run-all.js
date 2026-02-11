const { execSync } = require('child_process');
const path = require('path');

const testFiles = [
    'e2e.test.js',
    'comprehensive.test.js',
];

let totalFailed = 0;

for (const file of testFiles) {
    const filePath = path.join(__dirname, file);
    console.log(`\n${'='.repeat(50)}`);
    console.log(`実行: ${file}`);
    console.log(`${'='.repeat(50)}\n`);

    try {
        execSync(`node "${filePath}"`, { stdio: 'inherit', timeout: 180000 });
    } catch (error) {
        totalFailed++;
    }
}

console.log(`\n${'='.repeat(50)}`);
console.log(`全テストファイル完了: ${totalFailed === 0 ? '全て成功' : `${totalFailed} ファイルに失敗あり`}`);
console.log(`${'='.repeat(50)}`);

process.exit(totalFailed > 0 ? 1 : 0);
