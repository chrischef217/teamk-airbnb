// 공통 인증 관련 함수들

// 강화된 세션 검증 함수
function verifySession() {
    console.log('🔍 세션 검증 시작');
    
    let userType = sessionStorage.getItem('userType');
    let userName = sessionStorage.getItem('userName');
    let userId = sessionStorage.getItem('userId');
    
    console.log('📋 세션 스토리지 상태:', { userType, userName, userId });
    
    // sessionStorage가 비어있으면 localStorage에서 복원
    if (!userType || !userName || !userId) {
        console.log('⚠️ 세션 스토리지 불완전, localStorage에서 복원 시도');
        
        const localUserType = localStorage.getItem('userType');
        const localUserName = localStorage.getItem('userName');
        const localUserId = localStorage.getItem('userId');
        
        console.log('📋 로컬 스토리지 상태:', { localUserType, localUserName, localUserId });
        
        if (localUserType && localUserName && localUserId) {
            // localStorage에서 sessionStorage로 복원
            sessionStorage.setItem('userType', localUserType);
            sessionStorage.setItem('userName', localUserName);
            sessionStorage.setItem('userId', localUserId);
            
            userType = localUserType;
            userName = localUserName;
            userId = localUserId;
            
            console.log('✅ localStorage에서 세션 복원 완료');
        }
    }
    
    // 여전히 불완전하면 false 반환
    if (!userType || !userName || !userId) {
        console.log('❌ 유효한 세션 없음');
        return false;
    }
    
    console.log('✅ 세션 검증 성공:', { userType, userName, userId });
    return { userType, userName, userId };
}

// 로그인 상태 확인
function checkLoginStatus(allowInvestor = true, adminOnly = false) {
    const session = verifySession();
    
    if (!session) {
        console.log('❌ 로그인되지 않음 - index.html로 이동');
        // 현재 페이지가 이미 index.html이 아닌 경우에만 리다이렉트
        const currentPath = window.location.pathname;
        if (currentPath !== '/index.html' && !currentPath.endsWith('index.html') && currentPath !== '/') {
            window.location.replace('index.html');
        }
        return false;
    }
    
    const { userType, userName, userId } = session;
    console.log('🔍 로그인 상태 체크:', { userType, userName, currentPage: window.location.pathname });
    
    // 관리자 전용 페이지 체크
    if (adminOnly && userType !== 'admin') {
        alert('관리자만 접근할 수 있는 페이지입니다.');
        window.location.href = 'dashboard.html';
        return false;
    }
    
    // 투자자 접근 허용 여부 체크
    if (!allowInvestor && userType === 'investor') {
        alert('투자자는 이 기능을 이용할 수 없습니다.');
        window.location.href = 'dashboard.html';
        return false;
    }
    
    // 사용자 정보 표시
    addUserInfo(userName, userType);
    return true;
}

// 사용자 정보 표시
function addUserInfo(userName, userType) {
    const header = document.querySelector('h1');
    if (header && userName && !document.querySelector('.user-info')) {
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info text-sm text-gray-600 mt-2';
        userInfo.innerHTML = `
            <i class="fas ${userType === 'admin' ? 'fa-user-shield' : 'fa-user'} mr-1"></i>
            ${userName}님으로 로그인됨
            <button onclick="logout()" class="ml-4 text-blue-600 hover:text-blue-800">
                <i class="fas fa-sign-out-alt mr-1"></i>로그아웃
            </button>
        `;
        header.parentNode.appendChild(userInfo);
    }
}

// 로그아웃
function logout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        console.log('🔓 로그아웃 진행');
        
        // 모든 인증 관련 데이터 완전 삭제
        sessionStorage.clear();
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        
        console.log('✅ 세션 데이터 완전 삭제');
        
        // 강제로 로그인 페이지로 이동
        window.location.replace('index.html');
    }
}

// 현재 사용자 정보 가져오기
function getCurrentUser() {
    return {
        userType: sessionStorage.getItem('userType'),
        userId: sessionStorage.getItem('userId'),
        userName: sessionStorage.getItem('userName')
    };
}

