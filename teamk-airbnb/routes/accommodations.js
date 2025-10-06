const express = require('express');
const { body, validationResult, param } = require('express-validator');
const { Accommodation, Investor, Reservation, AccountingEntry } = require('../models');
const { authenticateToken, requireAuth, requireManager } = require('../middleware/auth');

const router = express.Router();

// 모든 라우트에 인증 필요
router.use(authenticateToken);

// 숙소 목록 조회
router.get('/', requireAuth, async (req, res) => {
    try {
        const { page = 1, limit = 20, search, investorId } = req.query;
        const offset = (page - 1) * limit;

        const whereCondition = { isActive: true };
        
        // 검색 조건
        if (search) {
            whereCondition[require('sequelize').Op.or] = [
                { accommodationName: { [require('sequelize').Op.like]: `%${search}%` } },
                { buildingName: { [require('sequelize').Op.like]: `%${search}%` } },
                { address: { [require('sequelize').Op.like]: `%${search}%` } }
            ];
        }

        if (investorId) {
            whereCondition.investorId = investorId;
        }

        const { count, rows } = await Accommodation.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: Investor,
                    as: 'investor',
                    attributes: ['id', 'name', 'email']
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.json({
            accommodations: rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / limit)
            }
        });

    } catch (error) {
        console.error('숙소 목록 조회 오류:', error);
        res.status(500).json({
            error: '숙소 목록을 가져오는 중 오류가 발생했습니다.'
        });
    }
});

// 특정 숙소 조회
router.get('/:id', [
    requireAuth,
    param('id').isUUID().withMessage('올바른 숙소 ID가 아닙니다.')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: '잘못된 요청입니다.',
                details: errors.array()
            });
        }

        const accommodation = await Accommodation.findOne({
            where: { id: req.params.id, isActive: true },
            include: [
                {
                    model: Investor,
                    as: 'investor',
                    attributes: ['id', 'name', 'email', 'phone']
                },
                {
                    model: Reservation,
                    as: 'reservations',
                    where: { status: { [require('sequelize').Op.ne]: 'cancelled' } },
                    required: false,
                    order: [['checkIn', 'DESC']],
                    limit: 5
                }
            ]
        });

        if (!accommodation) {
            return res.status(404).json({
                error: '숙소를 찾을 수 없습니다.',
                code: 'ACCOMMODATION_NOT_FOUND'
            });
        }

        res.json({ accommodation });

    } catch (error) {
        console.error('숙소 조회 오류:', error);
        res.status(500).json({
            error: '숙소 정보를 가져오는 중 오류가 발생했습니다.'
        });
    }
});

// 새 숙소 등록
router.post('/', [
    requireManager,
    body('accommodationName').isLength({ min: 1, max: 200 }).withMessage('숙소명은 1-200자 사이여야 합니다.'),
    body('investorName').isLength({ min: 1, max: 100 }).withMessage('투자자명을 입력해주세요.'),
    body('contractDate').optional().isDate().withMessage('올바른 계약일자를 입력해주세요.'),
    body('deposit').optional().isNumeric().withMessage('보증금은 숫자여야 합니다.'),
    body('monthlyRent').optional().isNumeric().withMessage('월세는 숫자여야 합니다.')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: '입력 값이 올바르지 않습니다.',
                details: errors.array()
            });
        }

        // 투자자 존재 확인
        const investor = await Investor.findOne({
            where: { name: req.body.investorName, isActive: true }
        });

        const accommodationData = {
            ...req.body,
            investorId: investor?.id || null
        };

        const accommodation = await Accommodation.create(accommodationData);

        res.status(201).json({
            message: '숙소가 성공적으로 등록되었습니다.',
            accommodation
        });

    } catch (error) {
        console.error('숙소 등록 오류:', error);
        res.status(500).json({
            error: '숙소 등록 중 오류가 발생했습니다.'
        });
    }
});

