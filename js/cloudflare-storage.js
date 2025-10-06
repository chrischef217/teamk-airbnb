// Cloudflare D1을 데이터베이스로 사용하는 저장소 시스템
class CloudflareStorage {
    constructor() {
        this.apiToken = null;
        this.accountId = null;
        this.databaseId = null;
        this.workerUrl = null;
        
        // localStorage에서 설정 로드
        this.loadConfig();
    }

    // Cloudflare 설정 저장
    saveConfig(apiToken, accountId, databaseId, workerUrl) {
        this.apiToken = apiToken;
        this.accountId = accountId;
        this.databaseId = databaseId;
        this.workerUrl = workerUrl;
        
        localStorage.setItem('cf_api_token', apiToken);
        localStorage.setItem('cf_account_id', accountId);
        localStorage.setItem('cf_database_id', databaseId);
        localStorage.setItem('cf_worker_url', workerUrl);
        
        console.log('✅ Cloudflare 설정 저장됨');
    }

    // Cloudflare 설정 로드
    loadConfig() {
        this.apiToken = localStorage.getItem('cf_api_token');
        this.accountId = localStorage.getItem('cf_account_id');
        this.databaseId = localStorage.getItem('cf_database_id');
        this.workerUrl = localStorage.getItem('cf_worker_url');
        
        if (this.isConfigured()) {
            console.log('📡 Cloudflare 설정 로드됨');
            return true;
        }
        return false;
    }

    // 설정 확인
    isConfigured() {
        return !!(this.apiToken && this.accountId && this.databaseId && this.workerUrl);
    }

    // API 요청 헤더
    getHeaders() {
        return {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json'
        };
    }

