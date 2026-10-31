/* Riki Arcade: offline shell for previously loaded, same-origin game resources.
   Does not claim full offline support for external libraries, audio or 3D content. */
const CACHE='riki-arcade-shell-v1';
const SHELL=['./','./index.html','./manifest.webmanifest','./assets/icons/arcade-icon.svg'];
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await Promise.allSettled(SHELL.map(url=>cache.add(url)));
  try{
   const html=await (await fetch('./index.html',{cache:'no-store'})).text();
   const matches=[...html.matchAll(/(?:src|href)="(assets\/(?:scripts|styles)\/[^"]+)"/g)];
   await Promise.allSettled(matches.map(m=>cache.add(m[1])));
  }catch(e){/* A failed optional prefetch must not prevent installation. */}
  await self.skipWaiting();
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  await Promise.all((await caches.keys()).filter(k=>k.startsWith('riki-arcade-shell-')&&k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin)return;
 if(req.mode==='navigate'){
  event.respondWith(fetch(req).then(async response=>{
   if(response.ok){(await caches.open(CACHE)).put('./index.html',response.clone());}
   return response;
  }).catch(async()=> (await caches.match(req)) || (await caches.match('./index.html')) || Response.error()));
  return;
 }
 const path=url.pathname;
 if(!/\.(?:js|css|html|webmanifest|svg|png|jpg|jpeg|webp)$/i.test(path))return;
 event.respondWith(caches.match(req).then(async cached=>{
  if(cached)return cached;
  const res=await fetch(req);
  if(res.ok && res.type==='basic' && !/\.(?:png|jpg|jpeg|webp)$/i.test(path)){
   (await caches.open(CACHE)).put(req,res.clone());
  }
  return res;
 }));
});
