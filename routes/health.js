const express = require('express');
const { sequelize } = require('../models');

const router = express.Router();

// 헬스체크 엔드포인트
router.get('/health', async (req, res) => {
    try {
        // 데이터베이스 연결 확인
        await sequelize.authenticate();
        
        const status = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: process.env.npm_package_version || '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            database: 'connected',
            uptime: process.uptime(),
            memory: process.memoryUsage()
        };
        
        res.status(200).json(status);
        
    } catch (error) {
        console.error('헬스체크 실패:', error);
        
        const status = {
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error.message,
            database: 'disconnected'
        };
        
        res.status(503).json(status);
    }
});

// 간단한 ping 엔드포인트
router.get('/ping', (req, res) => {
    res.status(200).json({ 
        message: 'pong',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;