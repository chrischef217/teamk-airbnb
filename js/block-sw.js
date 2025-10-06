// Service Worker 등록 완전 차단 스크립트
// workbox나 다른 라이브러리가 Service Worker를 등록하려고 시도하는 것을 방지

(function() {
    'use strict';
    
    console.log('🛡️ Service Worker 등록 차단 모드 활성화');
    
    // Service Worker 등록 함수를 무효화
    if ('serviceWorker' in navigator) {
        const originalRegister = navigator.serviceWorker.register;
        
        navigator.serviceWorker.register = function(...args) {
            console.warn('🚫 Service Worker 등록 시도가 차단되었습니다:', args[0]);
            console.warn('   스크립트 스택:', new Error().stack);
            
            // 등록 대신 즉시 실패하는 Promise 반환
            return Promise.reject(new Error('Service Worker 등록이 차단되었습니다.'));
        };
        
        console.log('✅ Service Worker 등록 함수 무효화 완료');
    }
    
    // workbox 라이브러리 로딩 방지
    Object.defineProperty(window, 'workbox', {
        get: function() {
            console.warn('🚫 workbox 접근 시도가 차단되었습니다.');
            return undefined;
        },
        set: function(value) {
            console.warn('🚫 workbox 설정 시도가 차단되었습니다.');
            // 설정을 무시함
        },
        configurable: false
    });
    
    // __WB_MANIFEST 방지
    Object.defineProperty(window, '__WB_MANIFEST', {
        get: function() {
            console.warn('🚫 workbox manifest 접근 시도가 차단되었습니다.');
            return undefined;
        },
        set: function(value) {
            console.warn('🚫 workbox manifest 설정 시도가 차단되었습니다.');
            // 설정을 무시함
        },
        configurable: false
    });
    
    // 기타 PWA 관련 전역 변수들 방지
    const blockedGlobals = [
        '__precacheManifest',
        '__WB_DISABLE_DEV_LOGS',
        'swReg',
        'serviceWorkerRegistration'
    ];
    
    blockedGlobals.forEach(globalName => {
        Object.defineProperty(window, globalName, {
            get: function() {
                console.warn(`🚫 ${globalName} 접근 시도가 차단되었습니다.`);
                return undefined;
            },
            set: function(value) {
                console.warn(`🚫 ${globalName} 설정 시도가 차단되었습니다.`);
                // 설정을 무시함
            },
            configurable: false
        });
    });
    
    // 스크립트 로딩 감시 및 workbox 관련 스크립트 차단
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(this, tagName);
        
        if (tagName.toLowerCase() === 'script') {
            const originalSetAttribute = element.setAttribute;
            element.setAttribute = function(name, value) {
                if (name.toLowerCase() === 'src' && typeof value === 'string') {
                    if (value.includes('workbox') || 
                        value.includes('sw.js') || 
                        value.includes('service-worker')) {
                        console.warn('🚫 Service Worker 관련 스크립트 로딩이 차단되었습니다:', value);
                        return; // 속성 설정을 무시
                    }
                }
                return originalSetAttribute.call(this, name, value);
            };
        }
        
        return element;
    };
    
    // 네트워크 요청 감시 (fetch API)
    if (typeof window.fetch === 'function') {
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            if (typeof url === 'string') {
                if (url.includes('workbox') || 
                    url.endsWith('sw.js') || 
                    url.includes('service-worker')) {
                    console.warn('🚫 Service Worker 관련 네트워크 요청이 차단되었습니다:', url);
                    return Promise.reject(new Error('Service Worker 관련 요청이 차단되었습니다.'));
                }
            }
            return originalFetch.call(this, url, options);
        };
    }
    
    console.log('✅ Service Worker 등록 차단 시스템 완전 활성화');
    
})();

// 페이지 언로드 시에도 Service Worker 정리
window.addEventListener('beforeunload', function() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => {
                registration.unregister();
            });
        }).catch(() => {});
    }
});