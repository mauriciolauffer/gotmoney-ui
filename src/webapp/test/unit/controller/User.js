sap.ui.require([
  'com/mlauffer/gotmoneyappui5/controller/User.controller',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(User) {
  'use strict';

  let stub;
  const oUser = new User();

  QUnit.module('User', {});
});
