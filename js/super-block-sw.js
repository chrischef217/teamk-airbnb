// 🛡️ SUPER SERVICE WORKER BLOCKER - 100% 완벽 차단
// 이 스크립트는 어떤 방법으로든 Service Worker 등록을 완전히 차단합니다

(function() {
    'use strict';
    
    // Service Worker 보호 시스템 활성화 (조용한 모드)
    
    // === 1. 즉시 실행 완전 제거 ===
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => {
                registration.unregister().then(() => {
                    console.log('🗑️ 즉시 제거:', registration.scope);
                }).catch(err => {
                    console.error('제거 실패:', err);
                });
            });
        }).catch(err => {
            console.error('등록 확인 실패:', err);
        });
    }
    
    // === 2. 모든 캐시 즉시 삭제 ===
    if ('caches' in window) {
        caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
                caches.delete(cacheName).then(() => {
                    console.log('🗑️ 캐시 삭제:', cacheName);
                });
            });
        });
    }
    
    // === 3. Navigator ServiceWorker 완전 무력화 ===
    if ('serviceWorker' in navigator) {
        // register 함수 완전 교체
        const originalRegister = navigator.serviceWorker.register;
        navigator.serviceWorker.register = function() {
            console.error('🚫 Service Worker 등록 시도가 SUPER BLOCKER에 의해 차단됨');
            return Promise.reject(new Error('SUPER BLOCKER: Service Worker 등록 금지'));
        };
        
        // 다른 ServiceWorker 메서드들도 무력화
        const swMethods = ['getRegistration', 'getRegistrations', 'startMessages'];
        swMethods.forEach(method => {
            if (navigator.serviceWorker[method]) {
                const original = navigator.serviceWorker[method];
                navigator.serviceWorker[method] = function() {
                    console.warn(`🚫 ServiceWorker.${method} 호출이 차단됨`);
                    if (method === 'getRegistrations') {
                        return Promise.resolve([]);
                    }
                    return Promise.resolve(null);
                };
            }
        });
        
        // ServiceWorker 자체를 undefined로 만들기
        Object.defineProperty(navigator, 'serviceWorker', {
            get: function() {
                // 완전히 조용한 차단
                return undefined;
            },
            set: function() {
                // 완전히 조용한 차단
            },
            configurable: false,
            enumerable: false
        });
    }
    
    // === 4. 전역 변수 완전 차단 ===
    const blockedGlobals = [
        'workbox',
        '__WB_MANIFEST',
        '__precacheManifest',
        '__WB_DISABLE_DEV_LOGS',
        'swReg',
        'serviceWorkerRegistration',
        'registration',
        'sw',
        'workboxSW',
        'WorkboxSW',
        '__workbox',
        'wb',
        'WB'
    ];
    
    blockedGlobals.forEach((globalName) => {
        // 즉시 삭제
        if (window[globalName]) {
            delete window[globalName];
        }
        
        // 클로저로 변수명 캡처
        (function(varName) {
            Object.defineProperty(window, varName, {
                get: function() {
                    // 전역 로그 제한 - 모든 차단된 변수에 대해 총 3번만 로그
                    if (!window.__global_block_logged) {
                        window.__global_block_logged = 0;
                    }
                    if (window.__global_block_logged < 1) {
                        console.warn('🛡️ Service Worker 관련 변수 차단됨');
                        window.__global_block_logged++;
                    }
                    return undefined;
                },
                set: function(value) {
                    // 조용히 무시 - 로그 없음
                },
                configurable: false,
                enumerable: false
            });
        })(globalName);
    });
    
    // === 4.1. 모든 workbox 관련 함수 차단 ===
    const workboxMethods = [
        'precaching',
        'routing', 
        'strategies',
        'expiration',
        'backgroundSync',
        'cacheableResponse',
        'broadcastUpdate',
        'rangeRequests',
        'googleAnalytics',
        'core'
    ];
    
    workboxMethods.forEach((method) => {
        (function(methodName) {
            Object.defineProperty(window, methodName, {
                get: function() {
                    // 조용히 차단 - 로그 없음
                    return undefined;
                },
                set: function() {
                    // 조용히 차단 - 로그 없음
                },
                configurable: false,
                enumerable: false
            });
        })(method);
    });
    
    // === 5. DOM API 감시 및 차단 ===
    // createElement 감시
    const originalCreateElement = document.createElement;
    let blockedScriptCount = 0;
    
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(this, tagName);
        
        if (tagName.toLowerCase() === 'script') {
            const originalSetAttribute = element.setAttribute;
            element.setAttribute = function(name, value) {
                if (name.toLowerCase() === 'src' && typeof value === 'string') {
                    const blocked = [
                        'workbox', 'sw.js', 'service-worker', 'serviceworker',
                        'pwa', 'manifest', 'precache', 'runtime-cache'
                    ];
                    
                    if (blocked.some(term => value.toLowerCase().includes(term))) {
                        // 조용히 차단
                        return; // 속성 설정 무시
                    }
                }
                return originalSetAttribute.call(this, name, value);
            };
            
            // onload 이벤트도 감시
            const originalOnLoad = element.onload;
            Object.defineProperty(element, 'onload', {
                set: function(fn) {
                    if (typeof fn === 'function') {
                        element.addEventListener('load', function() {
                            // workbox 초기화 감지 및 차단
                            if (window.workbox || window.__WB_MANIFEST) {
                                console.error('🚫 workbox 초기화 감지됨 - 즉시 차단');
                                delete window.workbox;
                                delete window.__WB_MANIFEST;
                            }
                            fn.apply(this, arguments);
                        });
                    }
                }
            });
        }
        
        return element;
    };
    
    // === 6. Fetch API 감시 및 차단 ===
    const originalFetch = window.fetch;
    let blockedRequestCount = 0;
    
    window.fetch = function(url, options) {
        if (typeof url === 'string') {
            const blocked = ['workbox', 'sw.js', 'service-worker', 'precache', 'manifest.json'];
            if (blocked.some(term => url.toLowerCase().includes(term))) {
                // 조용히 차단
                return Promise.reject(new Error('Request blocked'));
            }
        }
        return originalFetch.call(this, url, options);
    };
    
    // === 7. 이벤트 리스너 감시 ===
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    let blockedEventCount = 0;
    
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'install' || type === 'activate' || type === 'fetch') {
            // 조용히 차단
            return;
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
    
    // === 8. 주기적 감시 및 정리 (로그 최적화) ===
    let swDetectionCount = 0;
    let workboxDetectionCount = 0;
    let cacheDetectionCount = 0;
    
    setInterval(() => {
        // Service Worker 재등록 감지 (안전 검사 포함)
        if ('serviceWorker' in navigator && navigator.serviceWorker && typeof navigator.serviceWorker.getRegistrations === 'function') {
            try {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                    if (registrations && registrations.length > 0) {
                        // 조용히 제거
                        registrations.forEach(reg => reg.unregister());
                    }
                }).catch(() => {});
            } catch (e) {
                // navigator.serviceWorker가 이미 무력화되었으므로 정상적인 상황
            }
        }
        
        // workbox 전역 변수 재등장 감지
        if (window.workbox) {
            // 조용히 삭제
            delete window.workbox;
        }
        
        // 캐시 재생성 감지 (덜 빈번하게 확인)
        if (Date.now() % 5000 < 1000 && 'caches' in window) { // 5초마다 한번만
            caches.keys().then(cacheNames => {
                const workboxCaches = cacheNames.filter(name => 
                    name.includes('workbox') || name.includes('precache')
                );
                if (workboxCaches.length > 0) {
                    // 조용히 삭제
                    workboxCaches.forEach(name => caches.delete(name));
                }
            });
        }
    }, 1000); // 1초마다 감시
    
    // === 9. 페이지 언로드 시 완전 정리 ===
    window.addEventListener('beforeunload', () => {
        if ('serviceWorker' in navigator && navigator.serviceWorker && typeof navigator.serviceWorker.getRegistrations === 'function') {
            try {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                    if (registrations) {
                        registrations.forEach(reg => reg.unregister());
                    }
                }).catch(() => {});
            } catch (e) {
                // navigator.serviceWorker가 이미 무력화되었으므로 정상적인 상황
            }
        }
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => caches.delete(name));
            });
        }
    });
    
    // === 10. 완전 무력화 확인 ===
    setTimeout(() => {
        if ('serviceWorker' in navigator && navigator.serviceWorker && typeof navigator.serviceWorker.register === 'function') {
            try {
                navigator.serviceWorker.register('test.js').then(() => {
                    console.error('❌ SUPER BLOCKER 실패! Service Worker가 여전히 등록 가능');
                }).catch(() => {
                    console.log('✅ SUPER BLOCKER 성공! Service Worker 등록 완전 차단');
                });
            } catch (e) {
                console.log('✅ SUPER BLOCKER 성공! navigator.serviceWorker 완전 무력화');
            }
        } else {
            console.log('✅ SUPER BLOCKER 성공! navigator.serviceWorker 존재하지 않음');
        }
        
        // Service Worker 보호 시스템 활성화 완료
    }, 100);
    
})();

// 긴급 수동 정리 함수 (개발자 도구에서 사용)
window.emergencyCleanup = function() {
    console.log('🆘 긴급 정리 시작');
    
    // 모든 Service Worker 제거
    if ('serviceWorker' in navigator && navigator.serviceWorker && typeof navigator.serviceWorker.getRegistrations === 'function') {
        try {
            navigator.serviceWorker.getRegistrations().then(regs => {
                if (regs) {
                    regs.forEach(reg => {
                        reg.unregister().then(() => console.log('🗑️ 긴급 제거 완료'));
                    });
                }
            });
        } catch (e) {
            console.log('✅ navigator.serviceWorker가 이미 무력화되었습니다');
        }
    }
    
    // 모든 캐시 삭제
    if ('caches' in window) {
        caches.keys().then(names => {
            names.forEach(name => {
                caches.delete(name).then(() => console.log('🗑️ 캐시 삭제:', name));
            });
        });
    }
    
    // 페이지 새로고침
    setTimeout(() => {
        console.log('🔄 페이지 새로고침');
        window.location.reload();
    }, 2000);
};