/**
 * Teamk 공유숙박 관리 시스템 - API 클라이언트
 * 서버 API와 통신하는 모든 함수들을 포함
 */

class TeamkAPI {
    constructor() {
        // 환경별 API URL 설정
        this.baseURL = this.getApiBaseUrl();
        this.token = localStorage.getItem('authToken');
    }

    // API Base URL 결정
    getApiBaseUrl() {
        // 프로덕션 환경 (Cloudflare Pages)
        if (window.location.hostname.includes('.pages.dev') || 
            window.location.hostname !== 'localhost') {
            return 'https://teamk-accommodation-api.railway.app/api';
        }
        // 로컬 개발 환경
        return '/api';
    }

    // 인증 토큰 설정
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    // HTTP 요청 기본 설정
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // 인증 토큰 추가
        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            
            // 토큰 만료시 로그아웃 처리
            if (response.status === 401) {
                const data = await response.json();
                if (data.code === 'TOKEN_EXPIRED' || data.code === 'TOKEN_INVALID') {
                    this.logout();
                    window.location.href = '/login.html';
                    return;
                }
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API 요청 오류:', error);
            throw error;
        }
    }

    // GET 요청
    async get(endpoint) {
        return await this.request(endpoint, { method: 'GET' });
    }

    // POST 요청
    async post(endpoint, data) {
        return await this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // PUT 요청
    async put(endpoint, data) {
        return await this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // DELETE 요청
    async delete(endpoint) {
        return await this.request(endpoint, { method: 'DELETE' });
    }

    // 인증 관련 API
    async login(username, password) {
        const response = await this.post('/auth/login', { username, password });
        if (response.token) {
            this.setToken(response.token);
        }
        return response;
    }

    async register(userData) {
        const response = await this.post('/auth/register', userData);
        if (response.token) {
            this.setToken(response.token);
        }
        return response;
    }

    async logout() {
        try {
            if (this.token) {
                await this.post('/auth/logout');
            }
        } catch (error) {
            console.error('로그아웃 API 오류:', error);
        }
        this.setToken(null);
    }

    async getCurrentUser() {
        return await this.get('/auth/me');
    }

    async changePassword(currentPassword, newPassword) {
        return await this.put('/auth/password', { currentPassword, newPassword });
    }

    // 투자자 관련 API
    async getInvestors(page = 1, limit = 20, search = '') {
        const params = new URLSearchParams({ page, limit, search });
        return await this.get(`/investors?${params}`);
    }

    async getInvestor(id) {
        return await this.get(`/investors/${id}`);
    }

    async createInvestor(investorData) {
        return await this.post('/investors', investorData);
    }

    async updateInvestor(id, investorData) {
        return await this.put(`/investors/${id}`, investorData);
    }

    async deleteInvestor(id) {
        return await this.delete(`/investors/${id}`);
    }

    // 숙소 관련 API
    async getAccommodations(page = 1, limit = 20, search = '', investorId = '') {
        const params = new URLSearchParams({ page, limit, search, investorId });
        return await this.get(`/accommodations?${params}`);
    }

    async getAccommodation(id) {
        return await this.get(`/accommodations/${id}`);
    }

    async createAccommodation(accommodationData) {
        return await this.post('/accommodations', accommodationData);
    }

    async updateAccommodation(id, accommodationData) {
        return await this.put(`/accommodations/${id}`, accommodationData);
    }

    async deleteAccommodation(id) {
        return await this.delete(`/accommodations/${id}`);
    }

    async getAccommodationStatistics(id, year, month = null) {
        const params = new URLSearchParams({ year });
        if (month) params.append('month', month);
        return await this.get(`/accommodations/${id}/statistics?${params}`);
    }

    // 예약 관련 API
    async getReservations(page = 1, limit = 20, accommodationId = '', status = '') {
        const params = new URLSearchParams({ page, limit, accommodationId, status });
        return await this.get(`/reservations?${params}`);
    }

    async getReservation(id) {
        return await this.get(`/reservations/${id}`);
    }

    async createReservation(reservationData) {
        return await this.post('/reservations', reservationData);
    }

    async updateReservation(id, reservationData) {
        return await this.put(`/reservations/${id}`, reservationData);
    }

    async deleteReservation(id) {
        return await this.delete(`/reservations/${id}`);
    }

    // 회계 관련 API
    async getAccountingEntries(page = 1, limit = 20, type = '', accommodationId = '') {
        const params = new URLSearchParams({ page, limit, type, accommodationId });
        return await this.get(`/accounting?${params}`);
    }

    async createAccountingEntry(entryData) {
        return await this.post('/accounting', entryData);
    }

    async updateAccountingEntry(id, entryData) {
        return await this.put(`/accounting/${id}`, entryData);
    }

    async deleteAccountingEntry(id) {
        return await this.delete(`/accounting/${id}`);
    }

    // 분석 관련 API
    async getAnalytics(year = new Date().getFullYear(), month = null) {
        const params = new URLSearchParams({ year });
        if (month) params.append('month', month);
        return await this.get(`/analytics?${params}`);
    }

    async getRevenueAnalytics(period = 'month') {
        return await this.get(`/analytics/revenue?period=${period}`);
    }

    // 정산 관련 API
    async getSettlements(investorId = '', year = new Date().getFullYear()) {
        const params = new URLSearchParams({ investorId, year });
        return await this.get(`/settlements?${params}`);
    }

    async createSettlement(settlementData) {
        return await this.post('/settlements', settlementData);
    }

    // 파일 업로드 API
    async uploadFile(file, type = 'general') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        return await this.request('/upload', {
            method: 'POST',
            body: formData,
            headers: {} // Content-Type을 설정하지 않음 (브라우저가 자동 설정)
        });
    }

    // 백업/복원 API
    async exportData() {
        return await this.get('/backup/export');
    }

    async importData(data) {
        return await this.post('/backup/import', data);
    }
}

