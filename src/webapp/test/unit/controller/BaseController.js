sap.ui.require([
  'jquery.sap.global',
  'sap/ui/model/BindingMode',
  'sap/ui/model/json/JSONModel',
  'sap/ui/model/resource/ResourceModel',
  'sap/ui/Device',
  'com/mlauffer/gotmoneyappui5/controller/BaseController',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function(jQuery, BindingMode, JSONModel, ResourceModel, Device, BaseController) {
  'use strict';

  var stub;
  var oBaseController = new BaseController();

  QUnit.module('BaseController', {});
  QUnit.module('BaseController:getRouter()', {
    afterEach: function() {
      stub.restore();
      stub = null;
    }
  });
  QUnit.test('Should return router', function(assert) {
    var oRouter = {
      getRouter: function() {
        return {};
      }
    };
    stub = this.stub(oBaseController, 'getOwnerComponent').returns(oRouter);
    assert.ok(oBaseController.getRouter());
  });


  QUnit.module('BaseController:getResourceBundle()', {
    beforeEach: function() {
      this.oResourceModel = new ResourceModel({
        bundleUrl: jQuery.sap.getModulePath('com.mlauffer.gotmoneyappui5', '/i18n/i18n.properties')
      });
    },
    afterEach: function() {
      this.oResourceModel.destroy();
      stub.restore();
      stub = null;
    }
  });
  QUnit.test('Should return resource bundle', function(assert) {
    var oResourceBundleStub = {
      getResourceBundleSync: this.stub().returns(this.oResourceModel.getResourceBundle())
    };
    stub = this.stub(oBaseController, 'getOwnerComponent').returns(oResourceBundleStub);
    assert.ok(oBaseController.getResourceBundle());
  });


  QUnit.module('BaseController:onNavBack()', {});
  QUnit.module('BaseController:onFinishBackendOperation()', {});


  QUnit.module('BaseController:extractIdFromPath()', {});
  QUnit.test('Should return ID', function(assert) {
    assert.strictEqual(oBaseController.extractIdFromPath('/User/0'), '0');
    assert.strictEqual(oBaseController.extractIdFromPath('/User/Account/5'), '5');
    assert.strictEqual(oBaseController.extractIdFromPath('/User/Category/10'), '10');
    assert.strictEqual(oBaseController.extractIdFromPath('/User/Transaction/100'), '100');
  });


  QUnit.module('BaseController:_ajaxFail()', {});
  QUnit.module('BaseController:saveLog()', {});
  QUnit.module('BaseController:checkSession()', {});


  QUnit.module('BaseController:destroySession()', {
    beforeEach: function() {
      this.oModel = new JSONModel();
    },
    afterEach: function() {
      this.oModel.destroy();
    }
  });
  QUnit.test('Should destroy session', function(assert) {
    var oViewStub = {
      getModel: this.stub().returns(this.oModel)
    };
    var oControllerStub = {
      getView: this.stub().returns(oViewStub)
    };
    var initialData = {
      AccountType: [],
      User: {
        Account: [],
        Category: [],
        Transaction: []
      }
    };
    stub = this.stub(oBaseController, 'getView').returns(oViewStub);
    oBaseController.setUserLogged(true);
    oBaseController.destroySession();
    assert.strictEqual(oBaseController.getUserLogged(), false);
    assert.deepEqual(oBaseController.getView().getModel().getData(), initialData);
  });


  QUnit.module('BaseController:getUserLogged()', {});
  QUnit.test('Should return user is logged', function(assert) {
    oBaseController.setUserLogged(true);
    assert.strictEqual(oBaseController.getUserLogged(), true);
  });


  QUnit.module('BaseController:setUserLogged()', {});
  QUnit.test('Should return user is logged', function(assert) {
    oBaseController.setUserLogged(true);
    assert.strictEqual(oBaseController.getUserLogged(), true);
  });

  QUnit.test('Should return user is not logged', function(assert) {
    oBaseController.setUserLogged(false);
    assert.strictEqual(oBaseController.getUserLogged(), false);
  });


  QUnit.module('BaseController:checkUserConnected()', {});
  QUnit.module('BaseController:vibrate()', {});
  QUnit.module('BaseController:_loadBackendData()', {});
  QUnit.module('BaseController:_loadUser()', {});
  QUnit.module('BaseController:_loadCategory()', {});
  QUnit.module('BaseController:_loadAccount()', {});
  QUnit.module('BaseController:_loadTransaction()', {});
  QUnit.module('BaseController:_loadAccountType()', {});
});