// 숙소 정보 수정
router.put('/:id', [
    requireManager,
    param('id').isUUID().withMessage('올바른 숙소 ID가 아닙니다.'),
    body('accommodationName').optional().isLength({ min: 1, max: 200 }).withMessage('숙소명은 1-200자 사이여야 합니다.')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: '입력 값이 올바르지 않습니다.',
                details: errors.array()
            });
        }

        const accommodation = await Accommodation.findOne({
            where: { id: req.params.id, isActive: true }
        });

        if (!accommodation) {
            return res.status(404).json({
                error: '숙소를 찾을 수 없습니다.',
                code: 'ACCOMMODATION_NOT_FOUND'
            });
        }

        // 투자자명이 변경된 경우 investorId 업데이트
        if (req.body.investorName) {
            const investor = await Investor.findOne({
                where: { name: req.body.investorName, isActive: true }
            });
            req.body.investorId = investor?.id || null;
        }

        await accommodation.update(req.body);

        res.json({
            message: '숙소 정보가 성공적으로 수정되었습니다.',
            accommodation
        });

    } catch (error) {
        console.error('숙소 수정 오류:', error);
        res.status(500).json({
            error: '숙소 정보 수정 중 오류가 발생했습니다.'
        });
    }
});

// 숙소 삭제 (소프트 삭제)
router.delete('/:id', [
    requireManager,
    param('id').isUUID().withMessage('올바른 숙소 ID가 아닙니다.')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: '잘못된 요청입니다.',
                details: errors.array()
            });
        }

        const accommodation = await Accommodation.findOne({
            where: { id: req.params.id, isActive: true }
        });

        if (!accommodation) {
            return res.status(404).json({
                error: '숙소를 찾을 수 없습니다.',
                code: 'ACCOMMODATION_NOT_FOUND'
            });
        }

        // 활성 예약이 있는지 확인
        const activeReservations = await Reservation.count({
            where: {
                accommodationId: req.params.id,
                status: 'confirmed',
                checkOut: { [require('sequelize').Op.gte]: new Date() }
            }
        });

        if (activeReservations > 0) {
            return res.status(400).json({
                error: '활성 예약이 있는 숙소는 삭제할 수 없습니다.',
                code: 'HAS_ACTIVE_RESERVATIONS',
                activeReservations
            });
        }

        await accommodation.update({ isActive: false });

        res.json({
            message: '숙소가 성공적으로 삭제되었습니다.'
        });

    } catch (error) {
        console.error('숙소 삭제 오류:', error);
        res.status(500).json({
            error: '숙소 삭제 중 오류가 발생했습니다.'
        });
    }
});

// 숙소별 수익 통계
router.get('/:id/statistics', [
    requireAuth,
    param('id').isUUID().withMessage('올바른 숙소 ID가 아닙니다.')
], async (req, res) => {
    try {
        const { year = new Date().getFullYear(), month } = req.query;
        
        const whereCondition = {
            accommodationId: req.params.id
        };

        if (month) {
            whereCondition.transactionDate = {
                [require('sequelize').Op.and]: [
                    require('sequelize').fn('YEAR', require('sequelize').col('transactionDate')),
                    year
                ],
                [require('sequelize').Op.and]: [
                    require('sequelize').fn('MONTH', require('sequelize').col('transactionDate')),
                    month
                ]
            };
        } else {
            whereCondition[require('sequelize').fn('YEAR', require('sequelize').col('transactionDate'))] = year;
        }

        const statistics = await AccountingEntry.findAll({
            where: whereCondition,
            attributes: [
                'type',
                [require('sequelize').fn('SUM', require('sequelize').col('amount')), 'total'],
                [require('sequelize').fn('COUNT', '*'), 'count']
            ],
            group: ['type']
        });

        const reservationStats = await Reservation.findAll({
            where: {
                accommodationId: req.params.id,
                status: { [require('sequelize').Op.ne]: 'cancelled' }
            },
            attributes: [
                [require('sequelize').fn('COUNT', '*'), 'totalReservations'],
                [require('sequelize').fn('SUM', require('sequelize').col('totalAmount')), 'totalRevenue'],
                [require('sequelize').fn('AVG', require('sequelize').col('totalAmount')), 'avgRevenue']
            ]
        });

        res.json({
            statistics,
            reservationStats
        });

    } catch (error) {
        console.error('숙소 통계 조회 오류:', error);
        res.status(500).json({
            error: '숙소 통계를 가져오는 중 오류가 발생했습니다.'
        });
    }
});

module.exports = router;