// 전역 API 인스턴스 생성
const api = new TeamkAPI();

// 기존 코드와의 호환성을 위한 래퍼 함수들
window.teamkAPI = api;

// 로그인 상태 확인
async function checkLoginStatus() {
    try {
        if (!api.token) {
            return false;
        }
        
        const response = await api.getCurrentUser();
        if (response && response.user) {
            window.currentUser = response.user;
            return true;
        }
        return false;
    } catch (error) {
        console.error('로그인 상태 확인 오류:', error);
        return false;
    }
}

// 페이지 권한 초기화
function initializePagePermissions() {
    const user = window.currentUser;
    if (!user) return;

    // 권한별 UI 표시/숨김 처리
    const adminElements = document.querySelectorAll('.admin-only');
    const managerElements = document.querySelectorAll('.manager-only');
    const investorElements = document.querySelectorAll('.investor-only');

    adminElements.forEach(el => {
        el.style.display = user.role === 'admin' ? 'block' : 'none';
    });

    managerElements.forEach(el => {
        el.style.display = ['admin', 'manager'].includes(user.role) ? 'block' : 'none';
    });

    investorElements.forEach(el => {
        el.style.display = ['admin', 'manager', 'investor'].includes(user.role) ? 'block' : 'none';
    });
}

// 에러 처리 헬퍼
function handleAPIError(error, context = '') {
    console.error(`API 오류 ${context}:`, error);
    
    let message = '알 수 없는 오류가 발생했습니다.';
    if (error.message) {
        message = error.message;
    }

    // 사용자 친화적 에러 메시지
    const friendlyMessages = {
        'TOKEN_EXPIRED': '로그인이 만료되었습니다. 다시 로그인해주세요.',
        'TOKEN_INVALID': '인증 정보가 올바르지 않습니다. 다시 로그인해주세요.',
        'INSUFFICIENT_PERMISSIONS': '권한이 없습니다.',
        'INVALID_CREDENTIALS': '사용자명 또는 비밀번호가 올바르지 않습니다.',
        'USER_EXISTS': '이미 존재하는 사용자입니다.'
    };

    // API 에러 코드에서 친화적 메시지 찾기
    for (const [code, friendlyMessage] of Object.entries(friendlyMessages)) {
        if (message.includes(code)) {
            message = friendlyMessage;
            break;
        }
    }

    alert(message);
}

console.log('🔌 Teamk API 클라이언트가 로드되었습니다.');