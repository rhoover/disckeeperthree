let timestamp=Date.now();let cacheName="dkCache-"+timestamp;async function getServiceWorkerData(){const url="disckeeper-service-worker-data.json";const response=await fetch(url,{cache:"no-store"});const files=await response.json();return files}self.addEventListener("install",(event=>{}));self.addEventListener("activate",(event=>{const removeOldCaches=async()=>{caches.keys().then((function(keys){for(let key of keys){if(key!=cacheName){caches.delete(key)}}}))};event.waitUntil(removeOldCaches());const seedCache=async()=>{getServiceWorkerData().then((files=>{console.log(files);caches.open(cacheName).then((cache=>cache.addAll(files)))}))};event.waitUntil(seedCache());event.waitUntil(clients.claim())}));self.addEventListener("fetch",(event=>{const{request:request}=event;const url=new URL(request.url);if(request.method!=="GET")return;if(url.pathname.startsWith("/browser-sync/"))return;if(!url.protocol.startsWith("http"))return;if(url.pathname.startsWith("/bphoto/"))return;if(url.origin==="https://fonts.gstatic.com")return;if(url.origin==="https://fonts.googleapis.com")return;if(url.origin==="https://maps.googleapis.com")return;if(url.origin==="https://maps.gstatic.com")return;if(url.origin==="https://maps.google.com")return;if(url.pathname.startsWith("/mapfiles/"))return;async function getResponsePromise(){const cache=await caches.open(cacheName);let response=await cache.match(request);if(!response){if(request.cache==="only-if-cached")return;response=await fetch(request,{cache:"no-store"});console.info("disckeeper got",url.pathname,"from network");cache.put(request,response.clone())}else{console.info("disckeeper got",url.pathname,"from",cacheName)}return response}event.respondWith(getResponsePromise())}));