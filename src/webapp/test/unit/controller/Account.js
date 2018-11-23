sap.ui.require([
  'com/mlauffer/gotmoneyappui5/controller/Account.controller',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(Account) {
  'use strict';

  var stub;
  var oAccount = new Account();

  QUnit.module('Account', {});
});
