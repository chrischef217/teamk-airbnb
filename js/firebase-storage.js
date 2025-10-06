// Firebase를 데이터베이스로 사용하는 저장소 시스템 (수정된 버전)
class FirebaseStorage {
    constructor() {
        this.apiKey = null;
        this.projectId = null;
        this.databaseURL = null;
        this.initialized = false;
        
        // localStorage에서 설정 로드
        this.loadConfig();
    }

    // Firebase 설정 저장
    saveConfig(apiKey, projectId) {
        this.apiKey = apiKey;
        this.projectId = projectId;
        this.databaseURL = `https://${projectId}-default-rtdb.asia-southeast1.firebasedatabase.app`;
        
        localStorage.setItem('firebase_api_key', apiKey);
        localStorage.setItem('firebase_project_id', projectId);
        localStorage.setItem('firebase_database_url', this.databaseURL);
        
        console.log('✅ Firebase 설정 저장됨:', {
            projectId: this.projectId,
            databaseURL: this.databaseURL
        });
        this.initialized = true;
    }

    // Firebase 설정 로드
    loadConfig() {
        this.apiKey = localStorage.getItem('firebase_api_key');
        this.projectId = localStorage.getItem('firebase_project_id');
        this.databaseURL = localStorage.getItem('firebase_database_url');
        
        if (!this.databaseURL && this.projectId) {
            this.databaseURL = `https://${this.projectId}-default-rtdb.asia-southeast1.firebasedatabase.app`;
        }
        
        if (this.apiKey && this.projectId && this.databaseURL) {
            console.log('📡 Firebase 설정 로드됨:', this.projectId);
            this.initialized = true;
            return true;
        }
        return false;
    }

    // 설정 확인
    isConfigured() {
        return !!(this.apiKey && this.projectId && this.databaseURL && this.initialized);
    }

