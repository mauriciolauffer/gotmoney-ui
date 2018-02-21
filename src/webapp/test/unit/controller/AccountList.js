sap.ui.require([
  'jquery.sap.global',
  'com/mlauffer/gotmoneyappui5/controller/AccountList.controller',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(jQuery, AccountList) {
  'use strict';

  var stub;
  var oAccountList = new AccountList();

  QUnit.module('AccountList', {});
});
