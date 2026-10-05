const CACHE_NAME = 'guepar-robo-v2';
const ASSETS = [
  './',
  './index.html',
  './guepar.jpeg',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/@phosphor-icons/web',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

self.addEventListener('install', (e) => {
  // allSettled: se algum arquivo faltar (ex.: imagem), o resto ainda é guardado e o SW instala
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.allSettled(ASSETS.map((a) => cache.add(a))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = req.url;
  // Nuvem (Firebase/Supabase) e qualquer pedido que não seja GET: nunca passa pelo cache
  if (req.method !== 'GET' || url.includes('firebaseio.com') || url.includes('firebasedatabase.app') || url.includes('supabase.co')) return;

  // Página: rede primeiro (pega sempre a versão nova), cache se estiver offline
  if (req.mode === 'navigate' || url.endsWith('/index.html')) {
    e.respondWith(
      fetch(req).then((res) => { const copia = res.clone(); caches.open(CACHE_NAME).then((c) => c.put(req, copia)); return res; })
        .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  // Demais arquivos: cache primeiro
  e.respondWith(
    caches.match(req).then((res) => res || fetch(req).then((fRes) => {
      const copia = fRes.clone();
      caches.open(CACHE_NAME).then((c) => c.put(req, copia));
      return fRes;
    })).catch(() => caches.match('./index.html'))
  );
});
