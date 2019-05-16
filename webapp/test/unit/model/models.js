sap.ui.require([
  'sap/ui/model/BindingMode',
  'sap/ui/model/json/JSONModel',
  'sap/ui/Device',
  'com/mlauffer/gotmoneyappui5/model/models',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(BindingMode, JSONModel, Device, models) {
  'use strict';

  function isPhoneTestCase(assert, bIsPhone) {
    this.stub(Device, 'system', {phone: bIsPhone});
    this.oDeviceModel = models.createDeviceModel();
    assert.strictEqual(this.oDeviceModel.getData().system.phone, bIsPhone, 'IsPhone property is correct');
  }

  function isTouchTestCase(assert, bIsTouch) {
    this.stub(Device, 'support', {touch: bIsTouch});
    this.oDeviceModel = models.createDeviceModel();
    assert.strictEqual(this.oDeviceModel.getData().support.touch, bIsTouch, 'IsTouch property is correct');
  }

  QUnit.module('models:createDeviceModel', {
    afterEach: function() {
      this.oDeviceModel.destroy();
    }
  });

  QUnit.test('Should initialize a device model for desktop', function(assert) {
    isPhoneTestCase.call(this, assert, false);
  });

  QUnit.test('Should initialize a device model for phone', function(assert) {
    isPhoneTestCase.call(this, assert, true);
  });

  QUnit.test('Should initialize a device model for non touch devices', function(assert) {
    isTouchTestCase.call(this, assert, false);
  });

  QUnit.test('Should initialize a device model for touch devices', function(assert) {
    isTouchTestCase.call(this, assert, true);
  });

  QUnit.test('The binding mode of the device model should be one way', function(assert) {
    this.oDeviceModel = models.createDeviceModel();
    assert.strictEqual(this.oDeviceModel.getDefaultBindingMode(), BindingMode.OneWay, 'Binding mode is correct');
  });


  QUnit.module('models:editDefaultModel', {});

  QUnit.test('The binding mode of the model should be one way', function(assert) {
    const oModel = new JSONModel();
    models.editDefaultModel(oModel);
    assert.strictEqual(oModel.getDefaultBindingMode(), BindingMode.OneWay, 'Binding mode is correct');
  });

  QUnit.test('The limit size of the model should be 1000', function(assert) {
    const oModel = new JSONModel();
    models.editDefaultModel(oModel);
    assert.strictEqual(oModel.iSizeLimit, 1000, 'Sizing limit is correct');
  });

  QUnit.test('The initial data of the model should be set', function(assert) {
    const initialData = {
      AccountType: [],
      User: {
        Account: [],
        Category: [],
        Transaction: []
      }
    };
    const oModel = new JSONModel();
    models.editDefaultModel(oModel);
    assert.deepEqual(oModel.getData(), initialData, 'Initial data is correct');
  });
});
