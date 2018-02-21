sap.ui.require([
  'jquery.sap.global',
  'com/mlauffer/gotmoneyappui5/controller/TransactionList.controller',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(jQuery, TransactionList) {
  'use strict';

  var stub;
  var oTransactionList = new TransactionList();

  QUnit.module('TransactionList', {});
});
