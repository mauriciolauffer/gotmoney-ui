sap.ui.require([
  'jquery.sap.global',
  'sap/ui/core/ValueState',
  'sap/ui/model/json/JSONModel',
  'sap/ui/model/resource/ResourceModel',
  'com/mlauffer/gotmoneyappui5/model/formatter',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(jQuery, ValueState, JSONModel, ResourceModel, formatter) {
  'use strict';

  var oResourceModel = new ResourceModel({
    bundleUrl: jQuery.sap.getModulePath('com.mlauffer.gotmoneyappui5', '/i18n/i18n.properties')
  });

  QUnit.module('formatter', {});
  QUnit.module('formatter:getCalendarStartDate()', {});
  QUnit.test('Should return first day of the current year', function(assert) {
    const startDate = formatter.getCalendarStartDate();
    assert.strictEqual(startDate.getFullYear(), new Date().getFullYear(), 'The year is correct');
    assert.strictEqual(startDate.getMonth(), 0, 'The month is correct');
    assert.strictEqual(startDate.getDate(), 1, 'The day is correct');
  });


  QUnit.module('formatter:numberState()', {});
  QUnit.test('Should return Error State for negative numbers', function(assert) {
    assert.strictEqual(formatter.numberState(-1), ValueState.Error, 'The state is correct');
  });

  QUnit.test('Should return Success State for positive numbers', function(assert) {
    assert.strictEqual(formatter.numberState(0), ValueState.Success, 'The state is correct');
    assert.strictEqual(formatter.numberState(1), ValueState.Success, 'The state is correct');
  });


  QUnit.module('formatter:creditDebit()', {});
  QUnit.test('Should return Error State for Debit', function(assert) {
    assert.strictEqual(formatter.creditDebit('D'), ValueState.Error, 'The state is correct');
  });

  QUnit.test('Should return Success State for Credit', function(assert) {
    assert.strictEqual(formatter.creditDebit('C'), ValueState.Success, 'The state is correct');
  });


  QUnit.module('formatter:paymentIcon()', {});
  QUnit.test('Should return decline icon', function(assert) {
    assert.strictEqual(formatter.paymentIcon(0), 'sap-icon://decline', 'The icon is correct');
  });

  QUnit.test('Should return accept icon', function(assert) {
    assert.strictEqual(formatter.paymentIcon(1), 'sap-icon://accept', 'The icon is correct');
    assert.strictEqual(formatter.paymentIcon(true), 'sap-icon://accept', 'The icon is correct');
  });


  QUnit.module('formatter:paymentStatus()', {});
  QUnit.test('Should return Error State', function(assert) {
    assert.strictEqual(formatter.paymentStatus(0), ValueState.Error, 'The state is correct');
  });

  QUnit.test('Should return Success State', function(assert) {
    assert.strictEqual(formatter.paymentStatus(1), ValueState.Success, 'The state is correct');
    assert.strictEqual(formatter.paymentStatus(true), ValueState.Success, 'The state is correct');
  });


  QUnit.module('formatter:paymentTooltip()', {});
  QUnit.test('Should return tooltip', function(assert) {
    var oResourceBundleStub = {
      getResourceBundleSync: this.stub().returns(oResourceModel.getResourceBundle())
    };
    var oControllerStub = {
      getOwnerComponent: this.stub().returns(oResourceBundleStub)
    };
    var isolatedFormatter = formatter.paymentTooltip.bind(oControllerStub);
    assert.ok(isolatedFormatter(0), 'The tooltip is correct');
  });

  QUnit.test('Should return tooltip', function(assert) {
    var oResourceBundleStub = {
      getResourceBundleSync: this.stub().returns(oResourceModel.getResourceBundle())
    };
    var oControllerStub = {
      getOwnerComponent: this.stub().returns(oResourceBundleStub)
    };
    var isolatedFormatter = formatter.paymentTooltip.bind(oControllerStub);
    assert.ok(isolatedFormatter(1), 'The tooltip is correct');
    assert.ok(isolatedFormatter(true), 'The tooltip is correct');
  });


  QUnit.module('formatter:accountTypeIcon()', {});
  QUnit.test('Should return Account Type icon', function(assert) {
    assert.strictEqual(formatter.accountTypeIcon(1), 'sap-icon://money-bills', 'The icon is correct');
    assert.strictEqual(formatter.accountTypeIcon(2), 'sap-icon://credit-card', 'The icon is correct');
    assert.strictEqual(formatter.accountTypeIcon(3), 'sap-icon://loan', 'The icon is correct');
    assert.strictEqual(formatter.accountTypeIcon(4), 'sap-icon://waiver', 'The icon is correct');
    assert.strictEqual(formatter.accountTypeIcon(5), 'sap-icon://money-bills', 'The icon is correct');
  });


  QUnit.module('formatter:accountTypeName()', {});
  QUnit.test('Should return Account Type name', function(assert) {
    var oResourceBundleStub = {
      getResourceBundleSync: this.stub().returns(oResourceModel.getResourceBundle())
    };
    var oControllerStub = {
      getOwnerComponent: this.stub().returns(oResourceBundleStub)
    };
    var isolatedFormatter = formatter.accountTypeName.bind(oControllerStub);
    assert.ok(isolatedFormatter(1), 'The name is correct');
    assert.ok(isolatedFormatter(2), 'The name is correct');
    assert.ok(isolatedFormatter(3), 'The name is correct');
    assert.ok(isolatedFormatter(4), 'The name is correct');
    assert.ok(isolatedFormatter(5), 'The name is correct');
  });


  QUnit.module('formatter:accountName()', {
    beforeEach: function() {
      this.oModel = new JSONModel();
      this.oModel.loadData('../../localService/mockdata/mock.json', {}, false);
    },
    afterEach: function() {
      this.oModel.destroy();
    }
  });
  QUnit.test('Should return Account Name for ID', function(assert) {
    var oViewStub = {
      getModel: this.stub().returns(this.oModel)
    };
    var oControllerStub = {
      getView: this.stub().returns(oViewStub)
    };
    var isolatedFormatter = formatter.accountName.bind(oControllerStub);
    assert.strictEqual(isolatedFormatter(13642352580536), 'Cash', 'The name is correct');
    assert.strictEqual(isolatedFormatter(13639248531753), 'ahhhhhhhhhh234', 'The name is correct');
  });

  QUnit.test('Should not find Account and return the ID passed as parameters', function(assert) {
    assert.strictEqual(formatter.accountName(1), 1, 'The ID is correct');
  });


  QUnit.module('formatter:numeralBoolean()', {});
  QUnit.test('Should return true', function(assert) {
    assert.strictEqual(formatter.numeralBoolean(1), true);
  });

  QUnit.test('Should return false', function(assert) {
    assert.strictEqual(formatter.numeralBoolean(0), false);
    assert.strictEqual(formatter.numeralBoolean(5), false);
    assert.strictEqual(formatter.numeralBoolean('X'), false);
  });


  QUnit.module('formatter:dateMySQLFormat()', {});
  QUnit.test('Should return formatted date', function(assert) {
    var formattedDate = formatter.dateMySQLFormat(new Date());
    assert.strictEqual(formattedDate.substr(0, 4), new Date().getFullYear().toString(), 'The year is correct');
    assert.strictEqual(parseInt(formattedDate.substr(5, 2), 10), new Date().getMonth() + 1, 'The month is correct');
    assert.strictEqual(parseInt(formattedDate.substr(8, 2), 10), new Date().getDate(), 'The day is correct');
  });

  QUnit.test('Should not return a formatted date', function(assert) {
    assert.strictEqual(formatter.dateMySQLFormat(null), null, 'The year is correct');
  });


  QUnit.module('formatter:dateFromJSON()', {});
  QUnit.test('Should return date object', function(assert) {
    assert.strictEqual(formatter.dateFromJSON('2000-01-01') instanceof Date, true);
  });


  QUnit.module('formatter:convertIdStatusToBoolean()', {});
  QUnit.test('Should return true', function(assert) {
    assert.strictEqual(formatter.convertIdStatusToBoolean(1), true);
    assert.strictEqual(formatter.convertIdStatusToBoolean(true), true);
  });

  QUnit.test('Should return false', function(assert) {
    assert.strictEqual(formatter.convertIdStatusToBoolean(0), false);
    assert.strictEqual(formatter.convertIdStatusToBoolean(false), false);
  });
});
