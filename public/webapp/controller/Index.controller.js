sap.ui.define([
  'com/mlauffer/gotmoneyappui5/controller/BaseController'
], function(BaseController) {
  'use strict';

  return BaseController.extend('com.mlauffer.gotmoneyappui5.controller.Index', {
    onPrivacy: function() {
      this.vibrate();
      this.getRouter().navTo('privacy');
    },

    onTerms: function() {
      this.vibrate();
      this.getRouter().navTo('terms');
    },

    onAbout: function() {
      this.vibrate();
      this.getRouter().navTo('about');
    }
  });
});
