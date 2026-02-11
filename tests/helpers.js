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

function getResults() {
    return { passed, failed, errors: [...errors] };
}

function resetResults() {
    passed = 0;
    failed = 0;
    errors.length = 0;
}

// 簡易HTTPサーバー
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
        '.woff2': 'font/woff2',
        '.woff': 'font/woff',
        '.ttf': 'font/ttf',
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

const ROOT_DIR = path.resolve(__dirname, '..');

module.exports = { assert, getResults, resetResults, createServer, ROOT_DIR };
