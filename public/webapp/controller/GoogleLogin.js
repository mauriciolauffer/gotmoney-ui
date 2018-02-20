sap.ui.define([
  'jquery.sap.global',
  'sap/m/MessageBox',
  'sap/ui/core/mvc/Controller'
], function(jQuery, MessageBox, Controller) {
  'use strict';

  return Controller.extend('com.mlauffer.gotmoneyappui5.controller.GoogleLogin', {
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

    renderButton: function(oViewController, idButton) {
      this._oViewController = oViewController;
      if (Google.auth2) {
        Google.auth2.attachClickHandler(idButton, {},
                                        jQuery.proxy(this.onSuccess, this),
                                        jQuery.proxy(this.onFailure, this)
        );
      }
    },

    onSuccess: function(googleUser) {
      if (this._oViewController._oDialogLogin) {
        this._oViewController._oDialogLogin.setBusy(true);
      }
      this._oViewController.getView().setBusy(true);
      var that = this;
      jQuery.ajax({
        url: '/api/session/google',
        method: 'POST',
        headers: {
          'Access_token': googleUser.getAuthResponse().access_token
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
      MessageBox.error(this._oViewController.getResourceBundle().getText('Login.googleError'));
    }
  });
});
