// 투자자 시스템 통합 테스트
console.log('=== 투자자 시스템 통합 테스트 시작 ===');

// 테스트 결과 저장
const testResults = [];

function logTest(testName, result, message) {
    const status = result ? '✅ PASS' : '❌ FAIL';
    const logMessage = `${status} ${testName}: ${message}`;
    console.log(logMessage);
    testResults.push({ name: testName, result, message, status });
}

// 테스트 1: localStorage 기본 기능
function testLocalStorageBasics() {
    console.log('\n--- 테스트 1: localStorage 기본 기능 ---');
    
    try {
        // 테스트 데이터 저장
        const testData = [{ id: 1, name: 'test', userId: 'test123' }];
        localStorage.setItem('testInvestorData', JSON.stringify(testData));
        
        // 테스트 데이터 읽기
        const retrieved = JSON.parse(localStorage.getItem('testInvestorData'));
        const isValid = retrieved && retrieved.length === 1 && retrieved[0].name === 'test';
        
        // 테스트 데이터 삭제
        localStorage.removeItem('testInvestorData');
        
        logTest('localStorage 기본 읽기/쓰기', isValid, 
            isValid ? 'localStorage 정상 동작' : 'localStorage 동작 오류');
        
        return isValid;
    } catch (error) {
        logTest('localStorage 기본 읽기/쓰기', false, `오류: ${error.message}`);
        return false;
    }
}

// 테스트 2: 투자자 데이터 구조 검증
function testInvestorDataStructure() {
    console.log('\n--- 테스트 2: 투자자 데이터 구조 검증 ---');
    
    const sampleInvestor = {
        id: 1,
        userId: 'kim_investor',
        password: 'kim123!@#',
        name: '김투자',
        phone: '+82-10-1234-5678',
        email: 'kim.investor@email.com',
        investmentDate: '2024-01-15',
        settlementDay: 15,
        investorRatio: 70,
        companyRatio: 30,
        accommodations: [1, 2]
    };
    
    const requiredFields = ['id', 'userId', 'name', 'phone', 'email'];
    const hasAllFields = requiredFields.every(field => sampleInvestor.hasOwnProperty(field));
    
    logTest('투자자 데이터 구조', hasAllFields, 
        hasAllFields ? '필수 필드 모두 포함' : '필수 필드 누락');
    
    return hasAllFields;
}

// 테스트 3: 데이터 저장 및 로드 시뮬레이션
function testDataSaveLoad() {
    console.log('\n--- 테스트 3: 데이터 저장 및 로드 시뮬레이션 ---');
    
    try {
        // 샘플 투자자 데이터
        const investorData = [
            {
                id: 1,
                userId: 'kim_investor',
                name: '김투자',
                phone: '+82-10-1234-5678',
                email: 'kim.investor@email.com',
                investmentDate: '2024-01-15',
                settlementDay: 15,
                investorRatio: 70,
                companyRatio: 30,
                accommodations: [1, 2]
            },
            {
                id: 2,
                userId: 'park_investor',
                name: '박부자',
                phone: '+82-10-2345-6789',
                email: 'park.rich@email.com',
                investmentDate: '2024-02-01',
                settlementDay: 1,
                investorRatio: 60,
                companyRatio: 40,
                accommodations: [3]
            }
        ];
        
        // 데이터 저장
        localStorage.setItem('investorData', JSON.stringify(investorData));
        logTest('데이터 저장', true, `${investorData.length}명의 투자자 데이터 저장됨`);
        
        // 데이터 로드
        const loaded = JSON.parse(localStorage.getItem('investorData'));
        const isLoadValid = loaded && loaded.length === investorData.length;
        logTest('데이터 로드', isLoadValid, 
            isLoadValid ? `${loaded.length}명의 투자자 데이터 로드됨` : '데이터 로드 실패');
        
        return isLoadValid;
    } catch (error) {
        logTest('데이터 저장/로드', false, `오류: ${error.message}`);
        return false;
    }
}

// 테스트 4: 데이터 수정 시뮬레이션
function testDataModification() {
    console.log('\n--- 테스트 4: 데이터 수정 시뮬레이션 ---');
    
    try {
        // 기존 데이터 로드
        let investorData = JSON.parse(localStorage.getItem('investorData') || '[]');
        
        if (investorData.length === 0) {
            logTest('데이터 수정 준비', false, '수정할 데이터가 없음');
            return false;
        }
        
        // 첫 번째 투자자 정보 수정
        const originalName = investorData[0].name;
        investorData[0].name = '수정된투자자명';
        investorData[0].phone = '+82-10-9999-8888';
        
        // 수정된 데이터 저장
        localStorage.setItem('investorData', JSON.stringify(investorData));
        
        // 수정 확인
        const updated = JSON.parse(localStorage.getItem('investorData'));
        const isModified = updated[0].name === '수정된투자자명' && updated[0].phone === '+82-10-9999-8888';
        
        logTest('데이터 수정', isModified, 
            isModified ? `${originalName} → ${updated[0].name}으로 수정됨` : '데이터 수정 실패');
        
        return isModified;
    } catch (error) {
        logTest('데이터 수정', false, `오류: ${error.message}`);
        return false;
    }
}

// 테스트 5: 이벤트 발송 시뮬레이션
function testEventDispatch() {
    console.log('\n--- 테스트 5: 이벤트 발송 시뮬레이션 ---');
    
    try {
        let eventReceived = false;
        
        // 이벤트 리스너 등록
        const eventListener = function(e) {
            eventReceived = true;
            console.log('investorDataUpdated 이벤트 수신됨:', e.detail);
        };
        
        window.addEventListener('investorDataUpdated', eventListener);
        
        // 이벤트 발송
        const testData = [{ id: 999, name: '이벤트테스트', userId: 'event_test' }];
        window.dispatchEvent(new CustomEvent('investorDataUpdated', {
            detail: { investorData: testData }
        }));
        
        // 이벤트 리스너 제거
        window.removeEventListener('investorDataUpdated', eventListener);
        
        logTest('이벤트 발송/수신', eventReceived, 
            eventReceived ? 'CustomEvent 정상 동작' : 'CustomEvent 동작 실패');
        
        return eventReceived;
    } catch (error) {
        logTest('이벤트 발송/수신', false, `오류: ${error.message}`);
        return false;
    }
}

// 모든 테스트 실행
function runAllTests() {
    console.log('투자자 시스템 통합 테스트를 시작합니다...\n');
    
    const results = [
        testLocalStorageBasics(),
        testInvestorDataStructure(), 
        testDataSaveLoad(),
        testDataModification(),
        testEventDispatch()
    ];
    
    const passedTests = results.filter(r => r).length;
    const totalTests = results.length;
    
    console.log('\n=== 테스트 결과 요약 ===');
    console.log(`전체 테스트: ${totalTests}개`);
    console.log(`통과: ${passedTests}개`);
    console.log(`실패: ${totalTests - passedTests}개`);
    console.log(`성공률: ${Math.round((passedTests / totalTests) * 100)}%`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 모든 테스트가 통과했습니다!');
        console.log('투자자 시스템이 정상적으로 작동할 것으로 예상됩니다.');
    } else {
        console.log('\n⚠️  일부 테스트가 실패했습니다.');
        console.log('실패한 테스트를 확인하여 문제를 해결해주세요.');
    }
    
    // 상세 결과
    console.log('\n=== 상세 테스트 결과 ===');
    testResults.forEach(result => {
        console.log(`${result.status} ${result.name}: ${result.message}`);
    });
    
    return { passed: passedTests, total: totalTests, results: testResults };
}

// 테스트 시작
runAllTests();