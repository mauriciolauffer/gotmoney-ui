sap.ui.require([
  'com/mlauffer/gotmoneyappui5/controller/AccountList.controller',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(AccountList) {
  'use strict';

  var stub;
  var oAccountList = new AccountList();

  QUnit.module('AccountList', {});
});
