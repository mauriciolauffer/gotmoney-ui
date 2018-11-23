sap.ui.require([
  'com/mlauffer/gotmoneyappui5/controller/Transaction.controller',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(Transaction) {
  'use strict';

  var stub;
  var oTransaction = new Transaction();

  QUnit.module('Transaction', {});
});
