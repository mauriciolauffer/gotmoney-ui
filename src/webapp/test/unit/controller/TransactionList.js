sap.ui.require([
  'com/mlauffer/gotmoneyappui5/controller/TransactionList.controller',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(TransactionList) {
  'use strict';

  let stub;
  const oTransactionList = new TransactionList();

  QUnit.module('TransactionList', {});
});
