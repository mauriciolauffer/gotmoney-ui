sap.ui.define([
  'sap/base/Log',
  'sap/m/MessageToast',
  'sap/ui/unified/ShellHeadUserItem',
  'com/mlauffer/gotmoneyappui5/controller/BaseController',
  'com/mlauffer/gotmoneyappui5/controller/SystemLogin'
], function(Log, MessageToast, ShellHeadUserItem, BaseController, SystemLogin) {
  'use strict';

  return BaseController.extend('com.mlauffer.gotmoneyappui5.controller.App', {
    _systemLogin: null,

    onInit: function() {
      const oRouter = this.getRouter();
      oRouter.attachBypassed(function(oEvent) {
        const sHash = oEvent.getParameter('hash');
        // do something here, i.e. send logging data to the backend for analysis
        // telling what resource the user tried to access...
        Log.info("Sorry, but the hash '" + sHash + "' is invalid.", 'The resource was not found.');
        this.saveLog('E', 'notFound');
      }, this);
      /*oRouter.attachRouteMatched(function(oEvent) {
       var sRouteName = oEvent.getParameter("name");
       // do something, i.e. send usage statistics to backend
       // in order to improve our app and the user experience (Build-Measure-Learn cycle)
       Log.info("User accessed route " + sRouteName + ", timestamp = " + new Date().getTime());
       this.saveLog("I", sRouteName);
       }, this);*/

      sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);
      this._systemLogin = new SystemLogin(this);
    },

    onAfterRendering: function() {
      const that = this;
      that.getView().setBusy(true);
      this.checkUserConnected()
        .then(function() {
          that._loadBackendData();
          that._toogleButtonsVisible();
          that.getView().setBusy(false);
        })
        .catch(function(err) {
          that.getView().setBusy(false);
          that.getRouter().navTo('index', {}, true);
        });
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
      const oItem = this.getView().byId('btMenu');
      const oShell = this.getView().byId('appUShell');
      let bState = oShell.getShowPane();
      oShell.setShowPane(!bState);
      oItem.setShowMarker(!bState);
      oItem.setSelected(!bState);
    },

    _toogleButtonsVisible: function() {
      let bState = this.getUserLogged();
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
      this.getView().getModel().setData({});
      this.getView().setBusy(false);
      this.getRouter().navTo('index');
      MessageToast.show(this.getResourceBundle().getText('Success.logoff'));
    },


    _createShellUserButton: function() {
      const oUser = new ShellHeadUserItem({
        image: 'sap-icon://person-placeholder',
        username: '{/User/name}',
        press: this.onUserItemPressed.bind(this)
      });
      this.getView().byId('appUShell').setUser(oUser);
    },

    _destroyShellUserButton: function() {
      this.getView().byId('appUShell').setUser(null);
    }
  });
});
