sap.ui.define([
  'sap/ui/test/Opa5'
], function(Opa5) {
  'use strict';

  var Common = Opa5.extend('com.mlauffer.gotmoneyappui5.test.arrangements.Common', {
    iStartMyApp: function() {
      return this.iStartMyAppInAFrame('../mockServer.html');
    }
  });

  return Common;
});
