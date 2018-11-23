sap.ui.require([
  'com/mlauffer/gotmoneyappui5/controller/CategoryList.controller',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(CategoryList) {
  'use strict';

  var stub;
  var oCategoryList = new CategoryList();

  QUnit.module('CategoryList', {});
});