// 투자자별 보유 숙소 매핑 - 동적으로 localStorage에서 가져옴
function getInvestorAccommodations() {
    const investorData = localStorage.getItem('investorData');
    if (!investorData) return {};
    
    const investors = JSON.parse(investorData);
    const mapping = {};
    
    investors.forEach(investor => {
        mapping[investor.userId] = investor.accommodations || [];
    });
    
    return mapping;
}

// 현재 사용자가 접근 가능한 숙소 ID 목록 가져오기
function getAccessibleAccommodations() {
    const user = getCurrentUser();
    
    if (user.userType === 'admin') {
        return null; // 관리자는 모든 숙소 접근 가능
    }
    
    if (user.userType === 'investor') {
        const investorAccommodations = getInvestorAccommodations();
        return investorAccommodations[user.userId] || [];
    }
    
    return [];
}

// 데이터 필터링 함수 (투자자는 자신의 숙소만)
function filterDataByAccess(data, accommodationIdField = 'accommodationId') {
    const user = getCurrentUser();
    
    // 관리자는 모든 데이터 접근
    if (user.userType === 'admin') {
        return data;
    }
    
    // 투자자는 자신의 숙소 데이터만
    if (user.userType === 'investor') {
        const accessibleIds = getAccessibleAccommodations();
        return data.filter(item => {
            // 숙소 데이터 자체인 경우 (accommodation.html)
            if (item.id && accessibleIds.includes(item.id)) {
                return true;
            }
            // 연결된 숙소 ID가 있는 경우 (analytics, reservation 등)
            if (item[accommodationIdField] && accessibleIds.includes(item[accommodationIdField])) {
                return true;
            }
            // 투자자 데이터인 경우 자신만 (investor.html)
            if (item.userId && item.userId === user.userId) {
                return true;
            }
            return false;
        });
    }
    
    return [];
}

// 모든 데이터를 강제로 필터링하는 래퍼 함수
function getFilteredData(dataArray, accommodationIdField = 'accommodationId') {
    if (!Array.isArray(dataArray)) {
        return [];
    }
    return filterDataByAccess(dataArray, accommodationIdField);
}

// 백업 기능 접근 권한 체크
function checkBackupAccess() {
    const user = getCurrentUser();
    
    if (user.userType !== 'admin') {
        alert('백업 기능은 관리자만 사용할 수 있습니다.');
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// 네비게이션 권한 관리
function setupNavigationPermissions() {
    const user = getCurrentUser();
    
    if (user.userType === 'investor') {
        // 즉시 실행
        hideBackupButtons();
        
        // 지연 실행 (DOM 로딩 완료 후)
        setTimeout(() => {
            hideBackupButtons();
        }, 500);
    }
}

function hideBackupButtons() {
    // 다양한 방법으로 백업 버튼 찾기
    const selectors = [
        '[onclick*="backup.html"]',
        '[href*="backup.html"]',
        'button:contains("백업")',
        'a:contains("백업")',
        '[data-page="backup"]'
    ];
    
    selectors.forEach(selector => {
        try {
            const buttons = document.querySelectorAll(selector);
            buttons.forEach(button => {
                button.style.display = 'none';
                button.style.visibility = 'hidden';
                button.remove(); // 완전히 제거
            });
        } catch (e) {
            // 선택자 오류 무시
        }
    });
    
    // 텍스트로 백업 버튼 찾기
    const allButtons = document.querySelectorAll('button, a');
    allButtons.forEach(button => {
        if (button.textContent && button.textContent.includes('백업')) {
            button.style.display = 'none';
        }
    });
}

// 편집 권한 체크 함수
function checkEditPermission() {
    const user = getCurrentUser();
    
    if (user.userType === 'investor') {
        alert('투자자는 데이터를 수정할 수 없습니다. 읽기 전용 모드입니다.');
        return false;
    }
    
    return true;
}

// 투자자를 위한 수정 버튼 비활성화
function disableEditingForInvestor() {
    const user = getCurrentUser();
    
    if (user.userType !== 'investor') return;

    // 즉시 실행할 것들
    disableImmediateElements();
    
    // DOM 로딩 후 실행할 것들
    setTimeout(() => {
        disableDelayedElements();
    }, 500);
    
    // MutationObserver로 동적 요소 감시
    observeDynamicElements();
}

// 즉시 비활성화할 요소들
function disableImmediateElements() {
    // 기존 추가 버튼들
    const addButtons = document.querySelectorAll('[onclick*="openModal"], [onclick*="add"], [onclick*="edit"]');
    addButtons.forEach(button => {
        const originalOnclick = button.getAttribute('onclick');
        button.removeAttribute('onclick');
        button.onclick = function(e) {
            e.preventDefault();
            alert('투자자는 데이터를 수정할 수 없습니다.');
        };
        button.classList.add('opacity-50', 'cursor-not-allowed');
    });
}

// 지연 비활성화할 요소들
function disableDelayedElements() {
    // 모든 모달의 입력 필드 비활성화
    const modals = document.querySelectorAll('[id*="Modal"], [id*="modal"]');
    modals.forEach(modal => {
        const inputs = modal.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (!input.classList.contains('search-input')) { // 검색 필드 제외
                input.readOnly = true;
                input.classList.add('bg-gray-100');
            }
        });
        
        const submitButtons = modal.querySelectorAll('button[type="submit"]');
        submitButtons.forEach(button => {
            button.disabled = true;
            button.classList.add('opacity-50', 'cursor-not-allowed');
        });
        
        const editButtons = modal.querySelectorAll('#editButton, .edit-btn');
        editButtons.forEach(button => {
            button.style.display = 'none';
        });
    });
}

