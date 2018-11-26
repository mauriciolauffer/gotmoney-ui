sap.ui.require([
  'com/mlauffer/gotmoneyappui5/controller/Index.controller',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(Index) {
  'use strict';

  let stub;
  const oIndex = new Index();

  QUnit.module('Index', {});
});
