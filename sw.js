const CACHE_NAME = 'guepar-robo-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './guepar.jpeg',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/@phosphor-icons/web',
  'https://cdn.jsdelivr.net/npm/chart.js'
];
// Pedidos que nunca passam pelo cache (nuvem, Wikipédia da IA, etc.)
const BYPASS = ['firebaseio.com', 'firebasedatabase.app', 'supabase.co', 'wikipedia.org'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((c) => Promise.allSettled(ASSETS.map((a) => c.add(a))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const guardar = (req, res) => {
  if (res && (res.ok || res.type === 'opaque')) { const copia = res.clone(); caches.open(CACHE_NAME).then((c) => c.put(req, copia)); }
  return res;
};

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || BYPASS.some((d) => req.url.includes(d))) return;

  // Página: rede primeiro (versão nova), cache se offline
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => guardar(req, res))
        .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  // Demais arquivos: devolve o cache na hora e atualiza em segundo plano
  e.respondWith(
    caches.match(req).then((cache) => {
      const rede = fetch(req).then((res) => guardar(req, res)).catch(() => cache);
      return cache || rede;
    })
  );
});
