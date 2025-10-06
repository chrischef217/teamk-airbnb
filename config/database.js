const { Sequelize } = require('sequelize');
require('dotenv').config();

// 데이터베이스 연결 설정
const sequelize = new Sequelize(
    process.env.DB_NAME || 'teamk_accommodation',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        dialectOptions: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        },
        pool: {
            max: 20,
            min: 0,
            acquire: 60000,
            idle: 10000
        },
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        timezone: '+07:00' // 태국 시간대
    }
);

// 데이터베이스 연결 테스트
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ 데이터베이스 연결 성공');
    } catch (error) {
        console.error('❌ 데이터베이스 연결 실패:', error);
        process.exit(1);
    }
}

// 데이터베이스 동기화
async function syncDatabase() {
    try {
        await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
        console.log('📊 데이터베이스 테이블 동기화 완료');
    } catch (error) {
        console.error('❌ 데이터베이스 동기화 실패:', error);
    }
}

module.exports = {
    sequelize,
    testConnection,
    syncDatabase
};