// 백업 시스템 시뮬레이션 테스트

// 1. 현재 데이터 상태를 시뮬레이션
const originalData = {
    accommodations: [
        {
            "id": "acc1",
            "accommodationName": "방콕 스위트룸 A동",
            "buildingName": "바이욕 레지던스",
            "address": "방콕 바이욕 지구",
            "roomType": "스위트룸",
            "capacity": 4,
            "area": 85,
            "monthlyRent": 85000,
            "deposit": 170000,
            "maintenanceFee": 5000,
            "agencyName": "태국부동산",
            "agencyContact": "+66-2-123-4567",
            "agencyFee": 8500,
            "ownerName": "소믈리 사장",
            "ownerContact": "+66-2-111-2222",
            "contractStart": "2024-01-01",
            "contractEnd": "2025-12-31",
            "notes": "고급 스위트룸",
            "gs_project_id": "project123",
            "gs_table_name": "accommodations",
            "created_at": 1672531200000,
            "updated_at": 1672531200000
        }
        // ... 총 5개 레코드
    ],
    
    reservations: [
        {
            "id": "res1", 
            "accommodationName": "방콕 스위트룸 A동",
            "guestName": "김철수",
            "guestPhone": "+82-10-1234-5678",
            "guestEmail": "kim@email.com",
            "checkinDate": "2024-12-01",
            "checkinTime": "15:00",
            "checkoutDate": "2024-12-03", 
            "checkoutTime": "11:00",
            "adults": 2,
            "children": 0,
            "totalAmount": 30000,
            "paidAmount": 30000,
            "paymentMethod": "신용카드",
            "platform": "에어비앤비", 
            "status": "체크아웃 완료",
            "specialRequests": "늦은 체크인 요청",
            "gs_project_id": "project123",
            "gs_table_name": "reservations"
        }
        // ... 총 10개 레코드  
    ],
    
    accounting: [
        {
            "id": "acc1",
            "accommodationName": "방콕 스위트룸 A동",
            "date": "2024-12-01", 
            "description": "숙박비 수입 (김철수)",
            "category": "수입",
            "incomeAmount": 30000,
            "expenseAmount": 0,
            "paymentMethod": "신용카드",
            "notes": "정상 체크인",
            "gs_project_id": "project123",
            "gs_table_name": "accounting"
        }
        // ... 총 10개 레코드
    ],
    
    investors: [
        {
            "id": "inv1",
            "name": "김투자",
            "phone": "+66-2-123-4567", 
            "email": "kim.investor@email.com",
            "settlementDay": 15,
            "investorRatio": 70,
            "companyRatio": 30,
            "accommodations": ["방콕 스위트룸 A동", "방콕 스위트룸 B동"], // 배열 필드!
            "notes": "기본 투자자",
            "gs_project_id": "project123",
            "gs_table_name": "investors"
        }
        // ... 총 3개 레코드
    ]
};

// 2. 백업 처리 시뮬레이션 (엑셀 변환)
function simulateBackupProcess(data) {
    console.log("=== 백업 처리 시뮬레이션 ===");
    
    const processedData = {};
    
    for (const [tableName, records] of Object.entries(data)) {
        console.log(`처리 중: ${tableName} (${records.length}개)`);
        
        const cleanData = records.map(row => {
            const clean = { ...row };
            
            // 시스템 필드 제거  
            delete clean.gs_project_id;
            delete clean.gs_table_name;
            delete clean.created_at;
            delete clean.updated_at;
            
            // 배열 필드 처리 (investors.accommodations)
            if (tableName === 'investors' && clean.accommodations && Array.isArray(clean.accommodations)) {
                clean.accommodations = JSON.stringify(clean.accommodations);
                console.log(`  → 배열 필드 변환: ${clean.accommodations}`);
            }
            
            return clean;
        });
        
        processedData[tableName] = cleanData;
    }
    
    return processedData;
}