// 동적으로 생성되는 요소들 감시
function observeDynamicElements() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    // 새로 생성된 클릭 가능한 요소들 체크
                    if (node.onclick || node.querySelector('[onclick]')) {
                        setTimeout(() => disableDelayedElements(), 100);
                    }
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// 페이지 로드 시 권한 설정 적용
function initializePagePermissions() {
    const user = getCurrentUser();
    
    // 네비게이션 권한 설정
    setupNavigationPermissions();
    
    // 투자자 편집 권한 제한
    disableEditingForInvestor();
    
    // 투자자인 경우 데이터 필터링 적용
    if (user.userType === 'investor') {
        console.log('투자자 모드: 데이터 필터링 및 편집 제한 적용됨');
        console.log('접근 가능한 숙소:', getAccessibleAccommodations());
        
        // 기존 렌더링 함수들을 오버라이드
        overrideRenderFunctions();
    }
}

// 렌더링 함수들을 오버라이드해서 투자자 권한 적용
function overrideRenderFunctions() {
    // 모든 데이터 배열을 필터링하는 전역 객체
    window.investorFilter = {
        accommodations: [],
        reservations: [],
        investors: [],
        accountingData: [],
        
        // 데이터 설정 시 자동 필터링
        setData: function(dataType, data) {
            this[dataType] = getFilteredData(data, dataType === 'accommodations' ? 'id' : 'accommodationId');
        },
        
        // 데이터 가져오기
        getData: function(dataType) {
            return this[dataType] || [];
        }
    };
    
    // 전역 변수들을 필터링된 데이터로 교체
    setTimeout(() => {
        const user = getCurrentUser();
        if (user.userType === 'investor') {
            // accommodations 필터링
            if (typeof window.accommodations !== 'undefined') {
                window.accommodations = getFilteredData(window.accommodations, 'id');
            }
            
            // reservations 필터링
            if (typeof window.reservations !== 'undefined') {
                window.reservations = getFilteredData(window.reservations);
            }
            
            // investors 필터링 (자신만)
            if (typeof window.investors !== 'undefined') {
                window.investors = window.investors.filter(inv => inv.userId === user.userId);
            }
            
            // accountingData 필터링
            if (typeof window.accountingData !== 'undefined') {
                window.accountingData = getFilteredData(window.accountingData);
            }
        }
    }, 100);
}