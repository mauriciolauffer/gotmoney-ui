sap.ui.require([
  'jquery.sap.global',
  'com/mlauffer/gotmoneyappui5/controller/CategoryList.controller',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(jQuery, CategoryList) {
  'use strict';

  var stub;
  var oCategoryList = new CategoryList();

  QUnit.module('CategoryList', {});
});