    // Firebase REST API 요청 (올바른 방식)
    async makeFirebaseRequest(collection, method = 'GET', data = null, docId = null) {
        if (!this.isConfigured()) {
            throw new Error('Firebase 설정이 필요합니다.');
        }

        // 올바른 Firebase Realtime Database URL
        const baseUrl = `${this.databaseURL}/${collection}`;
        const url = docId ? `${baseUrl}/${docId}.json` : `${baseUrl}.json`;

        console.log(`🔥 Firebase 요청: ${method} ${url}`);

        try {
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
                options.body = JSON.stringify(data);
                console.log('📤 전송 데이터:', data);
            }

            const response = await fetch(url, options);
            
            console.log(`📡 응답 상태: ${response.status}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Firebase 오류 응답:', errorText);
                throw new Error(`Firebase 오류: ${response.status} - ${errorText}`);
            }

            if (method === 'DELETE') {
                console.log('✅ 삭제 완료');
                return { success: true };
            }

            const result = await response.json();
            console.log('📥 응답 데이터:', result);
            return result;

        } catch (error) {
            console.error(`❌ Firebase 요청 실패:`, error);
            
            // 폴백: localStorage
            console.warn('🔄 Firebase 실패, localStorage 폴백 사용');
            return this.handleLocalStorageFallback(collection, method, data, docId);
        }
    }

    // localStorage 폴백 처리
    handleLocalStorageFallback(collection, method, data, docId) {
        const key = `firebase_${collection}`;
        let localData = JSON.parse(localStorage.getItem(key) || '{}');
        
        // 기존 배열 형태 데이터도 지원 (하위 호환성)
        const legacyKeys = {
            'investors': 'investorData',
            'accommodations': 'accommodationData',
            'reservations': 'reservationData',
            'accounting': 'accountingData'
        };
        
        if (Object.keys(localData).length === 0 && legacyKeys[collection]) {
            const legacyData = localStorage.getItem(legacyKeys[collection]);
            if (legacyData) {
                const parsedLegacy = JSON.parse(legacyData);
                if (Array.isArray(parsedLegacy)) {
                    // 배열을 객체로 변환
                    localData = {};
                    parsedLegacy.forEach(item => {
                        if (item.id) {
                            localData[item.id] = item;
                        }
                    });
                    console.log(`📦 Legacy 데이터 변환: ${collection} (${parsedLegacy.length}개)`);
                }
            }
        }

        switch (method) {
            case 'GET':
                return docId ? localData[docId] : localData;
            
            case 'POST':
                const postId = Date.now().toString();
                localData[postId] = { ...data, id: postId };
                localStorage.setItem(key, JSON.stringify(localData));
                return { name: postId, ...data };
            
            case 'PUT':
                if (docId) {
                    localData[docId] = { ...data, id: docId };
                    localStorage.setItem(key, JSON.stringify(localData));
                    return localData[docId];
                }
                break;
            
            case 'PATCH':
                if (docId) {
                    localData[docId] = { ...localData[docId], ...data, id: docId };
                    localStorage.setItem(key, JSON.stringify(localData));
                    return localData[docId];
                }
                break;
            
            case 'DELETE':
                if (docId) {
                    delete localData[docId];
                    localStorage.setItem(key, JSON.stringify(localData));
                }
                return { success: true };
        }

        return null;
    }

    // 투자자 데이터 관리
    async loadInvestors() {
        try {
            console.log('📊 투자자 데이터 로드 중...');
            const result = await this.makeFirebaseRequest('investors');
            
            if (result && typeof result === 'object') {
                const investors = Object.keys(result).map(key => ({
                    id: key,
                    ...result[key]
                }));
                console.log('✅ 투자자 로드 성공:', investors.length + '명');
                return investors;
            }
            
            return [];
        } catch (error) {
            console.warn('⚠️ 투자자 로드 실패, localStorage 폴백:', error);
            const localData = localStorage.getItem('investorData');
            return localData ? JSON.parse(localData) : [];
        }
    }

    async saveInvestor(investor) {
        try {
            console.log('💾 투자자 저장 중:', investor.name);
            
            // ID가 없으면 생성
            if (!investor.id) {
                investor.id = Date.now().toString();
            }
            
            // Firebase에 저장
            const result = await this.makeFirebaseRequest('investors', 'PUT', investor, investor.id);
            
            // 투자자가 보유한 숙소들의 investorName 업데이트
            if (investor.accommodations && investor.accommodations.length > 0) {
                console.log('🏠 연결된 숙소들의 투자자명 업데이트 중...', investor.accommodations);
                await this.updateAccommodationInvestorNames(investor.accommodations, investor.name);
            }
            
            // 자동으로 localStorage도 동기화
            const allInvestors = await this.loadInvestors();
            localStorage.setItem('investorData', JSON.stringify(allInvestors));
            console.log('🔄 localStorage 자동 동기화 완료');
            
            console.log('✅ 투자자 저장 성공:', investor.name);
            return { id: investor.id, ...investor };
            
        } catch (error) {
            console.error('❌ 투자자 저장 실패:', error);
            throw error;
        }
    }

    async updateInvestor(id, investor) {
        return await this.saveInvestor({ ...investor, id });
    }

    async deleteInvestor(id) {
        try {
            console.log('🗑️ 투자자 삭제 중:', id);
            await this.makeFirebaseRequest('investors', 'DELETE', null, id);
            console.log('✅ 투자자 삭제 성공');
        } catch (error) {
            console.error('❌ 투자자 삭제 실패:', error);
            throw error;
        }
    }

    // 숙소 데이터 관리
    async loadAccommodations() {
        try {
            console.log('🏠 숙소 데이터 로드 중...');
            const result = await this.makeFirebaseRequest('accommodations');
            
            if (result && typeof result === 'object') {
                const accommodations = Object.keys(result).map(key => ({
                    id: key,
                    ...result[key]
                }));
                console.log('✅ 숙소 로드 성공:', accommodations.length + '개');
                return accommodations;
            }
            
            return [];
        } catch (error) {
            console.warn('⚠️ 숙소 로드 실패, localStorage 폴백:', error);
            const localData = localStorage.getItem('accommodationData');
            return localData ? JSON.parse(localData) : [];
        }
    }

    async saveAccommodation(accommodation) {
        try {
            console.log('💾 숙소 저장 중:', accommodation.name);
            
            if (!accommodation.id) {
                accommodation.id = Date.now().toString();
            }
            
            const result = await this.makeFirebaseRequest('accommodations', 'PUT', accommodation, accommodation.id);
            
            // 자동으로 localStorage도 동기화
            const allAccommodations = await this.loadAccommodations();
            localStorage.setItem('accommodationData', JSON.stringify(allAccommodations));
            console.log('🔄 localStorage 자동 동기화 완료');
            
            console.log('✅ 숙소 저장 성공:', accommodation.name);
            return { id: accommodation.id, ...accommodation };
            
        } catch (error) {
            console.error('❌ 숙소 저장 실패:', error);
            throw error;
        }
    }

    async updateAccommodation(id, accommodation) {
        return await this.saveAccommodation({ ...accommodation, id });
    }

    async deleteAccommodation(id) {
        try {
            console.log('🗑️ 숙소 삭제 중:', id);
            await this.makeFirebaseRequest('accommodations', 'DELETE', null, id);
            console.log('✅ 숙소 삭제 성공');
        } catch (error) {
            console.error('❌ 숙소 삭제 실패:', error);
            throw error;
        }
    }

    // 숙소들의 investorName 업데이트 (단방향 데이터 흐름 구현)
    async updateAccommodationInvestorNames(accommodationIds, investorName) {
        try {
            console.log('🔄 숙소들의 투자자명 업데이트 시작:', { accommodationIds, investorName });
            
            // 모든 숙소 데이터 로드
            const accommodations = await this.loadAccommodations();
            
            // 지정된 ID들에 해당하는 숙소들의 investorName 업데이트
            const updatePromises = accommodationIds.map(async (accId) => {
                const accommodation = accommodations.find(acc => acc.id == accId);
                if (accommodation) {
                    console.log(`🏠 숙소 "${accommodation.accommodationName}" 투자자명 업데이트: ${investorName}`);
                    const updatedAccommodation = { ...accommodation, investorName };
                    return await this.saveAccommodation(updatedAccommodation);
                } else {
                    console.warn('⚠️ 숙소 ID 찾을 수 없음:', accId);
                }
            });
            
            await Promise.all(updatePromises.filter(p => p)); // null/undefined 제외
            
            // localStorage도 업데이트
            const updatedAccommodations = await this.loadAccommodations();
            localStorage.setItem('accommodationData', JSON.stringify(updatedAccommodations));
            
            console.log('✅ 숙소들의 투자자명 업데이트 완료');
            
        } catch (error) {
            console.error('❌ 숙소들의 투자자명 업데이트 실패:', error);
            throw error;
        }
    }

    // 예약 데이터 관리
    async loadReservations() {
        try {
            const result = await this.makeFirebaseRequest('reservations');
            if (result && typeof result === 'object') {
                return Object.keys(result).map(key => ({ id: key, ...result[key] }));
            }
            return [];
        } catch (error) {
            console.warn('예약 로드 실패, localStorage 폴백:', error);
            const localData = localStorage.getItem('reservationData');
            return localData ? JSON.parse(localData) : [];
        }
    }

    async saveReservation(reservation) {
        try {
            if (!reservation.id) {
                reservation.id = Date.now().toString();
            }
            await this.makeFirebaseRequest('reservations', 'PUT', reservation, reservation.id);
            return { id: reservation.id, ...reservation };
        } catch (error) {
            console.error('예약 저장 실패:', error);
            throw error;
        }
    }

    async updateReservation(id, reservation) {
        return await this.saveReservation({ ...reservation, id });
    }

    async deleteReservation(id) {
        try {
            await this.makeFirebaseRequest('reservations', 'DELETE', null, id);
        } catch (error) {
            console.error('예약 삭제 실패:', error);
            throw error;
        }
    }

    // 회계 데이터 관리
    async loadAccounting() {
        try {
            const result = await this.makeFirebaseRequest('accounting');
            if (result && typeof result === 'object') {
                return Object.keys(result).map(key => ({ id: key, ...result[key] }));
            }
            return [];
        } catch (error) {
            console.warn('회계 로드 실패, localStorage 폴백:', error);
            const localData = localStorage.getItem('accountingData');
            return localData ? JSON.parse(localData) : [];
        }
    }

    async saveAccounting(accounting) {
        try {
            if (!accounting.id) {
                accounting.id = Date.now().toString();
            }
            await this.makeFirebaseRequest('accounting', 'PUT', accounting, accounting.id);
            return { id: accounting.id, ...accounting };
        } catch (error) {
            console.error('회계 저장 실패:', error);
            throw error;
        }
    }

    async updateAccounting(id, accounting) {
        return await this.saveAccounting({ ...accounting, id });
    }

    async deleteAccounting(id) {
        try {
            await this.makeFirebaseRequest('accounting', 'DELETE', null, id);
        } catch (error) {
            console.error('회계 삭제 실패:', error);
            throw error;
        }
    }

    // 연결 테스트
    async testConnection() {
        if (!this.isConfigured()) {
            return { success: false, error: 'Firebase 설정이 필요합니다.' };
        }

        try {
            console.log('🧪 Firebase 연결 테스트 중...');
            
            // 간단한 테스트 데이터 저장 및 읽기
            const testData = { test: true, timestamp: Date.now() };
            
            // 테스트 데이터 저장
            await this.makeFirebaseRequest('test', 'PUT', testData, 'connection-test');
            
            // 테스트 데이터 읽기
            const result = await this.makeFirebaseRequest('test', 'GET', null, 'connection-test');
            
            if (result && result.test) {
                // 테스트 데이터 삭제
                await this.makeFirebaseRequest('test', 'DELETE', null, 'connection-test');
                
                return { 
                    success: true, 
                    message: `Firebase 연결 성공: ${this.projectId}` 
                };
            } else {
                throw new Error('테스트 데이터 검증 실패');
            }
            
        } catch (error) {
            console.error('❌ Firebase 연결 테스트 실패:', error);
            return { 
                success: false, 
                error: `Firebase 연결 실패: ${error.message}` 
            };
        }
    }
}

// 전역 인스턴스
window.firebaseStorage = new FirebaseStorage();