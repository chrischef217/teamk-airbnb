// 공통 인증 관련 함수들

// 로그인 상태 확인 (관리자 전용 시스템)
function checkLoginStatus(adminOnly = true) {
    const userType = sessionStorage.getItem('userType');
    const userName = sessionStorage.getItem('userName');
    
    if (!userType) {
        window.location.href = 'login.html';
        return false;
    }
    
    // 모든 페이지가 관리자 전용 (투자자 로그인 기능 제거됨)
    if (userType !== 'admin') {
        alert('관리자만 접근할 수 있는 시스템입니다.');
        sessionStorage.clear(); // 잘못된 세션 정보 제거
        window.location.href = 'login.html';
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

// 관리자 전용 시스템 - 투자자 관련 기능 제거됨

// 페이지 로드 시 권한 설정 적용 (관리자 전용 시스템)
function initializePagePermissions() {
    const user = getCurrentUser();
    
    if (user.userType !== 'admin') {
        // 관리자가 아닌 경우 로그인 페이지로 리다이렉트
        alert('관리자만 접근할 수 있는 시스템입니다.');
        sessionStorage.clear();
        window.location.href = 'login.html';
        return false;
    }
    
    console.log('관리자 모드: 모든 기능 접근 가능');
    return true;
}