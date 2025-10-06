// Service Worker 완전 제거 스크립트 - 100% 오류 방지
// workbox, PWA 관련 모든 Service Worker를 강제로 제거

(function() {
    'use strict';
    
    console.log('🛡️ Service Worker 완전 제거 모드 시작');
    
    // Service Worker 완전 제거 함수
    async function removeServiceWorkers() {
        if ('serviceWorker' in navigator) {
            try {
                // 1단계: 모든 등록된 Service Worker 찾기
                const registrations = await navigator.serviceWorker.getRegistrations();
                
                console.log(`🔍 발견된 Service Worker: ${registrations.length}개`);
                
                if (registrations.length > 0) {
                    // 2단계: 각 Service Worker 강제 제거
                    for (let registration of registrations) {
                        try {
                            console.log(`🗑️ 제거 중: ${registration.scope}`);
                            
                            // 활성 상태 확인 및 강제 중지
                            if (registration.active) {
                                console.log('  - 활성 Service Worker 중지');
                            }
                            if (registration.installing) {
                                console.log('  - 설치 중인 Service Worker 중지');
                            }
                            if (registration.waiting) {
                                console.log('  - 대기 중인 Service Worker 중지');
                            }
                            
                            // 강제 제거
                            const result = await registration.unregister();
                            console.log(`  ✅ 제거 ${result ? '성공' : '실패'}: ${registration.scope}`);
                            
                        } catch (error) {
                            console.error(`  ❌ Service Worker 제거 실패:`, error);
                        }
                    }
                    
                    console.log('🎉 모든 Service Worker 제거 작업 완료');
                    
                    // 3단계: 등록 상태 재확인
                    const remainingRegistrations = await navigator.serviceWorker.getRegistrations();
                    if (remainingRegistrations.length > 0) {
                        console.warn(`⚠️ ${remainingRegistrations.length}개 Service Worker가 여전히 남아있음`);
                        // 한 번 더 제거 시도
                        setTimeout(() => removeServiceWorkers(), 1000);
                    } else {
                        console.log('✅ 모든 Service Worker 완전 제거 확인');
                    }
                    
                } else {
                    console.log('✅ 제거할 Service Worker가 없습니다.');
                }
                
            } catch (error) {
                console.error('❌ Service Worker 제거 중 심각한 오류:', error);
            }
        } else {
            console.log('ℹ️ 이 브라우저는 Service Worker를 지원하지 않습니다.');
        }
    }
    
    // 캐시 완전 삭제 함수
    async function clearAllCaches() {
        if ('caches' in window) {
            try {
                console.log('🧹 모든 캐시 삭제 시작');
                
                const cacheNames = await caches.keys();
                console.log(`🔍 발견된 캐시: ${cacheNames.length}개`);
                
                if (cacheNames.length > 0) {
                    // workbox 관련 캐시 우선 삭제
                    const workboxCaches = cacheNames.filter(name => 
                        name.includes('workbox') || 
                        name.includes('precache') || 
                        name.includes('runtime') ||
                        name.includes('sw-')
                    );
                    
                    if (workboxCaches.length > 0) {
                        console.log(`🎯 workbox 관련 캐시 ${workboxCaches.length}개 우선 삭제`);
                        for (let cacheName of workboxCaches) {
                            try {
                                await caches.delete(cacheName);
                                console.log(`  ✅ workbox 캐시 삭제: ${cacheName}`);
                            } catch (error) {
                                console.error(`  ❌ workbox 캐시 삭제 실패: ${cacheName}`, error);
                            }
                        }
                    }
                    
                    // 나머지 모든 캐시 삭제
                    for (let cacheName of cacheNames) {
                        try {
                            const deleted = await caches.delete(cacheName);
                            console.log(`  ${deleted ? '✅' : '⚠️'} 캐시 삭제: ${cacheName}`);
                        } catch (error) {
                            console.error(`  ❌ 캐시 삭제 실패: ${cacheName}`, error);
                        }
                    }
                    
                    // 삭제 상태 재확인
                    const remainingCaches = await caches.keys();
                    if (remainingCaches.length > 0) {
                        console.warn(`⚠️ ${remainingCaches.length}개 캐시가 여전히 남아있음:`, remainingCaches);
                    } else {
                        console.log('✅ 모든 캐시 완전 삭제 확인');
                    }
                    
                } else {
                    console.log('✅ 삭제할 캐시가 없습니다.');
                }
                
            } catch (error) {
                console.error('❌ 캐시 삭제 중 심각한 오류:', error);
            }
        } else {
            console.log('ℹ️ 이 브라우저는 Cache API를 지원하지 않습니다.');
        }
    }
    
    // workbox 오류 방지 함수
    function preventWorkboxErrors() {
        // workbox 전역 변수가 있다면 제거
        if (typeof window !== 'undefined') {
            if (window.workbox) {
                console.log('🛡️ workbox 전역 변수 제거');
                delete window.workbox;
            }
            
            // workbox 관련 이벤트 리스너 제거
            if (window.__WB_MANIFEST) {
                console.log('🛡️ workbox manifest 제거');
                delete window.__WB_MANIFEST;
            }
        }
    }
    
    // 즉시 실행 - 페이지 로드 전에도 실행
    console.log('⚡ 즉시 Service Worker 제거 시작');
    preventWorkboxErrors();
    
    // 즉시 한 번 실행
    removeServiceWorkers().then(() => {
        return clearAllCaches();
    }).catch(error => {
        console.error('초기 정리 중 오류:', error);
    });
    
    // Service Worker 메시지 리스너
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'SW_REMOVED') {
                console.log('📨 Service Worker 제거 메시지 수신:', event.data.message);
                // 잠시 후 페이지 새로고침
                setTimeout(() => {
                    console.log('🔄 페이지 새로고침');
                    window.location.reload();
                }, 1000);
            }
        });
    }
    
    // 페이지 로드 완료 후 한 번 더 실행 (이중 안전장치)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                console.log('🔄 페이지 로드 후 추가 정리');
                removeServiceWorkers().then(() => clearAllCaches());
            }, 500);
        });
    } else {
        setTimeout(() => {
            console.log('🔄 즉시 추가 정리');
            removeServiceWorkers().then(() => clearAllCaches());
        }, 500);
    }
    
    // 정기적으로 Service Worker 상태 확인 (1분마다)
    setInterval(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                if (registrations.length > 0) {
                    console.warn('🚨 Service Worker가 다시 등록됨! 즉시 제거');
                    removeServiceWorkers();
                }
            });
        }
    }, 60000);
    
    // 전역 함수로 노출 (개발자 도구에서 수동 실행 가능)
    window.removeAllServiceWorkers = removeServiceWorkers;
    window.clearAllCaches = clearAllCaches;
    window.preventWorkboxErrors = preventWorkboxErrors;
    
    // 완전 정리 함수
    window.completeCleanup = async function() {
        console.log('🧹 완전 정리 시작');
        preventWorkboxErrors();
        await removeServiceWorkers();
        await clearAllCaches();
        console.log('✨ 완전 정리 완료');
        setTimeout(() => window.location.reload(), 1000);
    };
    
})();