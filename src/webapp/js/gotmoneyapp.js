'use strict';

window.GOTMONEY = {
  FACEBOOK_APP_ID: (location.hostname === 'localhost') ? '542787052549338' : '182002078627839',
  BACKEND_API_HOSTNAME: (location.hostname === 'localhost') ? 'http://localhost:3000' : 'https://gotmoneyapp.herokuapp.com'
};

//GOOGLE
const Google = {auth2: null}; // The Sign-In object.
function onLoadGoogleClient() {
  gapi.load('auth2', function() {
    Google.auth2 = gapi.auth2.init();
  });
}

//GOOGLE ANALYTICS
window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'UA-11465363-7');

//Facebook SDK
window.fbAsyncInit = function() {
  FB.init({
    appId: window.GOTMONEY.FACEBOOK_APP_ID,
    xfbml: true,
    version: 'v3.1'
  });
};
