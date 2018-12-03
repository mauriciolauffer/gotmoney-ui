'use strict';

if (window.navigator && window.navigator.serviceWorker) {
  window.navigator.serviceWorker.register('./sw.js')
    .then(function() { console.log('SW registered'); })
    .catch(function() { console.error('SW not registered'); });
}
