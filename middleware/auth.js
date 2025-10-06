const jwt = require('jsonwebtoken');
const { User } = require('../models');

// JWT 토큰 생성
const generateToken = (userId, role) => {
    return jwt.sign(
        { userId, role },
        process.env.JWT_SECRET || 'teamk-accommodation-secret-key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

// JWT 토큰 검증 미들웨어
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                error: '인증 토큰이 필요합니다.',
                code: 'TOKEN_MISSING'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'teamk-accommodation-secret-key');
        
        // 사용자 정보 조회
        const user = await User.findByPk(decoded.userId);
        if (!user || !user.isActive) {
            return res.status(401).json({
                error: '유효하지 않은 사용자입니다.',
                code: 'INVALID_USER'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: '토큰이 만료되었습니다. 다시 로그인해주세요.',
                code: 'TOKEN_EXPIRED'
            });
        }
        
        return res.status(403).json({
            error: '유효하지 않은 토큰입니다.',
            code: 'TOKEN_INVALID'
        });
    }
};

// 권한 확인 미들웨어
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: '인증이 필요합니다.',
                code: 'AUTH_REQUIRED'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: '권한이 없습니다.',
                code: 'INSUFFICIENT_PERMISSIONS',
                requiredRoles: roles,
                userRole: req.user.role
            });
        }

        next();
    };
};

// 관리자 권한 확인
const requireAdmin = requireRole(['admin']);

// 관리자 또는 매니저 권한 확인
const requireManager = requireRole(['admin', 'manager']);

// 모든 로그인 사용자 (투자자 포함)
const requireAuth = requireRole(['admin', 'manager', 'investor', 'viewer']);

module.exports = {
    generateToken,
    authenticateToken,
    requireRole,
    requireAdmin,
    requireManager,
    requireAuth
};