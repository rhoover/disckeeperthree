let timestamp = Date.now();
let cacheName = 'dkCache-' + timestamp;

//get the array of urls
async function getServiceWorkerData() {
  const url = 'disckeeper-service-worker-data.json';
  const response = await fetch(url, {cache: 'no-store'});
  const files = await response.json();
  return files;
};

self.addEventListener('install', event => {

});

self.addEventListener('activate', event => {

  // Delete all old caches.
  const removeOldCaches = async () => {
    caches.keys()
      .then(function(keys) {
        for ( let key of keys) {
          if (key != cacheName) {
            caches.delete(key);
          };
        };
      });
    };
    event.waitUntil(removeOldCaches());


  // on with the show
  const seedCache = async () => {
    getServiceWorkerData()
      .then(files => {
        caches.open(cacheName)
        .then(cache => {
          return cache.addAll(files);
        });
      });
  };

  event.waitUntil(seedCache());
  
  // let her take over
  event.waitUntil(clients.claim());

});

self.addEventListener('fetch', event => {
  const {request} = event;
  const url = new URL(request.url);

  // Only handle GET requests.
  if (request.method !== 'GET') return;

  // Don't handle BrowserSync requests.
  if (url.pathname.startsWith('/browser-sync/')) return;

  // Don't handle non-http requires such as data: URIs.
  if (!url.protocol.startsWith('http')) return;

  // blacklist to keep cache clean
  if (url.pathname.startsWith('/bphoto/')) return; // yelp images, remaining are all google maps stuff
  if (url.origin === 'https://fonts.gstatic.com') return;
  if (url.origin === 'https://fonts.googleapis.com') return;
  if (url.origin === 'https://maps.googleapis.com') return;
  if (url.origin === 'https://maps.gstatic.com') return;
  if (url.origin === 'https://maps.google.com') return;
  if (url.pathname.startsWith('/mapfiles/')) return;

  async function getResponsePromise() {
    const cache = await caches.open(cacheName);

    // Try to find response in the cache.
    let response = await cache.match(request);

    if (!response) {
      if (request.cache === 'only-if-cached') return;

      // Try to fetch response from the network.
      // We will get a 404 error if not found.
      response = await fetch(request, {cache: 'no-store'});
      console.info('disckeeper got', url.pathname, 'from network');

      // Cache the response.
      cache.put(request, response.clone());
    } else {
      console.info('disckeeper got', url.pathname, 'from', cacheName);
    }

    return response;
  }

  event.respondWith(getResponsePromise());

});