const CACHE='constructor-v1';
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(cache){
    return cache.addAll(['/']);
  }));
});
self.addEventListener('fetch',function(e){
  e.respondWith(
    caches.match(e.request).then(function(resp){
      return resp||fetch(e.request).then(function(response){
        return caches.open(CACHE).then(function(cache){
          cache.put(e.request,response.clone());
          return response;
        });
      });
    }).catch(function(){
      return new Response('Offline - App data saved locally');
    })
  );
});
