sap.ui.define([
  'jquery.sap.global',
  'sap/m/MessageBox',
  'sap/m/MessageToast',
  'sap/ui/core/Fragment',
  'sap/ui/core/ValueState',
  'sap/ui/unified/ShellHeadUserItem',
  'com/mlauffer/gotmoneyappui5/controller/BaseController',
  'com/mlauffer/gotmoneyappui5/controller/FacebookLogin',
  'com/mlauffer/gotmoneyappui5/controller/GoogleLogin'
], function(jQuery, MessageBox, MessageToast, Fragment, ValueState, ShellHeadUserItem, BaseController, FacebookLogin,
  GoogleLogin) {
  'use strict';

  return BaseController.extend('com.mlauffer.gotmoneyappui5.controller.App', {
    _oDialogLogin: null,
    _oDialogRecovery: null,
    _oGoogleLogin: null,

    onInit: function() {
      var oRouter = this.getRouter();
      oRouter.attachBypassed(function(oEvent) {
        var sHash = oEvent.getParameter('hash');
        // do something here, i.e. send logging data to the backend for analysis
        // telling what resource the user tried to access...
        jQuery.sap.log.info("Sorry, but the hash '" + sHash + "' is invalid.", 'The resource was not found.');
        this.saveLog('E', 'notFound');
      }, this);
      /*oRouter.attachRouteMatched(function(oEvent) {
       var sRouteName = oEvent.getParameter("name");
       // do something, i.e. send usage statistics to backend
       // in order to improve our app and the user experience (Build-Measure-Learn cycle)
       jQuery.sap.log.info("User accessed route " + sRouteName + ", timestamp = " + new Date().getTime());
       this.saveLog("I", sRouteName);
       }, this);*/

      sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);

      jQuery.ajax({
        url: '/api/session/token',
        method: 'GET',
        contentType: 'application/json'
      })
        .done(function(result) {
          jQuery.ajaxSetup({
            beforeSend: function(jqXHR, settings) {
              // Do not set CSRF header for external calls
              if (!/openui5.hana.ondemand.com/.test(settings.url) &&
                !/facebook.com/.test(settings.url) &&
                !/google.com/.test(settings.url)) {
                jqXHR.setRequestHeader('x-csrf-token', result.csrfToken);
              }
            }
          });
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          //jqXHR
        });
    },

    onAfterRendering: function() {
      if (this.checkUserConnected()) {
        this._loadBackendData();
        this._toogleButtonsVisible();
      }
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
    },

    onPressHome: function() {
      this.vibrate();
      this.getRouter().navTo('home');
    },

    onPressIndex: function() {
      this.vibrate();
      this.getRouter().navTo('index');
    },

    onPressMenu: function() {
      this.vibrate();
      this._toogleShellOverlay();
    },

    onClosedShellOverlay: function() {
      this._toogleShellOverlay();
    },

    onUserItemPressed: function() {
      this.vibrate();
      this.getRouter().navTo('profile');
    },

    onAccount: function() {
      this.vibrate();
      this._toogleShellOverlay();
      this.getRouter().navTo('accountList');
    },

    onCategory: function() {
      this.vibrate();
      this._toogleShellOverlay();
      this.getRouter().navTo('categoryList');
    },

    onTransaction: function() {
      this.vibrate();
      this._toogleShellOverlay();
      this.getRouter().navTo('transactionList');
    },

    onTransactionOverdue: function() {
      this.vibrate();
      this._toogleShellOverlay();
      this.getRouter().navTo('transactionOverdue');
    },

    onReport: function() {
      //TODO:
    },

    onProfile: function(oEvent) {
      this.vibrate();
      this._toogleShellOverlay();
      this.getRouter().navTo('profile');
    },

    onLogin: function() {
      this.vibrate();
      if (!this._oDialogLogin) {
        this._oDialogLogin = sap.ui.xmlfragment('Login', 'com.mlauffer.gotmoneyappui5.view.Login', this);
        this.getView().addDependent(this._oDialogLogin);
      }
      this._oDialogLogin.open();

      var oGoogleLogin = new GoogleLogin();
      oGoogleLogin.renderButton(this, Fragment.byId('Login', 'btGoogle').getDomRef().id);
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
        url: '/api/session/login',
        data: JSON.stringify(mPayload),
        method: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        }
      })
        .done(function() {
          that._loginDone();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          that._oDialogLogin.setBusy(false);
          that._ajaxFail(jqXHR, textStatus, errorThrown);
        });
    },

    onCloseLogin: function() {
      this.vibrate();
      this._oDialogLogin.setBusy(false);
      this._oDialogLogin.close();
      this.getView().setBusy(false);
    },

    onAfterCloseLogin: function() {
      Fragment.byId('Login', 'email').setValue();
      Fragment.byId('Login', 'pwd').setValue();
    },

    onRecovery: function() {
      this.vibrate();
      this.onCloseLogin();
      if (!this._oDialogRecovery) {
        this._oDialogRecovery = sap.ui.xmlfragment('Recovery', 'com.mlauffer.gotmoneyappui5.view.Recovery', this);
        this.getView().addDependent(this._oDialogRecovery);
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
        url: '/api/session/recovery',
        data: JSON.stringify(mPayload),
        method: 'PUT',
        contentType: 'application/json',
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        }
      })
        .done(function() {
          MessageBox.success(that.getResourceBundle().getText('Success.passwordRecovery'));
          that.onCloseRecovery();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          that._ajaxFail(jqXHR, textStatus, errorThrown);
          that.onCloseRecovery();
        });
    },


    onCloseRecovery: function() {
      this.vibrate();
      Fragment.byId('Recovery', 'email').setValue();
      this._oDialogRecovery.setBusy(false);
      this._oDialogRecovery.close();
      this.getView().setBusy(false);
    },

    onAfterCloseRecovery: function() {
      Fragment.byId('Recovery', 'email').setValue();
    },

    onSignup: function() {
      this.vibrate();
      this.getRouter().navTo('signup');
    },

    onLogoff: function() {
      this.vibrate();
      this.getView().setBusy(true);
      var that = this;
      jQuery.ajax({
        url: '/api/session/logout',
        method: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        }
      })
        .done(function() {
          that._logoffDone();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          that._ajaxFail(jqXHR, textStatus, errorThrown);
        });
    },

    onFacebookLogin: function() {
      this.vibrate();
      var oFacebookLogin = new FacebookLogin();
      oFacebookLogin.login(this);
    },

    _toogleShellOverlay: function() {
      this.vibrate();
      var oItem = this.getView().byId('btMenu');
      var oShell = this.getView().byId('appUShell');
      var bState = oShell.getShowPane();
      oShell.setShowPane(!bState);
      oItem.setShowMarker(!bState);
      oItem.setSelected(!bState);
    },

    _toogleButtonsVisible: function() {
      var bState = this.getUserLogged();
      this.getView().byId('btHome').setVisible(bState);
      this.getView().byId('btMenu').setVisible(bState);
      this.getView().byId('btIndex').setVisible(!bState);
      this.getView().byId('btLogin').setVisible(!bState);
      this.getView().byId('btSignup').setVisible(!bState);

      if (bState) {
        this._createShellUserButton();
      } else {
        this._destroyShellUserButton();
      }
    },

    _loginDone: function() {
      this.setUserLogged(true);
      this._loadBackendData();
      this._toogleButtonsVisible();
      this.onCloseLogin();
      this.getRouter().navTo('home');
      MessageToast.show(this.getResourceBundle().getText('Success.login'));
    },

    _logoffDone: function() {
      this.destroySession();
      this._toogleShellOverlay();
      this._toogleButtonsVisible();
      this.getView().setBusy(false);
      this.getRouter().navTo('index');
      MessageToast.show(this.getResourceBundle().getText('Success.logoff'));
    },


    _createShellUserButton: function() {
      var oUser = new ShellHeadUserItem({
        image: 'sap-icon://person-placeholder',
        username: '{/User/name}',
        press: jQuery.proxy(this.onUserItemPressed, this)
      });
      this.getView().byId('appUShell').setUser(oUser);
    },

    _destroyShellUserButton: function() {
      this.getView().byId('appUShell').setUser(null);
    }
  });
});
