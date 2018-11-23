sap.ui.require([
  'com/mlauffer/gotmoneyappui5/controller/Home.controller',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(Home) {
  'use strict';

  var stub;
  var oHome = new Home();

  QUnit.module('Home', {});
});
