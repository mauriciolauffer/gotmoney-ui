sap.ui.define([
  'jquery.sap.global',
  'sap/m/MessageBox',
  'sap/ui/core/mvc/Controller'
], function(jQuery, MessageBox, Controller) {
  'use strict';

  return Controller.extend('com.mlauffer.gotmoneyappui5.controller.FacebookLogin', {
    _oViewController: null,

    /**
     * The component is destroyed by UI5 automatically.
     * @public
     * @override
     */
    destroy: function() {
      if (this._oViewController !== null) {
        this._oViewController.destroy();
      }
    },


    login: function(oViewController) {
      try {
        this._oViewController = oViewController;
        this._oViewController._oDialogLogin.setBusy(true);
        var that = this;

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
      if (this._oViewController._oDialogLogin) {
        this._oViewController._oDialogLogin.setBusy(true);
      }
      this._oViewController.getView().setBusy(true);
      var that = this;
      jQuery.ajax({
        url: '/api/session/facebook',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + accessToken
        },
        contentType: 'application/json',
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        }
      })
        .done(function() {
          that._oViewController._loginDone();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          if (that._oViewController._oDialogLogin) {
            that._oViewController._oDialogLogin.setBusy(false);
          }
          that._oViewController._ajaxFail(jqXHR, textStatus, errorThrown);
        });
    },


    onFailure: function() {
      if (this._oViewController._oDialogLogin) {
        this._oViewController._oDialogLogin.setBusy(false);
      }
      this._oViewController.getView().setBusy(false);
      MessageBox.error(this._oViewController.getResourceBundle().getText('Login.facebookError'));
    }
  });
});
