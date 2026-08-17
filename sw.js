// Service Worker — App Só um Parabéns
// Estratégia "rede primeiro" (network-first): com internet baixa a versão nova;
// sem internet usa o cache. Atualiza sozinho ao detectar um sw.js novo.
// >>> Ao subir uma atualização, troque a data abaixo para forçar renovação. <<<
const CACHE = 'soumparabens-2026-08-16';

self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith((async () => {
    try {
      const fresh = await fetch(req);
      const cache = await caches.open(CACHE);
      cache.put(req, fresh.clone());
      return fresh;
    } catch (err) {
      const cached = await caches.match(req);
      if (cached) return cached;
      throw err;
    }
  })());
});
