const CACHE = 'sharon-v2';
const urls = [
  '/',
  '/index.html',
  '/hub.html',
  '/writing.html',
  '/about.html',
  '/portfolio.html',
  '/style.css',
  '/main.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(urls)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(r => r || fetch(e.request))
      .catch(() => caches.match('/index.html'))
  );
});
