'use strict';

const cacheName = 'GotMoneyApp-PWA-v13';
const filesToCache = [
  '/',
  '/index.html',
  '/index-ws.html',
  '/manifest.json',
  '/webapp/Component.js',
  '/webapp/Component-preload.js',
  '/webapp/manifest.json',
  '/webapp/manifest.json?sap-language=EN',
  '/webapp/css/gotmoneyapp.min.css',
  '/webapp/i18n/i18n.properties',
  '/webapp/i18n/i18n_en.properties',
  '/webapp/i18n/i18n_pt.properties',
  '/webapp/images/favicon.ico',
  '/webapp/images/pig-32x32.png',
  '/webapp/images/pig-48x48.png',
  '/webapp/images/pig-72x72.png',
  '/webapp/images/pig-144x144.png',
  '/webapp/images/pig-192x192.png',
  '/webapp/images/pig-256x256.png',
  '/webapp/images/pig-512x512.png',
  '/webapp/images/facebook.png',
  '/webapp/images/google.png',
  '/webapp/js/gotmoneyapp.min.js',
  '/webapp/js/lockr.js',


  /*'/webapp/js/resources/sap-ui-core.js',
  '/webapp/js/resources/sap-ui-version.json',
  '/webapp/js/resources/sap/ui/core/library-preload.js',
  '/webapp/js/resources/sap/ui/core/messagebundle.properties',
  '/webapp/js/resources/sap/ui/core/messagebundle_en.properties',
  '/webapp/js/resources/sap/ui/core/messagebundle_en_US.properties',
  '/webapp/js/resources/sap/ui/core/themes/sap_belize/library.css',
  '/webapp/js/resources/sap/ui/core/themes/base/fonts/SAP-icons.woff2',
  '/webapp/js/resources/sap/m/library-preload.js',
  '/webapp/js/resources/sap/m/messagebundle.properties',
  '/webapp/js/resources/sap/m/messagebundle_en.properties',
  '/webapp/js/resources/sap/m/messagebundle_en_US.properties',
  '/webapp/js/resources/sap/m/themes/sap_belize/library.css',
  '/webapp/js/resources/sap/ui/layout/library-preload.js',
  '/webapp/js/resources/sap/ui/layout/messagebundle.properties',
  '/webapp/js/resources/sap/ui/layout/messagebundle_en.properties',
  '/webapp/js/resources/sap/ui/layout/messagebundle_en_US.properties',
  '/webapp/js/resources/sap/ui/layout/themes/sap_belize/library-parameters.json',
  '/webapp/js/resources/sap/ui/layout/themes/sap_belize/library.css',
  '/webapp/js/resources/sap/ui/unified/library-preload.js',
  '/webapp/js/resources/sap/ui/unified/messagebundle.properties',
  '/webapp/js/resources/sap/ui/unified/messagebundle_en.properties',
  '/webapp/js/resources/sap/ui/unified/messagebundle_en_US.properties',
  '/webapp/js/resources/sap/ui/unified/themes/sap_belize/library-parameters.json',
  '/webapp/js/resources/sap/ui/unified/themes/sap_belize/library.css',
  '/webapp/js/resources/sap/tnt/library-preload.js',
  '/webapp/js/resources/sap/tnt/themes/sap_belize/library.css',*/


  'https://openui5.hana.ondemand.com/1.52.3/resources/sap-ui-core.js',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap-ui-version.json',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/ui/core/library-preload.js',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/ui/core/messagebundle.properties',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/ui/core/messagebundle_en.properties',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/ui/core/messagebundle_en_US.properties',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/ui/core/themes/sap_belize/library.css',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/ui/core/themes/base/fonts/SAP-icons.woff2',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/m/library-preload.js',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/m/messagebundle.properties',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/m/messagebundle_en.properties',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/m/messagebundle_en_US.properties',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/m/themes/sap_belize/library.css',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/ui/layout/library-preload.js',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/ui/layout/messagebundle.properties',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/ui/layout/messagebundle_en.properties',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/ui/layout/messagebundle_en_US.properties',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/ui/layout/themes/sap_belize/library-parameters.json',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/ui/layout/themes/sap_belize/library.css',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/ui/unified/library-preload.js',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/ui/unified/messagebundle.properties',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/ui/unified/messagebundle_en.properties',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/ui/unified/messagebundle_en_US.properties',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/ui/unified/themes/sap_belize/library-parameters.json',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/ui/unified/themes/sap_belize/library.css',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/tnt/library-preload.js',
  'https://openui5.hana.ondemand.com/1.52.3/resources/sap/tnt/themes/sap_belize/library.css'
];

self.addEventListener('install', function(evt) {
  'use strict';
  evt.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        return cache.addAll(filesToCache);
      })
      .catch(function(e) { console.error(e); })
  );
});

self.addEventListener('activate', function(evt) {
  'use strict';
  evt.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        }));
      })
      .catch(function(e) { console.error(e); })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(evt) {
  evt.respondWith(
    caches.match(evt.request)
      .then(function(resp) {
        return resp || fetch(evt.request).then(function(response) {
          caches.open(cacheName).then(function(cache) {
            console.error(evt.request.url);
            cache.put(evt.request, response);
          });
          return response.clone();
        });
      })
      .catch(function(e) {
        console.error(evt.request);
        console.error(e);
      //return caches.match('/sw-test/gallery/myLittleVader.jpg');
      })
  );
});

self.addEventListener('fetch', function(evt) {
  'use strict';
  evt.respondWith(
    caches.match(evt.request)
      .then(function(response) {
        return response || fetch(evt.request);
      })
      .catch(function(e) {
        console.error(evt.request);
        console.error(e);
      })
  );
});
