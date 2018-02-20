sap.ui.require([
  'jquery.sap.global',
  'com/mlauffer/gotmoneyappui5/controller/Index.controller',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(jQuery, Index) {
  'use strict';

  var stub;
  var oIndex = new Index();

  QUnit.module('Index', {});
});
