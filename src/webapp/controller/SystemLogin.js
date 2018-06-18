sap.ui.define([
  'jquery.sap.global',
  'sap/m/MessageBox',
  'sap/m/MessageToast',
  'sap/ui/core/Fragment',
  'sap/ui/core/mvc/Controller',
  'com/mlauffer/gotmoneyappui5/controller/FacebookLogin',
  'com/mlauffer/gotmoneyappui5/controller/GoogleLogin',
  'com/mlauffer/gotmoneyappui5/model/ObjectFactory'
], function(jQuery, MessageBox, MessageToast, Fragment, BaseController, FacebookLogin, GoogleLogin, ObjectFactory) {
  'use strict';

  return BaseController.extend('com.mlauffer.gotmoneyappui5.controller.SystemLogin', {
    _oViewController: null,

    constructor: function(viewController) {
      this._oViewController = viewController;
    },

    /**
     * The component is destroyed by UI5 automatically.
     * @public
     * @override
     */
    destroy: function() {
      if (this._oDialogLogin !== null) {
        this._oDialogLogin.destroy();
      }
      if (this._oDialogRecovery !== null) {
        this._oDialogRecovery.destroy();
      }
      if (this._oDialogSignup !== null) {
        this._oDialogSignup.destroy();
      }
      if (this._oViewController !== null) {
        this._oViewController.destroy();
      }
    },



    onLogin: function() {
      this._oViewController.vibrate();
      if (!this._oDialogLogin) {
        this._oDialogLogin = sap.ui.xmlfragment('Login', 'com.mlauffer.gotmoneyappui5.view.Login', this);
        this._oViewController.getView().addDependent(this._oDialogLogin);
      }
      this._oDialogLogin.open();

      var oGoogleLogin = new GoogleLogin();
      oGoogleLogin.renderButton(this._oViewController, Fragment.byId('Login', 'btGoogle').getDomRef().id);
    },

    onFacebookLogin: function() {
      this._oViewController.vibrate();
      var oFacebookLogin = new FacebookLogin();
      oFacebookLogin.login(this._oViewController);
    },

    onSystemLogin: function() {
      this._oDialogLogin.setBusy(true);
      var that = this;
      var mPayload = {
        login: 'system',
        email: Fragment.byId('Login', 'email').getValue(),
        passwd: Fragment.byId('Login', 'pwd').getValue()
      };

      jQuery.ajax({
        url: GOTMONEY.BACKEND_API_HOSTNAME + '/api/session/login',
        data: JSON.stringify(mPayload),
        method: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      })
        .done(function() {
          that.onCloseLogin();
          that._oViewController._loginDone();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          that._oDialogLogin.setBusy(false);
          that._oViewController._ajaxFail(jqXHR, textStatus, errorThrown);
        });
    },

    onCloseLogin: function() {
      this._oViewController.vibrate();
      this._oDialogLogin.setBusy(false);
      this._oDialogLogin.close();
      this._oViewController.getView().setBusy(false);
    },

    onAfterCloseLogin: function() {
      Fragment.byId('Login', 'email').setValue();
      Fragment.byId('Login', 'pwd').setValue();
    },

    onRecovery: function() {
      this._oViewController.vibrate();
      this.onCloseLogin();
      if (!this._oDialogRecovery) {
        this._oDialogRecovery = sap.ui.xmlfragment('Recovery', 'com.mlauffer.gotmoneyappui5.view.Recovery', this);
        this._oViewController.getView().addDependent(this._oDialogRecovery);
      }
      this._oDialogRecovery.open();
      var email = Fragment.byId('Login', 'email').getValue();
      Fragment.byId('Recovery', 'email').setValue(email);
    },

    onResetPassword: function() {
      this._oDialogRecovery.setBusy(true);
      var that = this;
      var mPayload = {
        email: Fragment.byId('Recovery', 'email').getValue()
      };
      jQuery.ajax({
        url: GOTMONEY.BACKEND_API_HOSTNAME + '/api/session/recovery',
        data: JSON.stringify(mPayload),
        method: 'PUT',
        contentType: 'application/json',
        dataType: 'json'
      })
        .done(function() {
          MessageBox.success(that._oViewController.getResourceBundle().getText('Success.passwordRecovery'));
          that.onCloseRecovery();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          that._oViewController._ajaxFail(jqXHR, textStatus, errorThrown);
          that.onCloseRecovery();
        });
    },


    onCloseRecovery: function() {
      this._oViewController.vibrate();
      Fragment.byId('Recovery', 'email').setValue();
      this._oDialogRecovery.setBusy(false);
      this._oDialogRecovery.close();
      this._oViewController.getView().setBusy(false);
    },

    onAfterCloseRecovery: function() {
      Fragment.byId('Recovery', 'email').setValue();
    },

    onLogoff: function() {
      var viewController = this._oViewController;
      viewController.vibrate();
      viewController.getView().setBusy(true);
      jQuery.ajax({
        url: GOTMONEY.BACKEND_API_HOSTNAME + '/api/session/logout',
        method: 'GET',
        contentType: 'application/json',
        dataType: 'json'
      })
        .done(function() {
          viewController._logoffDone();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          viewController._ajaxFail(jqXHR, textStatus, errorThrown);
        });
    },

    onSignup: function() {
      this._oViewController.vibrate();
      if (!this._oDialogSignup) {
        this._oDialogSignup = sap.ui.xmlfragment('Signup', 'com.mlauffer.gotmoneyappui5.view.Signup', this);
        this._oViewController.getView().addDependent(this._oDialogSignup);
      }
      this._oDialogSignup.open();

      var oGoogleLogin = new GoogleLogin();
      oGoogleLogin.renderButton(this._oViewController, Fragment.byId('Signup', 'btGoogle').getDomRef().id);
    },

    onCloseSignup: function() {
      this._oViewController.vibrate();
      this._oDialogSignup.setBusy(false);
      this._oDialogSignup.close();
      this._oViewController.getView().setBusy(false);
    },

    onAfterCloseSignup: function() {
      Fragment.byId('Signup', 'name').setValue();
      Fragment.byId('Signup', 'email').setValue();
      Fragment.byId('Signup', 'pwd').setValue();
      Fragment.byId('Signup', 'pwdRepeat').setValue();
      Fragment.byId('Signup', 'terms').setSelected(false);
    },

    onCreateAccount: function(oEvent) {
      this._oViewController.vibrate();
      this._oViewController.getView().setBusy(true);
      this._saveNew();
    },

    _saveNew: function() {
      var that = this;
      var mPayload = this._getPayload();

      jQuery.ajax({
        url: GOTMONEY.BACKEND_API_HOSTNAME + '/api/session/signup',
        data: JSON.stringify(mPayload),
        method: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      })
        .done(function() {
          that._newDone(mPayload);
        })
        .fail(jQuery.proxy(that._oViewController._ajaxFail, that._oViewController));
    },


    _newDone: function(mPayload) {
      try {
        this.onCloseSignup();
        this._oViewController.getView().getModel().getData().User = mPayload;
        this._oViewController._loginDone();

      } catch (e) {
        this._oViewController.saveLog('E', e.message);
        MessageBox.error(e.message);
        this._oViewController.getView().setBusy(false);
      }
    },


    _getPayload: function() {
      var mPayload = ObjectFactory.buildUser();
      mPayload.iduser = Date.now();
      mPayload.email = Fragment.byId('Signup', 'email').getValue();
      mPayload.passwd = Fragment.byId('Signup', 'pwd').getValue();
      mPayload.passwdconf = Fragment.byId('Signup', 'pwdRepeat').getValue();
      mPayload.name = Fragment.byId('Signup', 'name').getValue();
      mPayload.alert = false;
      mPayload.tec = Fragment.byId('Signup', 'terms').getSelected();
      mPayload.lastchange = Date.now();
      return mPayload;
    }
  });
});
