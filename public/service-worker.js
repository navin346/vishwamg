// A unique name for the cache
const CACHE_NAME = 'react-pwa-starter-v1';

// List of assets to cache on installation
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event: fires when the browser installs the service worker.
self.addEventListener('install', (event) => {
  // We waitUntil the installation is complete.
  event.waitUntil(
    // Open the cache.
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Add all the specified assets to the cache.
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event: fires when the service worker is activated.
// This is a good place to clean up old caches.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // If the cache name is different from our current cache, delete it.
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});


// Fetch event: fires for every network request made by the page.
self.addEventListener('fetch', (event) => {
  // We only want to handle GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  // We use a "cache-first" strategy.
  // This strategy is ideal for static assets that don't change often.
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // If the request is in the cache, return the cached response.
        if (response) {
          return response;
        }

        // If the request is not in the cache, fetch it from the network.
        // This will also cache files from any folder, including a 'mock-data' folder,
        // as they are requested.
        return fetch(event.request).then(
          (networkResponse) => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response because it's a stream and can only be consumed once.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // Put the fetched response into the cache.
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      })
      .catch((error) => {
        console.error('Fetching failed:', error);
        // You could return a custom offline page here if you have one cached.
        // For example: return caches.match('/offline.html');
      })
  );
});