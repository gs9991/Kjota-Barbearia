// KJota Barbearia — service worker (app instalável + abre rápido)
const CACHE = 'kjota-v2.3';
const SHELL = ['./', './index.html', './manifest.webmanifest', './img/logo.webp', './img/icon-192.png', './img/icon-512.png'];
const CDN = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net', 'www.gstatic.com'];

self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(SHELL.map(u => c.add(u)))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Página: sempre tenta a versão nova; sem internet, usa a guardada
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(k => k.put('./index.html', c)); return r; }).catch(() => caches.match('./index.html')));
    return;
  }
  // Imagens do app: cache primeiro
  if (url.origin === location.origin) {
    e.respondWith(caches.match(req).then(h => h || fetch(req).then(r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(k => k.put(req, c)); } return r; })));
    return;
  }
  // Fontes, ícones e bibliotecas (versões fixas): usa o guardado e atualiza por trás
  if (CDN.includes(url.hostname) && !url.pathname.includes('/v0/b/')) {
    e.respondWith(caches.match(req).then(h => {
      const rede = fetch(req).then(r => { if (r.ok || r.type === 'opaque') { const c = r.clone(); caches.open(CACHE).then(k => k.put(req, c)); } return r; }).catch(() => h);
      return h || rede;
    }));
  }
  // Firestore, Auth e Storage passam direto (tempo real)
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const chatId = e.notification.data && e.notification.data.chatId;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    const c = cs[0];
    if (c) { c.focus(); if (chatId) c.postMessage({ abrirChat: chatId }); return; }
    return self.clients.openWindow('./');
  }));
});
