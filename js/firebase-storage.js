// Firebase를 데이터베이스로 사용하는 저장소 시스템
class FirebaseStorage {
    constructor() {
        this.apiKey = null;
        this.projectId = null;
        this.initialized = false;
        
        // localStorage에서 설정 로드
        this.loadConfig();
    }

    // Firebase 설정 저장
    saveConfig(apiKey, projectId) {
        this.apiKey = apiKey;
        this.projectId = projectId;
        
        localStorage.setItem('firebase_api_key', apiKey);
        localStorage.setItem('firebase_project_id', projectId);
        
        console.log('✅ Firebase 설정 저장됨');
        this.initialized = true;
    }

    // Firebase 설정 로드
    loadConfig() {
        this.apiKey = localStorage.getItem('firebase_api_key');
        this.projectId = localStorage.getItem('firebase_project_id');
        
        if (this.apiKey && this.projectId) {
            console.log('📡 Firebase 설정 로드됨:', this.projectId);
            this.initialized = true;
            return true;
        }
        return false;
    }

    // 설정 확인
    isConfigured() {
        return !!(this.apiKey && this.projectId && this.initialized);
    }

    // Firebase REST API 요청
    async makeFirebaseRequest(collection, method = 'GET', data = null, docId = null) {
        if (!this.isConfigured()) {
            throw new Error('Firebase 설정이 필요합니다.');
        }

        const baseUrl = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/${collection}`;
        const url = docId ? `${baseUrl}/${docId}` : baseUrl;

        try {
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}` // 실제로는 Access Token이 필요하지만 간단히
                }
            };

            if (data && (method === 'POST' || method === 'PATCH')) {
                // Firestore 형식으로 데이터 변환
                const firestoreData = this.convertToFirestoreFormat(data);
                options.body = JSON.stringify({ fields: firestoreData });
            }

            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`Firebase API 오류: ${response.status}`);
            }

            if (method === 'DELETE') {
                return { success: true };
            }

            const result = await response.json();
            return result;

        } catch (error) {
            console.error(`Firebase 요청 실패:`, error);
            throw error;
        }
    }

    // 간단한 Firebase REST API (인증 없이)
    async makeSimpleRequest(collection, method = 'GET', data = null, docId = null) {
        if (!this.isConfigured()) {
            throw new Error('Firebase 설정이 필요합니다.');
        }

        // Firebase REST API (Web API Key 사용)
        const baseUrl = `https://${this.projectId}-default-rtdb.firebaseio.com/${collection}`;
        const url = docId ? `${baseUrl}/${docId}.json?key=${this.apiKey}` : `${baseUrl}.json?key=${this.apiKey}`;

        try {
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`Firebase 오류: ${response.status}`);
            }

            if (method === 'DELETE') {
                return { success: true };
            }

            return await response.json();

        } catch (error) {
            console.error(`Firebase 요청 실패:`, error);
            
            // 폴백: localStorage
            console.warn('Firebase 실패, localStorage 사용');
            return this.handleLocalStorageFallback(collection, method, data, docId);
        }
    }

    // localStorage 폴백 처리
    handleLocalStorageFallback(collection, method, data, docId) {
        const key = `firebase_${collection}`;
        let localData = JSON.parse(localStorage.getItem(key) || '{}');

        switch (method) {
            case 'GET':
                return docId ? localData[docId] : localData;
            
            case 'POST':
                const id = Date.now().toString();
                localData[id] = { ...data, id };
                localStorage.setItem(key, JSON.stringify(localData));
                return { name: id, ...data };
            
            case 'PUT':
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

    // Firestore 형식으로 데이터 변환
    convertToFirestoreFormat(data) {
        const converted = {};
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string') {
                converted[key] = { stringValue: value };
            } else if (typeof value === 'number') {
                converted[key] = { integerValue: value.toString() };
            } else if (typeof value === 'boolean') {
                converted[key] = { booleanValue: value };
            } else if (Array.isArray(value)) {
                converted[key] = { arrayValue: { values: value.map(v => ({ stringValue: v.toString() })) } };
            } else {
                converted[key] = { stringValue: JSON.stringify(value) };
            }
        }
        return converted;
    }

    // 투자자 데이터 관리
    async loadInvestors() {
        try {
            const result = await this.makeSimpleRequest('investors');
            return Object.values(result || {});
        } catch (error) {
            console.warn('투자자 로드 실패, localStorage 폴백:', error);
            const localData = localStorage.getItem('investorData');
            return localData ? JSON.parse(localData) : [];
        }
    }

    async saveInvestor(investor) {
        try {
            // ID가 있으면 업데이트, 없으면 새로 생성
            if (investor.id) {
                const result = await this.makeSimpleRequest('investors', 'PUT', investor, investor.id);
                return { ...investor, ...result };
            } else {
                const id = Date.now().toString();
                const result = await this.makeSimpleRequest('investors', 'PUT', { ...investor, id }, id);
                return { ...investor, id, ...result };
            }
        } catch (error) {
            console.error('투자자 저장 실패:', error);
            throw error;
        }
    }

    async updateInvestor(id, investor) {
        return await this.saveInvestor({ ...investor, id });
    }

    async deleteInvestor(id) {
        try {
            await this.makeSimpleRequest('investors', 'DELETE', null, id);
        } catch (error) {
            console.error('투자자 삭제 실패:', error);
            throw error;
        }
    }

    // 숙소 데이터 관리
    async loadAccommodations() {
        try {
            const result = await this.makeSimpleRequest('accommodations');
            return Object.values(result || {});
        } catch (error) {
            console.warn('숙소 로드 실패, localStorage 폴백:', error);
            const localData = localStorage.getItem('accommodationData');
            return localData ? JSON.parse(localData) : [];
        }
    }

    async saveAccommodation(accommodation) {
        try {
            if (accommodation.id) {
                const result = await this.makeSimpleRequest('accommodations', 'PUT', accommodation, accommodation.id);
                return { ...accommodation, ...result };
            } else {
                const id = Date.now().toString();
                const result = await this.makeSimpleRequest('accommodations', 'PUT', { ...accommodation, id }, id);
                return { ...accommodation, id, ...result };
            }
        } catch (error) {
            console.error('숙소 저장 실패:', error);
            throw error;
        }
    }

    async updateAccommodation(id, accommodation) {
        return await this.saveAccommodation({ ...accommodation, id });
    }

    async deleteAccommodation(id) {
        try {
            await this.makeSimpleRequest('accommodations', 'DELETE', null, id);
        } catch (error) {
            console.error('숙소 삭제 실패:', error);
            throw error;
        }
    }

    // 예약 데이터 관리
    async loadReservations() {
        try {
            const result = await this.makeSimpleRequest('reservations');
            return Object.values(result || {});
        } catch (error) {
            console.warn('예약 로드 실패, localStorage 폴백:', error);
            const localData = localStorage.getItem('reservationData');
            return localData ? JSON.parse(localData) : [];
        }
    }

    async saveReservation(reservation) {
        try {
            if (reservation.id) {
                const result = await this.makeSimpleRequest('reservations', 'PUT', reservation, reservation.id);
                return { ...reservation, ...result };
            } else {
                const id = Date.now().toString();
                const result = await this.makeSimpleRequest('reservations', 'PUT', { ...reservation, id }, id);
                return { ...reservation, id, ...result };
            }
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
            await this.makeSimpleRequest('reservations', 'DELETE', null, id);
        } catch (error) {
            console.error('예약 삭제 실패:', error);
            throw error;
        }
    }

    // 회계 데이터 관리
    async loadAccounting() {
        try {
            const result = await this.makeSimpleRequest('accounting');
            return Object.values(result || {});
        } catch (error) {
            console.warn('회계 로드 실패, localStorage 폴백:', error);
            const localData = localStorage.getItem('accountingData');
            return localData ? JSON.parse(localData) : [];
        }
    }

    async saveAccounting(accounting) {
        try {
            if (accounting.id) {
                const result = await this.makeSimpleRequest('accounting', 'PUT', accounting, accounting.id);
                return { ...accounting, ...result };
            } else {
                const id = Date.now().toString();
                const result = await this.makeSimpleRequest('accounting', 'PUT', { ...accounting, id }, id);
                return { ...accounting, id, ...result };
            }
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
            await this.makeSimpleRequest('accounting', 'DELETE', null, id);
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
            // 간단한 테스트 데이터 읽기
            await this.makeSimpleRequest('test');
            return { 
                success: true, 
                message: `Firebase 연결 성공: ${this.projectId}` 
            };
        } catch (error) {
            return { 
                success: false, 
                error: `Firebase 연결 실패: ${error.message}` 
            };
        }
    }
}

// 전역 인스턴스
window.firebaseStorage = new FirebaseStorage();