// 🛡️ SUPER SERVICE WORKER BLOCKER - 100% 완벽 차단
// 이 스크립트는 어떤 방법으로든 Service Worker 등록을 완전히 차단합니다

(function() {
    'use strict';
    
    console.log('🛡️ SUPER SERVICE WORKER BLOCKER 활성화');
    
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
                console.warn('🚫 navigator.serviceWorker 접근이 차단됨');
                return undefined;
            },
            set: function() {
                console.warn('🚫 navigator.serviceWorker 설정 시도가 차단됨');
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
        'sw'
    ];
    
    blockedGlobals.forEach(globalName => {
        Object.defineProperty(window, globalName, {
            get: function() {
                console.error(`🚫 ${globalName} 접근 차단됨 - SUPER BLOCKER`);
                return undefined;
            },
            set: function(value) {
                console.error(`🚫 ${globalName} 설정 차단됨 - SUPER BLOCKER`);
                // 설정 무시
            },
            configurable: false,
            enumerable: false
        });
    });
    
    // === 5. DOM API 감시 및 차단 ===
    // createElement 감시
    const originalCreateElement = document.createElement;
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
                        console.error('🚫 차단된 스크립트:', value);
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
    window.fetch = function(url, options) {
        if (typeof url === 'string') {
            const blocked = ['workbox', 'sw.js', 'service-worker', 'precache', 'manifest.json'];
            if (blocked.some(term => url.toLowerCase().includes(term))) {
                console.error('🚫 차단된 네트워크 요청:', url);
                return Promise.reject(new Error('SUPER BLOCKER: 요청이 차단됨'));
            }
        }
        return originalFetch.call(this, url, options);
    };
    
    // === 7. 이벤트 리스너 감시 ===
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'install' || type === 'activate' || type === 'fetch') {
            console.error(`🚫 Service Worker 이벤트 리스너 차단됨: ${type}`);
            return;
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
    
    // === 8. 주기적 감시 및 정리 ===
    setInterval(() => {
        // Service Worker 재등록 감지 (안전 검사 포함)
        if ('serviceWorker' in navigator && navigator.serviceWorker && typeof navigator.serviceWorker.getRegistrations === 'function') {
            try {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                    if (registrations && registrations.length > 0) {
                        console.error('🚨 Service Worker 재등록 감지! 즉시 제거');
                        registrations.forEach(reg => reg.unregister());
                    }
                }).catch(() => {});
            } catch (e) {
                // navigator.serviceWorker가 이미 무력화되었으므로 정상적인 상황
            }
        }
        
        // workbox 전역 변수 재등장 감지
        if (window.workbox) {
            console.error('🚨 workbox 재등장 감지! 즉시 삭제');
            delete window.workbox;
        }
        
        // 캐시 재생성 감지
        if ('caches' in window) {
            caches.keys().then(cacheNames => {
                const workboxCaches = cacheNames.filter(name => 
                    name.includes('workbox') || name.includes('precache')
                );
                if (workboxCaches.length > 0) {
                    console.error('🚨 workbox 캐시 재생성 감지! 즉시 삭제');
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
        
        console.log('🛡️ SUPER SERVICE WORKER BLOCKER 100% 활성화 완료');
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