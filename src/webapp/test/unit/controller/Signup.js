sap.ui.require([
  'com/mlauffer/gotmoneyappui5/controller/Signup.controller',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(Signup) {
  'use strict';

  var stub;
  var oSignup = new Signup();

  QUnit.module('Signup', {});
});
