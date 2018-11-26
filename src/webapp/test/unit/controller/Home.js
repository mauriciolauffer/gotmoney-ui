sap.ui.require([
  'com/mlauffer/gotmoneyappui5/controller/Home.controller',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(Home) {
  'use strict';

  let stub;
  const oHome = new Home();

  QUnit.module('Home', {});
});
