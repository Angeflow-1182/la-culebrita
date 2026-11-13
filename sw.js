const V='culebrita-v5',F=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./config.js','./family.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin&&u.hostname!=='cdn.jsdelivr.net')return;
 if(r.mode==='navigate'||r.url.endsWith('/index.html')){e.respondWith(fetch(r,{cache:'no-cache'}).then(x=>{const c=x.clone();caches.open(V).then(k=>k.put(r,c));return x}).catch(()=>caches.match(r).then(x=>x||caches.match('./index.html'))));return}
 e.respondWith(caches.match(r).then(x=>{const n=fetch(r).then(y=>{if(y.ok){const c=y.clone();caches.open(V).then(k=>k.put(r,c))}return y}).catch(()=>x);return x||n}))});
