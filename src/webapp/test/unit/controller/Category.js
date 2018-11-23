sap.ui.require([
  'com/mlauffer/gotmoneyappui5/controller/Category.controller',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(Category) {
  'use strict';

  var stub;
  var oCategory = new Category();

  QUnit.module('Category', {});
});
