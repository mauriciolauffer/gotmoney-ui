sap.ui.require([
  'jquery.sap.global',
  'com/mlauffer/gotmoneyappui5/controller/Category.controller',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(jQuery, Category) {
  'use strict';

  var stub;
  var oCategory = new Category();

  QUnit.module('Category', {});
});
