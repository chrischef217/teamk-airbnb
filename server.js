const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 보안 미들웨어
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"]
        }
    }
}));

// CORS 설정
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15분
    max: 100, // 최대 100개 요청
    message: '너무 많은 요청입니다. 잠시 후 다시 시도해주세요.'
});
app.use('/api/', limiter);

// 미들웨어
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 정적 파일 서비스 (프론트엔드)
app.use(express.static(path.join(__dirname, 'public')));

// API 라우트
app.use('/api', require('./routes/health'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/accommodations', require('./routes/accommodations'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/investors', require('./routes/investors'));
// app.use('/api/reservations', require('./routes/reservations'));
// app.use('/api/accounting', require('./routes/accounting'));
// app.use('/api/analytics', require('./routes/analytics'));
// app.use('/api/settlements', require('./routes/settlements'));

// 프론트엔드 라우트 (SPA 지원)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: '서버 내부 오류가 발생했습니다.',
        message: process.env.NODE_ENV === 'development' ? err.message : '서버 오류'
    });
});

// 404 핸들러
app.use((req, res) => {
    res.status(404).json({
        error: '요청한 경로를 찾을 수 없습니다.'
    });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 Teamk 공유숙박 관리 시스템 서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`📱 프론트엔드: http://localhost:${PORT}`);
    console.log(`🔌 API 엔드포인트: http://localhost:${PORT}/api`);
});

module.exports = app;