// 3. 복원 처리 시뮬레이션 (엑셀에서 읽기)  
function simulateRestoreProcess(backupData) {
    console.log("=== 복원 처리 시뮬레이션 ===");
    
    const restoredData = {};
    
    for (const [tableName, records] of Object.entries(backupData)) {
        console.log(`복원 중: ${tableName} (${records.length}개)`);
        
        const processedRecords = records.map(record => {
            const clean = { ...record };
            
            // id 필드 제거 (새로 생성됨)
            delete clean.id;
            
            // 배열 필드 복원 (investors.accommodations)
            if (tableName === 'investors' && clean.accommodations && typeof clean.accommodations === 'string') {
                try {
                    clean.accommodations = JSON.parse(clean.accommodations);
                    console.log(`  → 배열 필드 복원: ${JSON.stringify(clean.accommodations)}`);
                } catch (e) {
                    clean.accommodations = [];
                    console.warn(`  → 배열 필드 복원 실패, 빈 배열로 처리`);
                }
            }
            
            return clean;
        });
        
        restoredData[tableName] = processedRecords;
    }
    
    return restoredData;
}

// 4. 데이터 비교 함수
function compareDataSets(original, restored) {
    console.log("=== 데이터 비교 분석 ===");
    
    const results = {
        totalSuccess: true,
        details: {}
    };
    
    for (const tableName in original) {
        const origRecords = original[tableName] || [];
        const restRecords = restored[tableName] || [];
        
        const tableResult = {
            name: tableName,
            originalCount: origRecords.length,
            restoredCount: restRecords.length,
            countMatch: origRecords.length === restRecords.length,
            fieldMatches: [],
            fieldMismatches: []
        };
        
        console.log(`\n${tableName}:`);
        console.log(`  원본: ${origRecords.length}개, 복원: ${restRecords.length}개`);
        
        if (origRecords.length > 0 && restRecords.length > 0) {
            // 첫 번째 레코드로 필드 구조 비교
            const origFields = Object.keys(origRecords[0] || {}).filter(f => 
                !['id', 'gs_project_id', 'gs_table_name', 'created_at', 'updated_at'].includes(f)
            );
            const restFields = Object.keys(restRecords[0] || {});
            
            // 필드 비교
            for (const field of origFields) {
                if (restFields.includes(field)) {
                    // 값 비교 (첫 번째 레코드만)
                    const origValue = origRecords[0][field];
                    const restValue = restRecords[0][field];
                    
                    if (JSON.stringify(origValue) === JSON.stringify(restValue)) {
                        tableResult.fieldMatches.push(field);
                    } else {
                        tableResult.fieldMismatches.push({
                            field,
                            original: origValue,
                            restored: restValue
                        });
                        console.warn(`  ⚠️  ${field}: 원본(${JSON.stringify(origValue)}) ≠ 복원(${JSON.stringify(restValue)})`);
                    }
                } else {
                    tableResult.fieldMismatches.push({
                        field,
                        original: "존재함",
                        restored: "누락됨"
                    });
                    console.error(`  ❌ 필드 누락: ${field}`);
                }
            }
            
            console.log(`  ✅ 일치하는 필드: ${tableResult.fieldMatches.length}개`);
            console.log(`  ❌ 불일치 필드: ${tableResult.fieldMismatches.length}개`);
        }
        
        tableResult.success = tableResult.countMatch && tableResult.fieldMismatches.length === 0;
        results.details[tableName] = tableResult;
        
        if (!tableResult.success) {
            results.totalSuccess = false;
        }
    }
    
    return results;
}

// 5. 테스트 실행
console.log("백업 시스템 완전성 테스트 시작");

const backupData = simulateBackupProcess(originalData);
const restoredData = simulateRestoreProcess(backupData);  
const comparisonResult = compareDataSets(originalData, restoredData);

console.log("\n=== 최종 테스트 결과 ===");
console.log(`전체 성공 여부: ${comparisonResult.totalSuccess ? '✅ 성공' : '❌ 실패'}`);

for (const [table, result] of Object.entries(comparisonResult.details)) {
    console.log(`${table}: ${result.success ? '✅' : '❌'} (${result.originalCount}→${result.restoredCount})`);
}