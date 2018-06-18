sap.ui.define([
  'jquery.sap.global',
  'sap/m/MessageToast',
  'sap/ui/unified/ShellHeadUserItem',
  'com/mlauffer/gotmoneyappui5/controller/BaseController',
  'com/mlauffer/gotmoneyappui5/controller/SystemLogin'
], function(jQuery, MessageToast, ShellHeadUserItem, BaseController, SystemLogin) {
  'use strict';

  return BaseController.extend('com.mlauffer.gotmoneyappui5.controller.App', {
    _oDialogLogin: null,
    _oDialogRecovery: null,
    _oGoogleLogin: null,
    _systemLogin: null,

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

      jQuery.ajaxPrefilter( function(options) {
        var regexp = new RegExp('^' + GOTMONEY.BACKEND_API_HOSTNAME);
        if (regexp.test(options.url)) {
          options.crossDomain = {
            crossDomain: true
          };
          options.xhrFields = {
            withCredentials: true
          };
        }
      });
      this.getToken();
      this._systemLogin = new SystemLogin(this);
    },

    onAfterRendering: function() {
      var that = this;
      that.getView().setBusy(true);
      this.checkUserConnected()
        .then(function() {
          that._loadBackendData();
          that._toogleButtonsVisible();
          that.getView().setBusy(false);
        })
        .catch(function(err) {
          that.getView().setBusy(false);
          jQuery.sap.log.error(err);
          that.getRouter().navTo('index', {}, true);
        });
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

    onLogin: function() {
      this._systemLogin.onLogin();
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

    onSignup: function() {
      this._systemLogin.onSignup();
    },

    onLogoff: function() {
      this._systemLogin.onLogoff();
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
