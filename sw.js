const CACHE_NAME = 'fsh-mobile-v28';
const SHELL = ['./', './manifest.webmanifest', './icon-192.png', './apple-touch-icon.png'];
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(SHELL).catch(() => {})));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.pathname.startsWith('/api/') || u.hostname.includes('google.com')) return;
  e.respondWith(fetch(e.request).then((res) => {
    const copy = res.clone();
    caches.open(CACHE_NAME).then((c) => c.put(e.request, copy)).catch(() => {});
    return res;
  }).catch(() => caches.match(e.request)));
});
