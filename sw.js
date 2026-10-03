const CACHE_NAME = 'guepar-robo-v1';
const ASSETS = [
  './',
  './index.html',
  './guepar.jpeg',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/@phosphor-icons/web',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('supabase.co')) return;
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request).then((fRes) => caches.open(CACHE_NAME).then((cache) => { cache.put(e.request, fRes.clone()); return fRes; }))).catch(() => caches.match('./index.html')));
});
