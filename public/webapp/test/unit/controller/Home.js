sap.ui.require([
  'jquery.sap.global',
  'com/mlauffer/gotmoneyappui5/controller/Home.controller',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(jQuery, Home) {
  'use strict';

  var stub;
  var oHome = new Home();

  QUnit.module('Home', {});
});
