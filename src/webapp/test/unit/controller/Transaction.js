sap.ui.require([
  'jquery.sap.global',
  'com/mlauffer/gotmoneyappui5/controller/Transaction.controller',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(jQuery, Transaction) {
  'use strict';

  var stub;
  var oTransaction = new Transaction();

  QUnit.module('Transaction', {});
});
