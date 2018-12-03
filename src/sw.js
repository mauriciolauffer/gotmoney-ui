'use strict';

const appCacheName = 'GotMoneyApp-PWA-v000';
const ui5CDN = 'https://openui5.hana.ondemand.com/1.60.1/resources/';
const rxLocal = /^http:.*local.*\/api\//;
const rxServer = /^https:.*gotmoney.*\/api\//;
const localFilesToCache = [
  '/index.html',
  '/index-sw.html',
  '/manifest.json',
  '/sw-reg.js',
  '/webapp/Component-preload.js',
  '/webapp/manifest.json',
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
  '/webapp/images/pig-512x512.png',
  '/webapp/images/facebook.png',
  '/webapp/images/google.png',
  '/webapp/js/gotmoneyapp.min.js',
  '/webapp/js/lockr.min.js',
  '/webapp/js/openui5/validator/library-preload.js',
  '/webapp/js/openui5/model/json/crud/library-preload.js'
];
const ui5FilesToCache = [
  //ui5CDN + 'sap-ui-version.json',
  ui5CDN + 'sap-ui-core.js',
  ui5CDN + 'sap/ui/core/library-preload.js',
  ui5CDN + 'sap/ui/core/messagebundle.properties',
  ui5CDN + 'sap/ui/core/themes/sap_belize/library.css',
  ui5CDN + 'sap/ui/core/themes/sap_belize/fonts/72-Regular.woff2',
  ui5CDN + 'sap/ui/core/themes/sap_belize/fonts/72-Bold.woff2',
  ui5CDN + 'sap/ui/core/themes/base/fonts/SAP-icons.woff2',
  ui5CDN + 'sap/m/library-preload.js',
  ui5CDN + 'sap/m/messagebundle.properties',
  ui5CDN + 'sap/m/themes/sap_belize/library.css',
  ui5CDN + 'sap/ui/layout/library-preload.js',
  ui5CDN + 'sap/ui/layout/messagebundle.properties',
  ui5CDN + 'sap/ui/layout/themes/sap_belize/library.css',
  ui5CDN + 'sap/ui/unified/library-preload.js',
  ui5CDN + 'sap/ui/unified/messagebundle.properties',
  ui5CDN + 'sap/ui/unified/themes/sap_belize/library.css',
  ui5CDN + 'sap/tnt/library-preload.js',
  ui5CDN + 'sap/tnt/messagebundle.properties',
  ui5CDN + 'sap/tnt/themes/sap_belize/library.css'
  //ui5CDN + 'sap/tnt/themes/sap_belize/library-parameters.json',
];

self.addEventListener('install', function(evt) {
  console.log('SW installing...');
  evt.waitUntil(
    caches.open(appCacheName)
      .then(function(cache) {
        return Promise.all([cache.addAll(localFilesToCache), cache.addAll(ui5FilesToCache)]);
      })
      .catch(function(err) {
        console.error(err);
      })
  );
});

self.addEventListener('activate', function(evt) {
  console.log('SW activating...');
  evt.waitUntil(
    caches.keys()
      .then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName) {
            return cacheName !== appCacheName;
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
      .catch(function(err) {
        console.error(err);
      })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(evt) {
  const url = evt.request.url;
  if (!rxLocal.test(url) && !rxServer.test(url)) {
    evt.respondWith(
      caches.match(evt.request)
        .then(function(response) {
          return response || fetch(evt.request);
        })
        .catch(function(err) {
          console.error(evt.request.url);
          console.error(err);
        })
    );
  }
});

