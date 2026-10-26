// KJRSEVA Portal - Service Worker for Mobile Screen Notifications & Lock Screen Alerts
const CACHE_NAME = 'kjrseva-cache-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// Handle incoming push / background notification displays
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : './';
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if ('focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});

// Allow webpage to communicate with Service Worker
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const payload = event.data.payload || {};
        self.registration.showNotification(payload.title || 'KJR SEVA Notification', {
            body: payload.body || '',
            icon: payload.icon || 'logo.jpg',
            badge: payload.badge || 'logo.jpg',
            vibrate: payload.vibrate || [200, 100, 200, 100, 200],
            tag: payload.tag || ('kjr-' + Date.now()),
            renotify: true,
            data: payload.data || { url: './' }
        });
    }
});
