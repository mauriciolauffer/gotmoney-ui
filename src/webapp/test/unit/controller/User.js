sap.ui.require([
  'jquery.sap.global',
  'com/mlauffer/gotmoneyappui5/controller/User.controller',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(jQuery, User) {
  'use strict';

  var stub;
  var oUser = new User();

  QUnit.module('User', {});
});
