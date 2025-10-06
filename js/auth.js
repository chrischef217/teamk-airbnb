// 공통 인증 관련 함수들

// 로그인 상태 확인
function checkLoginStatus(allowInvestor = true, adminOnly = false) {
    const userType = sessionStorage.getItem('userType');
    const userName = sessionStorage.getItem('userName');
    
    if (!userType) {
        window.location.href = 'login.html';
        return false;
    }
    
    // 관리자 전용 페이지 체크
    if (adminOnly && userType !== 'admin') {
        alert('관리자만 접근할 수 있는 페이지입니다.');
        window.location.href = 'index.html';
        return false;
    }
    
    // 투자자 접근 허용 여부 체크
    if (!allowInvestor && userType === 'investor') {
        alert('투자자는 이 기능을 이용할 수 없습니다.');
        window.location.href = 'index.html';
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
        sessionStorage.clear();
        window.location.href = 'login.html';
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
        return data.filter(item => accessibleIds.includes(item[accommodationIdField]));
    }
    
    return [];
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
        // 백업 탭 숨기기 또는 비활성화
        const backupButtons = document.querySelectorAll('[onclick*="backup.html"]');
        backupButtons.forEach(button => {
            button.style.display = 'none'; // 완전히 숨기기
            // 또는 버튼을 비활성화하려면:
            // button.classList.add('opacity-50', 'cursor-not-allowed');
            // button.onclick = function(e) {
            //     e.preventDefault();
            //     alert('백업 기능은 관리자만 사용할 수 있습니다.');
            // };
        });
    }
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
    
    if (user.userType === 'investor') {
        // 지연 실행으로 DOM이 완전히 로드된 후 적용
        setTimeout(() => {
            // HTML onclick attribute가 있는 버튼들
            const addButtons = document.querySelectorAll('[onclick*="openModal(\'add\')"]');
            addButtons.forEach(button => {
                button.onclick = function(e) {
                    e.preventDefault();
                    alert('투자자는 데이터를 수정할 수 없습니다.');
                };
                button.classList.add('opacity-50', 'cursor-not-allowed');
            });

            // 모달 창의 편집 버튼
            const editButton = document.getElementById('editButton');
            if (editButton) {
                editButton.style.display = 'none';
            }

            // 제출 버튼 비활성화
            const submitButtons = document.querySelectorAll('button[type="submit"]');
            submitButtons.forEach(button => {
                button.disabled = true;
                button.classList.add('opacity-50', 'cursor-not-allowed');
            });

            // 폼 입력 필드를 읽기 전용으로 (모든 페이지에서 적용하지 않고 모달에서만)
            const modal = document.getElementById('accommodationModal') || document.getElementById('investorModal');
            if (modal) {
                const inputs = modal.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    input.readOnly = true;
                    input.classList.add('bg-gray-100');
                });
            }
        }, 100);
    }
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
    }
}