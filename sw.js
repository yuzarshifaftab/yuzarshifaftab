/* Menyimpan kerangka program agar bisa dibuka tanpa internet.
   Lagu dan video tidak lewat sini (disimpan terpisah di tablet). */
var V="belajar-seru-v1";
var FILES=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-maskable-512.png"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(V).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener("fetch",function(e){
  var r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||u.origin!==location.origin)return;
  if(r.mode==="navigate"){
    e.respondWith(fetch(r).then(function(res){var cp=res.clone();caches.open(V).then(function(c){c.put("./index.html",cp)});return res}).catch(function(){return caches.match("./index.html")}));
    return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(function(m){return m||fetch(r)}));
});
