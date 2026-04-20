self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'Have you logged today? Tap to open your daily log.',
    icon: '/gigsanity/icon.png',
    badge: '/gigsanity/icon.png',
    vibrate: [200, 100, 200],
    data: { url: '/gigsanity/' },
    actions: [
      { action: 'log', title: 'Log Now' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };
  event.waitUntil(
    self.registration.showNotification('Gig Sanity', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'log' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(function(clientList) {
        for (let client of clientList) {
          if (client.url.includes('gigsanity') && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/gigsanity/');
        }
      })
    );
  }
});

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim());
});
