sap.ui.require([
  'jquery.sap.global',
  'com/mlauffer/gotmoneyappui5/controller/App.controller',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(jQuery, App) {
  'use strict';

  var stub;
  var oApp = new App();

  QUnit.module('App', {});
});
