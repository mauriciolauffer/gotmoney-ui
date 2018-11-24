sap.ui.define([
  'sap/m/MessageBox',
  'sap/ui/core/mvc/Controller'
], function(MessageBox, Controller) {
  'use strict';

  return Controller.extend('com.mlauffer.gotmoneyappui5.controller.FacebookLogin', {
    _systemLogin: null,

    /**
     * The component is destroyed by UI5 automatically.
     * @public
     * @override
     */
    destroy: function() {
      if (this._systemLogin !== null) {
        this._systemLogin.destroy();
      }
    },


    login: function(oViewController) {
      try {
        const that = this;

        this._systemLogin = oViewController;
        if (this._systemLogin._oDialogLogin) {
          this._systemLogin._oDialogLogin.setBusy(true);
        }
        if (this._systemLogin._oDialogSignup) {
          this._systemLogin._oDialogSignup.setBusy(true);
        }

        FB.login(function(response) {
          if (response.status === 'connected') {
            that.onSuccess(response.authResponse.accessToken);
          } else {
            that.onFailure();
          }
        }, {
          scope: 'public_profile,email'
        });

      } catch (e) {
        this.onFailure();
      }
    },


    onSuccess: function(accessToken) {
      if (this._systemLogin._oDialogLogin) {
        this._systemLogin._oDialogLogin.setBusy(true);
      }
      if (this._systemLogin._oDialogSignup) {
        this._systemLogin._oDialogSignup.setBusy(true);
      }
      this._systemLogin._oViewController.getView().setBusy(true);
      const that = this;
      const url = GOTMONEY.BACKEND_API_HOSTNAME + '/api/session/facebook';
      const options = that._systemLogin._oViewController.getFetchOptions(null, 'POST');
      options.headers.Authorization = 'Bearer ' + accessToken;
      fetch(url, options)
        .then(function(response) {
          if (response.ok) {
            that._systemLogin.onCloseLogin();
            that._systemLogin.onCloseSignup();
            that._systemLogin._oViewController._loginDone();
          } else {
            throw response.json();
          }
        })
        .catch(function(err) {
          if (that._systemLogin._oDialogLogin) {
            that._systemLogin._oDialogLogin.setBusy(false);
          }
          if (that._systemLogin._oDialogSignup) {
            that._systemLogin._oDialogSignup.setBusy(false);
          }
          that._systemLogin._oViewController._backendFail(err);
        });
    },


    onFailure: function() {
      if (this._systemLogin._oDialogLogin) {
        this._systemLogin._oDialogLogin.setBusy(false);
      }
      if (this._systemLogin._oDialogSignup) {
        this._systemLogin._oDialogSignup.setBusy(false);
      }
      this._systemLogin._oViewController.getView().setBusy(false);
      MessageBox.error(this._systemLogin._oViewController.getResourceBundle().getText('Login.facebookError'));
    }
  });
});
