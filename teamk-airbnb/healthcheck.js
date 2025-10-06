/**
 * Railway/Render 헬스체크 엔드포인트
 */

const http = require('http');

const options = {
    hostname: 'localhost',
    port: process.env.PORT || 3000,
    path: '/api/health',
    timeout: 2000
};

const request = http.request(options, (res) => {
    console.log(`헬스체크 상태: ${res.statusCode}`);
    if (res.statusCode === 200) {
        process.exit(0);
    } else {
        process.exit(1);
    }
});

request.on('error', (err) => {
    console.error('헬스체크 실패:', err.message);
    process.exit(1);
});

request.on('timeout', () => {
    console.error('헬스체크 타임아웃');
    request.destroy();
    process.exit(1);
});

request.end();