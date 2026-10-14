// アプリ風ページ用。画面の枠だけ保存し、データは常に最新を取りに行く（取れないときだけ保存分）
const C='kuroko-app-v1';
const SHELL=['./app.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  const p=u.pathname;
  if(!(p.endsWith('/app.html')||p.endsWith('/index_data.json')||p.endsWith('/manifest.json')||/icon-.*\.png$/.test(p)))return;
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r;})
    .catch(()=>caches.match(e.request)));
});
