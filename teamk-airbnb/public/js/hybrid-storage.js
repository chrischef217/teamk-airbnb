/**
 * 하이브리드 데이터 저장 시스템
 * - 서버 연결시: API 우선 사용
 * - 서버 연결 실패시: localStorage 사용 (오프라인 모드)
 */

class HybridStorage {
    constructor() {
        this.isOnline = navigator.onLine;
        this.serverAvailable = false;
        this.checkServerStatus();
        
        // 네트워크 상태 감지
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.checkServerStatus();
            console.log('🌐 온라인 상태로 전환');
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.serverAvailable = false;
            console.log('📵 오프라인 상태로 전환');
        });
    }

    // 서버 상태 확인
    async checkServerStatus() {
        try {
            if (!this.isOnline) {
                this.serverAvailable = false;
                return false;
            }

            const response = await fetch(`${api.baseURL}/health`, {
                method: 'GET',
                timeout: 5000
            });
            
            this.serverAvailable = response.ok;
            console.log(this.serverAvailable ? '🟢 서버 연결됨' : '🔴 서버 연결 실패');
            return this.serverAvailable;
        } catch (error) {
            this.serverAvailable = false;
            console.log('🔴 서버 연결 확인 실패:', error.message);
            return false;
        }
    }

    // 데이터 저장
    async save(key, data) {
        if (this.serverAvailable && api.token) {
            try {
                // API를 통해 서버에 저장
                await this.saveToServer(key, data);
                console.log(`💾 서버에 저장됨: ${key}`);
            } catch (error) {
                console.error('서버 저장 실패, localStorage 사용:', error);
                this.saveToLocal(key, data);
            }
        } else {
            // localStorage에 저장
            this.saveToLocal(key, data);
            console.log(`💾 로컬에 저장됨: ${key}`);
        }
    }

    // 데이터 로드
    async load(key) {
        if (this.serverAvailable && api.token) {
            try {
                // API를 통해 서버에서 로드
                const data = await this.loadFromServer(key);
                console.log(`📥 서버에서 로드됨: ${key}`);
                return data;
            } catch (error) {
                console.error('서버 로드 실패, localStorage 사용:', error);
                return this.loadFromLocal(key);
            }
        } else {
            // localStorage에서 로드
            const data = this.loadFromLocal(key);
            console.log(`📥 로컬에서 로드됨: ${key}`);
            return data;
        }
    }

    // localStorage에 저장
    saveToLocal(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('localStorage 저장 오류:', error);
        }
    }

    // localStorage에서 로드
    loadFromLocal(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('localStorage 로드 오류:', error);
            return [];
        }
    }

    // 서버에 저장 (API 타입별 처리)
    async saveToServer(key, data) {
        switch (key) {
            case 'investorData':
                // 투자자 데이터는 각각 개별 저장
                for (const investor of data) {
                    if (investor.id && investor.id.toString().includes('temp_')) {
                        // 새로운 투자자 생성
                        const response = await api.createInvestor(investor);
                        investor.id = response.investor.id;
                    } else if (investor.id) {
                        // 기존 투자자 업데이트
                        await api.updateInvestor(investor.id, investor);
                    }
                }
                break;

            case 'accommodationData':
                // 숙소 데이터 저장
                for (const accommodation of data) {
                    if (accommodation.id && accommodation.id.toString().includes('temp_')) {
                        const response = await api.createAccommodation(accommodation);
                        accommodation.id = response.accommodation.id;
                    } else if (accommodation.id) {
                        await api.updateAccommodation(accommodation.id, accommodation);
                    }
                }
                break;

            default:
                // 기타 데이터는 localStorage만 사용
                this.saveToLocal(key, data);
        }
    }

    // 서버에서 로드
    async loadFromServer(key) {
        switch (key) {
            case 'investorData':
                const investorsResponse = await api.getInvestors(1, 100);
                return investorsResponse.investors || [];

            case 'accommodationData':
                const accommodationsResponse = await api.getAccommodations(1, 100);
                return accommodationsResponse.accommodations || [];

            default:
                return this.loadFromLocal(key);
        }
    }

    // 동기화 (서버와 로컬 데이터 병합)
    async sync() {
        if (!this.serverAvailable || !api.token) {
            console.log('🔄 동기화 불가: 서버 연결 없음');
            return;
        }

        console.log('🔄 데이터 동기화 시작...');

        try {
            // 투자자 데이터 동기화
            const localInvestors = this.loadFromLocal('investorData');
            const serverInvestors = await this.loadFromServer('investorData');
            
            // 숙소 데이터 동기화
            const localAccommodations = this.loadFromLocal('accommodationData');
            const serverAccommodations = await this.loadFromServer('accommodationData');

            // 동기화된 데이터를 로컬에도 저장 (빠른 접근용)
            this.saveToLocal('investorData', serverInvestors);
            this.saveToLocal('accommodationData', serverAccommodations);

            console.log('✅ 데이터 동기화 완료');
        } catch (error) {
            console.error('❌ 동기화 실패:', error);
        }
    }

    // 오프라인 데이터 확인
    hasOfflineData() {
        const investors = this.loadFromLocal('investorData');
        const accommodations = this.loadFromLocal('accommodationData');
        return investors.length > 0 || accommodations.length > 0;
    }

    // 상태 정보
    getStatus() {
        return {
            online: this.isOnline,
            serverAvailable: this.serverAvailable,
            authenticated: !!api.token,
            hasOfflineData: this.hasOfflineData()
        };
    }
}

// 전역 하이브리드 스토리지 인스턴스
const hybridStorage = new HybridStorage();

// 기존 코드와의 호환성을 위한 래퍼 함수들
window.hybridStorage = hybridStorage;

// 상태 표시 UI 추가
function showConnectionStatus() {
    const status = hybridStorage.getStatus();
    const statusDiv = document.createElement('div');
    statusDiv.id = 'connection-status';
    statusDiv.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        z-index: 10000;
        color: white;
        font-weight: 500;
    `;

    if (status.serverAvailable && status.authenticated) {
        statusDiv.style.backgroundColor = '#059669';
        statusDiv.innerHTML = '🟢 온라인 (서버 연결됨)';
    } else if (status.online) {
        statusDiv.style.backgroundColor = '#d97706';
        statusDiv.innerHTML = '🟡 온라인 (로컬 모드)';
    } else {
        statusDiv.style.backgroundColor = '#dc2626';
        statusDiv.innerHTML = '🔴 오프라인 모드';
    }

    // 기존 상태 표시 제거
    const existing = document.getElementById('connection-status');
    if (existing) existing.remove();

    document.body.appendChild(statusDiv);

    // 5초 후 자동 숨김
    setTimeout(() => {
        if (statusDiv.parentNode) {
            statusDiv.remove();
        }
    }, 5000);
}

// 페이지 로드시 상태 표시
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(showConnectionStatus, 1000);
});

console.log('🔄 하이브리드 스토리지 시스템이 로드되었습니다.');