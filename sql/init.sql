-- Teamk D1 데이터베이스 초기화 스크립트
-- 실행 방법: wrangler d1 execute teamk-data --file=./sql/init.sql

-- 투자자 테이블
DROP TABLE IF EXISTS investors;
CREATE TABLE investors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT DEFAULT '',
    email TEXT DEFAULT '',
    investmentRatio REAL DEFAULT 0,
    accommodations TEXT DEFAULT '[]', -- JSON 배열로 저장
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 숙소 테이블
DROP TABLE IF EXISTS accommodations;
CREATE TABLE accommodations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT DEFAULT '',
    contractType TEXT DEFAULT '',
    monthlyRent REAL DEFAULT 0,
    deposit REAL DEFAULT 0,
    contractStart DATE,
    contractEnd DATE,
    airbnbUrl TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 예약 테이블
DROP TABLE IF EXISTS reservations;
CREATE TABLE reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    accommodationId INTEGER,
    guestName TEXT NOT NULL,
    checkIn DATE NOT NULL,
    checkOut DATE NOT NULL,
    platform TEXT DEFAULT 'Airbnb',
    amount REAL DEFAULT 0,
    commission REAL DEFAULT 0,
    status TEXT DEFAULT 'confirmed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (accommodationId) REFERENCES accommodations(id)
);

-- 정산 테이블
DROP TABLE IF EXISTS accounting;
CREATE TABLE accounting (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    accommodationId INTEGER,
    month TEXT NOT NULL, -- YYYY-MM 형식
    revenue REAL DEFAULT 0,
    expenses REAL DEFAULT 0,
    netIncome REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (accommodationId) REFERENCES accommodations(id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_investors_userId ON investors(userId);
CREATE INDEX IF NOT EXISTS idx_accommodations_name ON accommodations(name);
CREATE INDEX IF NOT EXISTS idx_reservations_dates ON reservations(checkIn, checkOut);
CREATE INDEX IF NOT EXISTS idx_accounting_month ON accounting(month);

-- 샘플 데이터 (선택적)
INSERT OR IGNORE INTO investors (userId, password, name, email, investmentRatio) VALUES 
('admin', '881114', '관리자', 'admin@teamk.com', 100.0);

-- 테이블 생성 완료 확인
SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;