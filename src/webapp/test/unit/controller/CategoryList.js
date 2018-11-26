sap.ui.require([
  'com/mlauffer/gotmoneyappui5/controller/CategoryList.controller',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(CategoryList) {
  'use strict';

  let stub;
  const oCategoryList = new CategoryList();

  QUnit.module('CategoryList', {});
});
