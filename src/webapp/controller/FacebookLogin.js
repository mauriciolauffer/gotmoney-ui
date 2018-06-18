sap.ui.define([
  'jquery.sap.global',
  'sap/m/MessageBox',
  'sap/ui/core/mvc/Controller'
], function(jQuery, MessageBox, Controller) {
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
        var that = this;

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
      var that = this;
      jQuery.ajax({
        url: GOTMONEY.BACKEND_API_HOSTNAME + '/api/session/facebook',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + accessToken
        },
        contentType: 'application/json',
        dataType: 'json'
      })
        .done(function() {
          that._systemLogin.onCloseLogin();
          that._systemLogin.onCloseSignup();
          that._systemLogin._oViewController._loginDone();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          if (that._systemLogin._oDialogLogin) {
            that._systemLogin._oDialogLogin.setBusy(false);
          }
          if (this._systemLogin._oDialogSignup) {
            this._systemLogin._oDialogSignup.setBusy(false);
          }
          that._systemLogin._oViewController._ajaxFail(jqXHR, textStatus, errorThrown);
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
