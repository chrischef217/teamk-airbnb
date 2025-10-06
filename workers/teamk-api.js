// Cloudflare Worker for Teamk API
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // CORS 헤더 설정
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        // OPTIONS 요청 (CORS preflight)
        if (method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            let response;

            // 라우팅
            if (path === '/health') {
                response = handleHealth();
            } else if (path === '/api/init') {
                response = await handleDatabaseInit(request, env, method);
            } else if (path.startsWith('/api/investors')) {
                response = await handleInvestors(request, env, path, method);
            } else if (path.startsWith('/api/accommodations')) {
                response = await handleAccommodations(request, env, path, method);
            } else if (path.startsWith('/api/reservations')) {
                response = await handleReservations(request, env, path, method);
            } else if (path.startsWith('/api/accounting')) {
                response = await handleAccounting(request, env, path, method);
            } else {
                response = new Response('Not Found', { status: 404 });
            }

            // CORS 헤더 추가
            Object.keys(corsHeaders).forEach(key => {
                response.headers.set(key, corsHeaders[key]);
            });

            return response;

        } catch (error) {
            console.error('Worker 오류:', error);
            const errorResponse = new Response(
                JSON.stringify({ 
                    success: false, 
                    error: error.message || '서버 오류가 발생했습니다.' 
                }),
                { 
                    status: 500,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                }
            );
            return errorResponse;
        }
    }
};

// 헬스체크
function handleHealth() {
    return new Response(
        JSON.stringify({ 
            status: 'OK', 
            timestamp: new Date().toISOString(),
            service: 'Teamk API Worker'
        }),
        { 
            headers: { 'Content-Type': 'application/json' } 
        }
    );
}

// 투자자 관리
async function handleInvestors(request, env, path, method) {
    const pathParts = path.split('/');
    const investorId = pathParts[3]; // /api/investors/{id}

    switch (method) {
        case 'GET':
            if (investorId) {
                return await getInvestor(env, investorId);
            } else {
                return await getInvestors(env);
            }

        case 'POST':
            return await createInvestor(request, env);

        case 'PUT':
            if (investorId) {
                return await updateInvestor(request, env, investorId);
            }
            break;

        case 'DELETE':
            if (investorId) {
                return await deleteInvestor(env, investorId);
            }
            break;
    }

    return new Response('Method not allowed', { status: 405 });
}

