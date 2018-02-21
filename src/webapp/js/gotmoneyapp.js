'use strict';

//GOOGLE
var Google = {auth2: null}; // The Sign-In object.
function onLoadGoogleClient() {
  'use strict';
  gapi.load('auth2', function() {
    Google.auth2 = gapi.auth2.init();
  });
}

//GOOGLE ANALYTICS
window.dataLayer = window.dataLayer || [];
function gtag() {
  'use strict';
  window.dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'UA-11465363-7');

//Facebook SDK
window.fbAsyncInit = function() {
  'use strict';
  var appId = (/gotmoneyapp.com/.test(location.hostname)) ? '182002078627839' : '542787052549338';
  FB.init({
    appId: appId,
    xfbml: true,
    version: 'v2.11'
  });
};
