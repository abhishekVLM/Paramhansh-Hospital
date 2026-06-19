const CACHE_NAME = 'pin-cache-v1';
const urlsToCache = [
  '/',
  '/logo192.png',
  '/Image/hospital-1.png',
  '/Image/team/dr-sanjay-kumar.jpg',
  '/Image/team/ajay.png',
  '/Image/team/anshu.png',
  '/Image/team/Deepak.png',
  '/Image/team/manish.png',
  '/Image/team/monika.png',
  '/Image/team/Rashmi.png',
  '/Image/team/tiwari.png',
  '/Image/hospital-1.png',
  '/Image/tests/polysomnography.png',
  '/Image/tests/urodynamics.png',
  '/Image/tests/msk-usg.png',
  '/Image/tests/echo.png',
  '/Image/tests/usg.png',
  '/Image/tests/ct-scan.png',
  '/Image/tests/ncs.png',
  '/Image/tests/eeg.png',
  '/Image/tests/holter.png',
  '/Image/tests/vertigo.png',
  '/Image/tests/autonomic.png',
  '/Image/tests/lab.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request).then(function(fetchResponse) {
        if (fetchResponse && fetchResponse.status === 200) {
          var responseClone = fetchResponse.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseClone);
          });
        }
        return fetchResponse;
      });
    })
  );
});