// 투자자 CRUD 함수들
async function getInvestors(env) {
    try {
        const result = await env.TEAMK_DB.prepare(
            'SELECT * FROM investors ORDER BY created_at DESC'
        ).all();

        const investors = result.results.map(investor => ({
            ...investor,
            accommodations: JSON.parse(investor.accommodations || '[]')
        }));

        return new Response(
            JSON.stringify({ 
                success: true, 
                data: investors,
                count: investors.length
            }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

async function getInvestor(env, id) {
    try {
        const result = await env.TEAMK_DB.prepare(
            'SELECT * FROM investors WHERE id = ?'
        ).bind(id).first();

        if (!result) {
            return new Response(
                JSON.stringify({ success: false, error: '투자자를 찾을 수 없습니다.' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const investor = {
            ...result,
            accommodations: JSON.parse(result.accommodations || '[]')
        };

        return new Response(
            JSON.stringify({ success: true, data: investor }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

async function createInvestor(request, env) {
    try {
        const data = await request.json();
        
        const result = await env.TEAMK_DB.prepare(`
            INSERT INTO investors (userId, password, name, phone, email, investmentRatio, accommodations)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(
            data.userId,
            data.password,
            data.name,
            data.phone || '',
            data.email || '',
            data.investmentRatio || 0,
            JSON.stringify(data.accommodations || [])
        ).run();

        if (!result.success) {
            throw new Error('투자자 생성 실패');
        }

        // 생성된 투자자 정보 반환
        const newInvestor = await env.TEAMK_DB.prepare(
            'SELECT * FROM investors WHERE id = ?'
        ).bind(result.meta.last_row_id).first();

        return new Response(
            JSON.stringify({ 
                success: true, 
                data: {
                    ...newInvestor,
                    accommodations: JSON.parse(newInvestor.accommodations || '[]')
                }
            }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

async function updateInvestor(request, env, id) {
    try {
        const data = await request.json();
        
        const result = await env.TEAMK_DB.prepare(`
            UPDATE investors 
            SET userId = ?, password = ?, name = ?, phone = ?, email = ?, 
                investmentRatio = ?, accommodations = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).bind(
            data.userId,
            data.password,
            data.name,
            data.phone || '',
            data.email || '',
            data.investmentRatio || 0,
            JSON.stringify(data.accommodations || []),
            id
        ).run();

        if (!result.success || result.meta.changes === 0) {
            throw new Error('투자자 업데이트 실패');
        }

        // 업데이트된 투자자 정보 반환
        const updatedInvestor = await env.TEAMK_DB.prepare(
            'SELECT * FROM investors WHERE id = ?'
        ).bind(id).first();

        return new Response(
            JSON.stringify({ 
                success: true, 
                data: {
                    ...updatedInvestor,
                    accommodations: JSON.parse(updatedInvestor.accommodations || '[]')
                }
            }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

async function deleteInvestor(env, id) {
    try {
        const result = await env.TEAMK_DB.prepare(
            'DELETE FROM investors WHERE id = ?'
        ).bind(id).run();

        if (!result.success || result.meta.changes === 0) {
            throw new Error('투자자 삭제 실패');
        }

        return new Response(
            JSON.stringify({ success: true, message: '투자자가 삭제되었습니다.' }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

// 숙소 관리
async function handleAccommodations(request, env, path, method) {
    const pathParts = path.split('/');
    const accommodationId = pathParts[3]; // /api/accommodations/{id}

    switch (method) {
        case 'GET':
            if (accommodationId) {
                return await getAccommodation(env, accommodationId);
            } else {
                return await getAccommodations(env);
            }

        case 'POST':
            return await createAccommodation(request, env);

        case 'PUT':
            if (accommodationId) {
                return await updateAccommodation(request, env, accommodationId);
            }
            break;

        case 'DELETE':
            if (accommodationId) {
                return await deleteAccommodation(env, accommodationId);
            }
            break;
    }

    return new Response('Method not allowed', { status: 405 });
}

// 숙소 CRUD 함수들
async function getAccommodations(env) {
    try {
        const result = await env.TEAMK_DB.prepare(
            'SELECT * FROM accommodations ORDER BY created_at DESC'
        ).all();

        return new Response(
            JSON.stringify({ 
                success: true, 
                data: result.results,
                count: result.results.length
            }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

async function createAccommodation(request, env) {
    try {
        const data = await request.json();
        
        const result = await env.TEAMK_DB.prepare(`
            INSERT INTO accommodations (name, location, contractType, monthlyRent, deposit, 
                                      contractStart, contractEnd, airbnbUrl, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            data.name,
            data.location || '',
            data.contractType || '',
            data.monthlyRent || 0,
            data.deposit || 0,
            data.contractStart || null,
            data.contractEnd || null,
            data.airbnbUrl || '',
            data.notes || ''
        ).run();

        if (!result.success) {
            throw new Error('숙소 생성 실패');
        }

        // 생성된 숙소 정보 반환
        const newAccommodation = await env.TEAMK_DB.prepare(
            'SELECT * FROM accommodations WHERE id = ?'
        ).bind(result.meta.last_row_id).first();

        return new Response(
            JSON.stringify({ success: true, data: newAccommodation }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

// 예약 관리 (간단한 구현)
async function handleReservations(request, env, path, method) {
    if (method === 'GET') {
        return new Response(
            JSON.stringify({ success: true, data: [], count: 0 }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    }
    return new Response('Not implemented yet', { status: 501 });
}

// 정산 관리 (간단한 구현)
async function handleAccounting(request, env, path, method) {
    if (method === 'GET') {
        return new Response(
            JSON.stringify({ success: true, data: [], count: 0 }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    }
    return new Response('Not implemented yet', { status: 501 });
}

// 데이터베이스 초기화
async function handleDatabaseInit(request, env, method) {
    if (method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        // 테이블 생성 SQL 실행
        const initQueries = [
            // 투자자 테이블
            `CREATE TABLE IF NOT EXISTS investors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                name TEXT NOT NULL,
                phone TEXT DEFAULT '',
                email TEXT DEFAULT '',
                investmentRatio REAL DEFAULT 0,
                accommodations TEXT DEFAULT '[]',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            
            // 숙소 테이블
            `CREATE TABLE IF NOT EXISTS accommodations (
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
            )`,
            
            // 예약 테이블
            `CREATE TABLE IF NOT EXISTS reservations (
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
            )`,
            
            // 정산 테이블
            `CREATE TABLE IF NOT EXISTS accounting (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                accommodationId INTEGER,
                month TEXT NOT NULL,
                revenue REAL DEFAULT 0,
                expenses REAL DEFAULT 0,
                netIncome REAL DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (accommodationId) REFERENCES accommodations(id)
            )`
        ];

        // 각 쿼리 실행
        for (const query of initQueries) {
            const result = await env.TEAMK_DB.prepare(query).run();
            if (!result.success) {
                throw new Error(`테이블 생성 실패: ${query}`);
            }
        }

        // 인덱스 생성
        const indexQueries = [
            'CREATE INDEX IF NOT EXISTS idx_investors_userId ON investors(userId)',
            'CREATE INDEX IF NOT EXISTS idx_accommodations_name ON accommodations(name)',
            'CREATE INDEX IF NOT EXISTS idx_reservations_dates ON reservations(checkIn, checkOut)',
            'CREATE INDEX IF NOT EXISTS idx_accounting_month ON accounting(month)'
        ];

        for (const query of indexQueries) {
            await env.TEAMK_DB.prepare(query).run();
        }

        return new Response(
            JSON.stringify({ 
                success: true, 
                message: '데이터베이스 초기화가 완료되었습니다.',
                tables: ['investors', 'accommodations', 'reservations', 'accounting']
            }),
            { headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ 
                success: false, 
                error: `초기화 실패: ${error.message}` 
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}