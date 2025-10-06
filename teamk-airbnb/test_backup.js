// 백업 시스템 테스트 스크립트
async function testBackupSystem() {
    console.log("=== 백업 시스템 완전성 테스트 시작 ===");
    
    // 1. 현재 데이터 상태 확인
    const originalData = await getAllTableData();
    console.log("원본 데이터 상태:", originalData);
    
    return originalData;
}

// 모든 테이블 데이터 가져오기
async function getAllTableData() {
    const tables = ['accommodations', 'reservations', 'accounting', 'investors'];
    const data = {};
    
    for (const table of tables) {
        try {
            const response = await fetch(`tables/${table}`);
            if (response.ok) {
                const result = await response.json();
                data[table] = result.data || [];
                console.log(`${table}: ${data[table].length}개 레코드`);
            } else {
                console.error(`${table} 로드 실패:`, response.status);
                data[table] = [];
            }
        } catch (error) {
            console.error(`${table} 오류:`, error);
            data[table] = [];
        }
    }
    
    return data;
}

// 데이터 비교 함수
function compareData(original, restored) {
    console.log("=== 데이터 비교 분석 ===");
    const results = {};
    
    for (const table in original) {
        const orig = original[table];
        const rest = restored[table] || [];
        
        results[table] = {
            originalCount: orig.length,
            restoredCount: rest.length,
            matches: orig.length === rest.length,
            missingFields: [],
            extraFields: []
        };
        
        console.log(`${table}: 원본 ${orig.length}개, 복원 ${rest.length}개`);
        
        if (orig.length > 0 && rest.length > 0) {
            // 필드 구조 비교
            const origFields = Object.keys(orig[0] || {});
            const restFields = Object.keys(rest[0] || {});
            
            results[table].missingFields = origFields.filter(f => !restFields.includes(f));
            results[table].extraFields = restFields.filter(f => !origFields.includes(f));
            
            if (results[table].missingFields.length > 0) {
                console.warn(`${table} 누락 필드:`, results[table].missingFields);
            }
            if (results[table].extraFields.length > 0) {
                console.warn(`${table} 추가 필드:`, results[table].extraFields);
            }
        }
    }
    
    return results;
}

// 테스트 실행
testBackupSystem().then(data => {
    window.originalTestData = data;
    console.log("테스트 데이터 저장 완료");
});