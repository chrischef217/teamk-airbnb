const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { generateToken, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 회원가입
router.post('/register', [
    body('username').isLength({ min: 3, max: 50 }).withMessage('사용자명은 3-50자 사이여야 합니다.'),
    body('email').isEmail().withMessage('유효한 이메일 주소를 입력해주세요.'),
    body('password').isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다.'),
    body('name').isLength({ min: 2, max: 100 }).withMessage('이름은 2-100자 사이여야 합니다.'),
    body('role').optional().isIn(['admin', 'manager', 'investor', 'viewer'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: '입력 값이 올바르지 않습니다.',
                details: errors.array()
            });
        }

        const { username, email, password, name, role = 'viewer' } = req.body;

        // 중복 확인
        const existingUser = await User.findOne({
            where: {
                [require('sequelize').Op.or]: [
                    { username },
                    { email }
                ]
            }
        });

        if (existingUser) {
            return res.status(409).json({
                error: '이미 존재하는 사용자명 또는 이메일입니다.',
                code: 'USER_EXISTS'
            });
        }

        // 비밀번호 해싱
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 사용자 생성
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            name,
            role,
            language: 'ko'
        });

        // 토큰 생성
        const token = generateToken(user.id, user.role);

        res.status(201).json({
            message: '회원가입이 완료되었습니다.',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name,
                role: user.role,
                language: user.language
            },
            token
        });

    } catch (error) {
        console.error('회원가입 오류:', error);
        res.status(500).json({
            error: '회원가입 중 오류가 발생했습니다.',
            code: 'REGISTRATION_ERROR'
        });
    }
});

// 로그인
router.post('/login', [
    body('username').notEmpty().withMessage('사용자명 또는 이메일을 입력해주세요.'),
    body('password').notEmpty().withMessage('비밀번호를 입력해주세요.')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: '입력 값이 올바르지 않습니다.',
                details: errors.array()
            });
        }

        const { username, password } = req.body;

        // 사용자 찾기 (username 또는 email로 검색)
        const user = await User.findOne({
            where: {
                [require('sequelize').Op.or]: [
                    { username },
                    { email: username }
                ]
            }
        });

        if (!user || !user.isActive) {
            return res.status(401).json({
                error: '사용자명 또는 비밀번호가 올바르지 않습니다.',
                code: 'INVALID_CREDENTIALS'
            });
        }

        // 비밀번호 확인
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                error: '사용자명 또는 비밀번호가 올바르지 않습니다.',
                code: 'INVALID_CREDENTIALS'
            });
        }

        // 마지막 로그인 시간 업데이트
        await user.update({ lastLogin: new Date() });

        // 토큰 생성
        const token = generateToken(user.id, user.role);

        res.json({
            message: '로그인 성공',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name,
                role: user.role,
                language: user.language
            },
            token
        });

    } catch (error) {
        console.error('로그인 오류:', error);
        res.status(500).json({
            error: '로그인 중 오류가 발생했습니다.',
            code: 'LOGIN_ERROR'
        });
    }
});

// 로그아웃 (클라이언트에서 토큰 삭제)
router.post('/logout', authenticateToken, (req, res) => {
    res.json({
        message: '로그아웃되었습니다.'
    });
});

// 현재 사용자 정보 조회
router.get('/me', authenticateToken, async (req, res) => {
    try {
        res.json({
            user: {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email,
                name: req.user.name,
                role: req.user.role,
                language: req.user.language,
                lastLogin: req.user.lastLogin
            }
        });
    } catch (error) {
        console.error('사용자 정보 조회 오류:', error);
        res.status(500).json({
            error: '사용자 정보를 가져오는 중 오류가 발생했습니다.'
        });
    }
});

// 비밀번호 변경
router.put('/password', [
    authenticateToken,
    body('currentPassword').notEmpty().withMessage('현재 비밀번호를 입력해주세요.'),
    body('newPassword').isLength({ min: 6 }).withMessage('새 비밀번호는 최소 6자 이상이어야 합니다.')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: '입력 값이 올바르지 않습니다.',
                details: errors.array()
            });
        }

        const { currentPassword, newPassword } = req.body;

        // 현재 비밀번호 확인
        const isValidPassword = await bcrypt.compare(currentPassword, req.user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                error: '현재 비밀번호가 올바르지 않습니다.',
                code: 'INVALID_CURRENT_PASSWORD'
            });
        }

        // 새 비밀번호 해싱
        const saltRounds = 12;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // 비밀번호 업데이트
        await req.user.update({ password: hashedNewPassword });

        res.json({
            message: '비밀번호가 성공적으로 변경되었습니다.'
        });

    } catch (error) {
        console.error('비밀번호 변경 오류:', error);
        res.status(500).json({
            error: '비밀번호 변경 중 오류가 발생했습니다.'
        });
    }
});

module.exports = router;