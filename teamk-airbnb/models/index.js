const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

// 사용자 모델
const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'manager', 'investor', 'viewer'),
        defaultValue: 'viewer'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    lastLogin: {
        type: DataTypes.DATE
    },
    language: {
        type: DataTypes.STRING(5),
        defaultValue: 'ko'
    }
}, {
    tableName: 'users',
    timestamps: true
});

// 투자자 모델
const Investor = sequelize.define('Investor', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(20)
    },
    investorRatio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 100
        }
    },
    companyRatio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 100
        }
    },
    investmentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    settlementDay: {
        type: DataTypes.INTEGER,
        validate: {
            min: 1,
            max: 31
        }
    },
    notes: {
        type: DataTypes.TEXT
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'investors',
    timestamps: true
});

// 숙소 모델
const Accommodation = sequelize.define('Accommodation', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    accommodationName: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    buildingName: {
        type: DataTypes.STRING(200)
    },
    address: {
        type: DataTypes.TEXT
    },
    floor: {
        type: DataTypes.INTEGER
    },
    roomNumber: {
        type: DataTypes.STRING(20)
    },
    keyCount: {
        type: DataTypes.INTEGER
    },
    parkingMethod: {
        type: DataTypes.STRING(100)
    },
    investorName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    contractDate: {
        type: DataTypes.DATEONLY
    },
    deposit: {
        type: DataTypes.DECIMAL(12, 2)
    },
    monthlyRent: {
        type: DataTypes.DECIMAL(12, 2)
    },
    rentDate: {
        type: DataTypes.INTEGER
    },
    agencyName: {
        type: DataTypes.STRING(100)
    },
    agencyContact: {
        type: DataTypes.STRING(50)
    },
    notes: {
        type: DataTypes.TEXT
    },
    websiteUrl: {
        type: DataTypes.STRING(500)
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'accommodations',
    timestamps: true
});

// 예약 모델
const Reservation = sequelize.define('Reservation', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    guestName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    checkIn: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    checkOut: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    guestCount: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    totalAmount: {
        type: DataTypes.DECIMAL(12, 2)
    },
    commission: {
        type: DataTypes.DECIMAL(12, 2)
    },
    platform: {
        type: DataTypes.STRING(50)
    },
    status: {
        type: DataTypes.ENUM('confirmed', 'cancelled', 'completed'),
        defaultValue: 'confirmed'
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'reservations',
    timestamps: true
});

// 회계 모델
const AccountingEntry = sequelize.define('AccountingEntry', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    type: {
        type: DataTypes.ENUM('income', 'expense'),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING(5),
        defaultValue: 'THB'
    },
    transactionDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'accounting_entries',
    timestamps: true
});

// 관계 정의
User.hasMany(Investor, { foreignKey: 'createdBy', as: 'createdInvestors' });
Investor.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

Investor.hasMany(Accommodation, { foreignKey: 'investorId', as: 'accommodations' });
Accommodation.belongsTo(Investor, { foreignKey: 'investorId', as: 'investor' });

Accommodation.hasMany(Reservation, { foreignKey: 'accommodationId', as: 'reservations' });
Reservation.belongsTo(Accommodation, { foreignKey: 'accommodationId', as: 'accommodation' });

Accommodation.hasMany(AccountingEntry, { foreignKey: 'accommodationId', as: 'accountingEntries' });
AccountingEntry.belongsTo(Accommodation, { foreignKey: 'accommodationId', as: 'accommodation' });

Investor.hasMany(AccountingEntry, { foreignKey: 'investorId', as: 'accountingEntries' });
AccountingEntry.belongsTo(Investor, { foreignKey: 'investorId', as: 'investor' });

module.exports = {
    User,
    Investor,
    Accommodation,
    Reservation,
    AccountingEntry,
    sequelize
};