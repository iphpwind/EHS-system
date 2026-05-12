/**
 * Service Worker for PWA Offline Support
 * 缓存静态资源和 API 响应，支持离线访问
 */

const CACHE_NAME = 'safety-h5-v1.0.0';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/index.css',
  '/assets/index.js'
];

// 安装事件：缓存静态资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: 缓存静态资源');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// 激活事件：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('SW: 删除旧缓存', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// 请求拦截：优先使用缓存，后台更新
self.addEventListener('fetch', event => {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // 返回缓存或网络请求
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            // 缓存成功的 GET 请求
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          })
          .catch(() => {
            // 网络失败，返回缓存（如果有）
            return cachedResponse;
          });

        return cachedResponse || fetchPromise;
      })
  );
});

// 后台同步（用于离线时提交数据）
self.addEventListener('sync', event => {
  if (event.tag === 'sync-pending-requests') {
    event.waitUntil(syncPendingRequests());
  }
});

// 推送通知
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : '新消息',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: { url: '/' }
  };

  event.waitUntil(
    self.registration.showNotification('安全生产平台', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// 辅助函数：同步待提交的请求
async function syncPendingRequests() {
  const db = await openDB();
  const pendingRequests = await db.getAll('pendingRequests');

  for (const request of pendingRequests) {
    try {
      await fetch(request.url, request.options);
      await db.delete('pendingRequests', request.id);
    } catch (error) {
      console.error('同步失败:', error);
    }
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SafetyH5DB', 1);
    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingRequests')) {
        db.createObjectStore('pendingRequests', { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
