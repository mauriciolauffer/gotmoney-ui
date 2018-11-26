sap.ui.require([
  'com/mlauffer/gotmoneyappui5/controller/App.controller',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(App) {
  'use strict';

  let stub;
  const oApp = new App();

  QUnit.module('App', {});
});