    // Worker API를 통한 데이터 요청
    async makeWorkerRequest(endpoint, method = 'GET', data = null) {
        if (!this.isConfigured()) {
            throw new Error('Cloudflare 설정이 필요합니다.');
        }

        try {
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (data && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(`${this.workerUrl}${endpoint}`, options);
            
            if (!response.ok) {
                throw new Error(`Worker API 오류: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Worker 요청 실패 (${endpoint}):`, error);
            throw error;
        }
    }

    // D1 API 직접 호출 (관리용, 브라우저에서는 사용하지 않음)
    async executeD1Query(query, params = []) {
        console.warn('⚠️ 브라우저에서 D1 직접 호출은 권장하지 않습니다. Worker API를 사용하세요.');
        throw new Error('브라우저에서는 Worker API를 사용해야 합니다.');
    }

    // 투자자 데이터 관리
    async loadInvestors() {
        try {
            const result = await this.makeWorkerRequest('/api/investors');
            return result.data || [];
        } catch (error) {
            console.warn('Worker를 통한 로드 실패, localStorage 폴백:', error);
            const localData = localStorage.getItem('investorData');
            return localData ? JSON.parse(localData) : [];
        }
    }

    async saveInvestor(investor) {
        try {
            const result = await this.makeWorkerRequest('/api/investors', 'POST', investor);
            
            // 성공 시 localStorage에도 백업
            const investors = await this.loadInvestors();
            const existingIndex = investors.findIndex(i => i.id === investor.id);
            if (existingIndex >= 0) {
                investors[existingIndex] = result.data;
            } else {
                investors.push(result.data);
            }
            localStorage.setItem('investorData', JSON.stringify(investors));
            
            return result.data;
        } catch (error) {
            console.error('투자자 저장 실패:', error);
            throw error;
        }
    }

    async updateInvestor(id, investor) {
        try {
            const result = await this.makeWorkerRequest(`/api/investors/${id}`, 'PUT', investor);
            
            // localStorage 업데이트
            const investors = await this.loadInvestors();
            const index = investors.findIndex(i => i.id === id);
            if (index >= 0) {
                investors[index] = result.data;
                localStorage.setItem('investorData', JSON.stringify(investors));
            }
            
            return result.data;
        } catch (error) {
            console.error('투자자 업데이트 실패:', error);
            throw error;
        }
    }

    async deleteInvestor(id) {
        try {
            await this.makeWorkerRequest(`/api/investors/${id}`, 'DELETE');
            
            // localStorage에서도 제거
            const investors = await this.loadInvestors();
            const filtered = investors.filter(i => i.id !== id);
            localStorage.setItem('investorData', JSON.stringify(filtered));
        } catch (error) {
            console.error('투자자 삭제 실패:', error);
            throw error;
        }
    }

    // 숙소 데이터 관리
    async loadAccommodations() {
        try {
            const result = await this.makeWorkerRequest('/api/accommodations');
            return result.data || [];
        } catch (error) {
            console.warn('Worker를 통한 로드 실패, localStorage 폴백:', error);
            const localData = localStorage.getItem('accommodationData');
            return localData ? JSON.parse(localData) : [];
        }
    }

    async saveAccommodation(accommodation) {
        try {
            const result = await this.makeWorkerRequest('/api/accommodations', 'POST', accommodation);
            
            // localStorage 백업
            const accommodations = await this.loadAccommodations();
            accommodations.push(result.data);
            localStorage.setItem('accommodationData', JSON.stringify(accommodations));
            
            return result.data;
        } catch (error) {
            console.error('숙소 저장 실패:', error);
            throw error;
        }
    }

    async updateAccommodation(id, accommodation) {
        try {
            const result = await this.makeWorkerRequest(`/api/accommodations/${id}`, 'PUT', accommodation);
            
            // localStorage 업데이트
            const accommodations = await this.loadAccommodations();
            const index = accommodations.findIndex(a => a.id === id);
            if (index >= 0) {
                accommodations[index] = result.data;
                localStorage.setItem('accommodationData', JSON.stringify(accommodations));
            }
            
            return result.data;
        } catch (error) {
            console.error('숙소 업데이트 실패:', error);
            throw error;
        }
    }

    async deleteAccommodation(id) {
        try {
            await this.makeWorkerRequest(`/api/accommodations/${id}`, 'DELETE');
            
            // localStorage에서도 제거
            const accommodations = await this.loadAccommodations();
            const filtered = accommodations.filter(a => a.id !== id);
            localStorage.setItem('accommodationData', JSON.stringify(filtered));
        } catch (error) {
            console.error('숙소 삭제 실패:', error);
            throw error;
        }
    }

    // 예약 데이터 관리
    async loadReservations() {
        try {
            const result = await this.makeWorkerRequest('/api/reservations');
            return result.data || [];
        } catch (error) {
            console.warn('Worker를 통한 로드 실패, localStorage 폴백:', error);
            const localData = localStorage.getItem('reservationData');
            return localData ? JSON.parse(localData) : [];
        }
    }

    async saveReservations(reservations) {
        try {
            await this.makeWorkerRequest('/api/reservations/bulk', 'POST', { data: reservations });
            localStorage.setItem('reservationData', JSON.stringify(reservations));
        } catch (error) {
            console.error('예약 데이터 저장 실패:', error);
            throw error;
        }
    }

    // 정산 데이터 관리
    async loadAccounting() {
        try {
            const result = await this.makeWorkerRequest('/api/accounting');
            return result.data || [];
        } catch (error) {
            console.warn('Worker를 통한 로드 실패, localStorage 폴백:', error);
            const localData = localStorage.getItem('accountingData');
            return localData ? JSON.parse(localData) : [];
        }
    }

    async saveAccounting(accounting) {
        try {
            await this.makeWorkerRequest('/api/accounting/bulk', 'POST', { data: accounting });
            localStorage.setItem('accountingData', JSON.stringify(accounting));
        } catch (error) {
            console.error('정산 데이터 저장 실패:', error);
            throw error;
        }
    }

    // 연결 테스트
    async testConnection() {
        if (!this.isConfigured()) {
            return { success: false, error: 'Cloudflare 설정이 필요합니다.' };
        }

        try {
            // Worker 상태 확인
            const response = await fetch(`${this.workerUrl}/health`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const data = await response.json();
                return { 
                    success: true, 
                    message: `Worker 연결 성공: ${data.status || 'OK'}`,
                    data: data
                };
            } else {
                return { 
                    success: false, 
                    error: `Worker 연결 실패: ${response.status} ${response.statusText}` 
                };
            }
        } catch (error) {
            return { 
                success: false, 
                error: `연결 오류: ${error.message}` 
            };
        }
    }

    // D1 데이터베이스 초기화 (Worker 통해서만 가능)
    async initializeDatabase() {
        if (!this.isConfigured()) {
            throw new Error('Cloudflare 설정이 필요합니다.');
        }

        try {
            const result = await this.makeWorkerRequest('/api/init', 'POST');
            console.log('✅ Worker를 통한 데이터베이스 초기화 완료');
            return { success: true, message: '데이터베이스 초기화 완료' };
        } catch (error) {
            console.error('❌ 데이터베이스 초기화 실패:', error);
            
            // 폴백: 수동 안내
            return { 
                success: false, 
                error: `브라우저에서는 초기화할 수 없습니다. 터미널에서 다음 명령어를 실행하세요:\n\nwrangler d1 execute teamk-data --file=./sql/init.sql\n\n자세한 내용은 CLOUDFLARE_WORKERS_SETUP.md를 참조하세요.`
            };
        }
    }
}

// 전역 인스턴스
window.cloudflareStorage = new CloudflareStorage();