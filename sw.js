// 🛡️ SUPER SERVICE WORKER DESTROYER
// 이 파일은 어떤 Service Worker도 활성화되지 않도록 완전히 차단합니다

console.error('🚫 SERVICE WORKER 접근 차단됨 - SUPER DESTROYER 활성화');

// 즉시 자신을 제거
self.addEventListener('install', function(event) {
  console.error('🗑️ Service Worker 설치 시도 차단 - 즉시 제거');
  event.waitUntil(
    // 모든 캐시 강제 삭제
    caches.keys().then(function(cacheNames) {
      console.error('🧹 발견된 캐시 강제 삭제:', cacheNames);
      return Promise.all(
        cacheNames.map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    }).then(function() {
      // 자신을 즉시 제거
      return self.registration.unregister();
    }).then(function() {
      console.error('✅ SUPER DESTROYER: 자동 제거 완료');
      // 모든 클라이언트에게 알림
      return self.clients.matchAll();
    }).then(function(clients) {
      clients.forEach(function(client) {
        client.postMessage({
          type: 'SW_DESTROYED',
          message: 'SUPER DESTROYER: Service Worker가 완전히 파괴되었습니다.'
        });
      });
      // 스스로 종료
      self.close();
    })
  );
  
  // 즉시 제거
  self.skipWaiting();
});

// activate 이벤트도 차단
self.addEventListener('activate', function(event) {
  console.error('🚫 Service Worker activate 차단됨');
  event.waitUntil(
    self.registration.unregister().then(() => {
      console.error('🗑️ activate 단계에서 강제 제거 완료');
      self.close();
    })
  );
});

// fetch 이벤트 완전 차단 - 어떤 요청도 가로채지 않음
self.addEventListener('fetch', function(event) {
  console.error('🚫 Service Worker fetch 이벤트 차단됨:', event.request.url);
  // 아무것도 하지 않음 - 브라우저가 직접 처리하도록 함
});

// message 이벤트도 차단
self.addEventListener('message', function(event) {
  console.error('🚫 Service Worker message 이벤트 차단됨');
  if (event.data && event.data.type === 'SKIP_WAITING') {
    // skipWaiting 요청도 무시
    console.error('🚫 skipWaiting 요청 무시됨');
  }
});

// 오류 발생시에도 제거
self.addEventListener('error', function(event) {
  console.error('💥 Service Worker 오류 발생 - 강제 제거:', event.error);
  self.registration.unregister();
  self.close();
});

// unhandledrejection도 처리
self.addEventListener('unhandledrejection', function(event) {
  console.error('💥 Service Worker unhandled rejection - 강제 제거:', event.reason);
  self.registration.unregister();
  self.close();
});

// 5초 후 자동 제거 (안전장치)
setTimeout(() => {
  console.error('⏰ SUPER DESTROYER: 5초 타이머 만료 - 강제 종료');
  self.registration.unregister().then(() => {
    self.close();
  });
}, 5000);

console.error('🛡️ SUPER SERVICE WORKER DESTROYER 활성화 완료');
console.error('🚫 이 Service Worker는 스스로를 파괴합니다');