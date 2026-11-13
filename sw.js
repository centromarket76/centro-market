/* PROJECT: CENTRO MARKET | FILE: admin/sw.js | VERSION: 1.0.0 | LAST UPDATED: 2026-11-10 | PURPOSE: Admin PWA service worker - caches the app shell only; API calls are never cached or queued | CHANGELOG: 1.0.0 Initial version (Batch 2) */
const C = 'cm-admin-v1', F = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(C).then(c => c.addAll(F)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;   // never touch the Apps Script API
  e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); return res; })
    .catch(() => caches.match(r).then(m => m || caches.match('index.html'))));
});
