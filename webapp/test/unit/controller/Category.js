sap.ui.require([
  'com/mlauffer/gotmoneyappui5/controller/Category.controller',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(Category) {
  'use strict';

  let stub;
  const oCategory = new Category();

  QUnit.module('Category', {});
});
