const CACHE = 'obsa-v1';
const ASSETS = [
  '/dashboard-obsa/',
  '/dashboard-obsa/index.html',
  '/dashboard-obsa/Dashboard_Ecommerce.html',
  '/dashboard-obsa/Reporte_Stock_Ventas.html',
  '/dashboard-obsa/manifest.json',
  '/dashboard-obsa/icons/icon-192.png',
  '/dashboard-obsa/icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

// Network first: intenta datos frescos, cae a cache si no hay red
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
