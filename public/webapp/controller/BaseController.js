sap.ui.define([
  'jquery.sap.global',
  'sap/ui/core/ValueState',
  'sap/ui/core/mvc/Controller',
  'sap/ui/core/routing/History',
  'sap/m/BusyDialog',
  'sap/m/MessageBox'
], function(jQuery, ValueState, Controller, History, BusyDialog, MessageBox) {
  'use strict';

  var _initialData = {
    AccountType: [],
    User: {
      Account: [],
      Category: [],
      Transaction: []
    }
  };

  var BaseController = Controller.extend('com.mlauffer.gotmoneyappui5.controller.BaseController', {
    _messagePopover: null
  });

  /**
   * Convenience method for accessing the router in every controller of the application.
   * @public
   * @returns {sap.ui.core.routing.Router} the router for this component
   */
  BaseController.prototype.getRouter = function() {
    return this.getOwnerComponent().getRouter();
  };


  /**
   * Convenience method for getting the resource bundle.
   * @public
   * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
   */
  BaseController.prototype.getResourceBundle = function() {
    return this.getOwnerComponent().getModel('i18n').getResourceBundle();
  };


  /**
   * Convenience method for getting the resource bundle.
   * @public
   * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
   */
  BaseController.prototype.getMessagePopover = function() {
    //Initialize the Message Popover used to display the errors
    if (!this._messagePopover) {
      this._messagePopover = sap.ui.xmlfragment(this.getView().getId(),
                                                'com.mlauffer.gotmoneyappui5.view.MessagePopover', this);
      this.getView().addDependent(this._messagePopover);

    }
    return this._messagePopover;
  };


  BaseController.prototype.clearValueState = function(controlIds) {
    var that = this;
    this.getOwnerComponent().oMessageManager.removeAllMessages();
    if (controlIds) {
      controlIds.forEach(function(controlId) {
        var control = that.getView().byId(controlId);
        if (control) {
          if (control.setValueState) {
            control.setValueState(ValueState.None);
          }
          if (control.setValueStateText) {
            control.setValueStateText('');
          }
        }
      });
    }
  };


  /**
   * Event handler  for navigating back.
   * It checks if there is a history entry. If yes, history.go(-1) will happen.
   * If not, it will replace the current entry of the browser history with the master route.
   * @public
   */
  BaseController.prototype.onMessagePopoverPress = function(oEvent) {
    this.getMessagePopover().toggle(oEvent.getSource());
  };


  /**
   * Event handler  for navigating back.
   * It checks if there is a history entry. If yes, history.go(-1) will happen.
   * If not, it will replace the current entry of the browser history with the master route.
   * @public
   */
  BaseController.prototype.onNavBack = function() {
    this.vibrate();
    var sPreviousHash = History.getInstance().getPreviousHash();
    if (sPreviousHash !== undefined) {
      // The history contains a previous entry
      history.go(-1);
    } else {
      // Otherwise we go backwards with a forward history
      this.getRouter().navTo('home', {}, true);
    }
  };


  /**
   * Convenience method for getting the last part of a Binding Path.
   * @public
   */
  BaseController.prototype.onFinishBackendOperation = function() {
    this.onNavBack();
    this.getView().getModel().updateBindings();
    this.getView().setBusy(false);
  };


  /**
   * Convenience method for getting the last part of a Binding Path.
   * @public
   * @returns {string} the last part of a Binding Path
   */
  BaseController.prototype.extractIdFromPath = function(sPath) {
    return sPath.slice(sPath.lastIndexOf('/') + 1);
  };


  BaseController.prototype._ajaxFail = function(oResult, textStatus, jqXHR) {
    this.vibrate();
    var sText = this.getResourceBundle().getText('Error.internalServerError');
    //var sDetail = this.getResourceBundle().getText("Error.noDetails");
    try {
      if (oResult.responseJSON.messageCode) {
        sText = oResult.responseJSON.messageCode;
      }

      //TODO
      /*if (oResult.responseJSON.messageCode = "Error.invalidInput") {
       sDetail = oResult.responseJSON.message;
       //MessageBox.error(this.getResourceBundle().getText(sText) + "\n\n", { details : sDetail });
       } else {
       MessageBox.error(this.getResourceBundle().getText(sText));
       }*/

    } catch (e) {
      console.dir(e);
      console.dir(oResult);
    }

    MessageBox.error(this.getResourceBundle().getText(sText));

    this.getView().setBusy(false);
    try {
      if (oResult.responseJSON.messageCode === 'Error.userNotLoggedIn') {
        this.getRouter().navTo('index');
      }
    } catch (e) {
      console.dir(e);
    }
  };


  /**
   * Convenience method for logging actions in the system.
   * @public
   */
  BaseController.prototype.saveLog = function(sType, sText) {
    //TODO
    // do something, i.e. send usage statistics to backend
    // in order to improve our app and the user experience (Build-Measure-Learn cycle)
    //console.dir(jQuery(window.location).attr('href'));
    //console.dir(jQuery(window.location).attr('hash'));
    sType = sType.toUpperCase();
    //var sUser = '';
    var sURL = jQuery(window.location).attr('href').toString();
    var sLogMessage = sType + ': ' + sText + '. User accessed route ' + sURL + ', timestamp = ' + jQuery.now();
    switch (sType) {
      case 'E':
        jQuery.sap.log.error(sLogMessage);
        break;
      case 'I':
        jQuery.sap.log.info(sLogMessage);
        break;
      case 'S':
        jQuery.sap.log.info(sLogMessage);
        break;
      case 'W':
        jQuery.sap.log.warning(sLogMessage);
        break;
      default:
        jQuery.sap.log.info(sLogMessage);
        break;
    }
  };

  BaseController.prototype.checkSession = function() {
    if (!this.getUserLogged()) {
      var that = this;
      MessageBox.error(this.getResourceBundle().getText('Error.userNotConnected'), {
        onClose: function(sAction) {
          that.getRouter().navTo('index');
        }
      });
    }
  };

  BaseController.prototype.destroySession = function() {
    Lockr.rm('logged');
    this.getView().getModel().setData(_initialData);
  };

  BaseController.prototype.getUserLogged = function() {
    return (Lockr.get('logged') === true);
  };

  BaseController.prototype.setUserLogged = function(isUserLogged) {
    Lockr.set('logged', isUserLogged);
  };

  BaseController.prototype.checkUserConnected = function() {
    var connected = false;
    jQuery.ajax({
      url: '/api/session/loggedin',
      async: false,
      method: 'GET',
      contentType: 'application/json',
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      }
    })
      .done(function() {
        connected = true;
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        connected = false;
      });
    this.setUserLogged(connected);
    return connected;
  };

  BaseController.prototype.vibrate = function() {
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  BaseController.prototype.getToken = function() {
    jQuery.ajax({
      url: '/api/session/token',
      method: 'GET',
      contentType: 'application/json'
    })
      .done(function(result) {
        jQuery.ajaxSetup({
          beforeSend: function(xhr) {
            xhr.setRequestHeader('x-csrf-token', result.csrfToken);
          }
        });
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        //jqXHR
      });
  };

  BaseController.prototype._loadBackendData = function() {
    this._oBusyDialog = new BusyDialog();
    this._oBusyDialog.open();
    if (window.Promise) {
      var that = this;
      this.getView().getModel().setData(_initialData);
      Promise.all([that._loadUser()])
      /*.then(function() {
       return Promise.all([that._loadAccount(), that._loadCategory(), that._loadAccountType()]);
       })*/
        .then(function() {
          return that._loadTransaction();
        })
        .then(function() {
          that.getView().getModel().updateBindings(true);
          that._oBusyDialog.close();
        })
        .catch(function() {
          that._oBusyDialog.close();
          console.dir('Promise error...');
        });
    } else {
      MessageBox.error(this.getResourceBundle().getText('Error.notSupportPromise'));
    }
  };

  BaseController.prototype._loadUser = function() {
    var that = this;
    return new Promise(function(resolve, reject) {
      jQuery.ajax({
        url: '/api/user/' + jQuery.now(),
        method: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        }
      })
        .done(function(response) {
          that.getView().getModel().getData().User = response.User;
          that.getView().getModel().getData().User.Account = response.Account;
          that.getView().getModel().getData().User.Category = response.Category;
          that.getView().getModel().getData().AccountType = response.AccountType;
          return resolve();

        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          that._ajaxFail(jqXHR, textStatus, errorThrown);
          return reject();
        });
    });
  };

  BaseController.prototype._loadCategory = function() {
    var that = this;
    return new Promise(function(resolve, reject) {
      jQuery.ajax({
        url: '/api/category/',
        method: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        }
      })
        .done(function(response) {
          that.getView().getModel().getData().User.Category = response || [];
          return resolve();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          that._ajaxFail(jqXHR, textStatus, errorThrown);
          return reject();
        });
    });
  };

  BaseController.prototype._loadAccount = function() {
    var that = this;
    return new Promise(function(resolve, reject) {
      jQuery.ajax({
        url: '/api/account/',
        method: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        }
      })
        .done(function(response) {
          that.getView().getModel().getData().User.Account = response || [];
          return resolve();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          that._ajaxFail(jqXHR, textStatus, errorThrown);
          return reject();
        });
    });
  };

  BaseController.prototype._loadTransaction = function() {
    var that = this;
    return new Promise(function(resolve, reject) {
      jQuery.ajax({
        url: '/api/transaction/',
        method: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        }
      })
        .done(function(response) {
          that.getView().getModel().getData().User.Transaction = response || [];
          return resolve();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          that._ajaxFail(jqXHR, textStatus, errorThrown);
          return reject();
        });
    });
  };

  BaseController.prototype._loadAccountType = function() {
    var that = this;
    return new Promise(function(resolve, reject) {
      jQuery.ajax({
        url: '/api/accounttype/',
        method: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        }
      })
        .done(function(response) {
          that.getView().getModel().getData().AccountType = response || [];
          return resolve();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          that._ajaxFail(jqXHR, textStatus, errorThrown);
          return reject();
        });
    });
  };

  return BaseController;
});
