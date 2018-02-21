sap.ui.define([
  'sap/m/MessageBox',
  'com/mlauffer/gotmoneyappui5/controller/BaseController',
  'com/mlauffer/gotmoneyappui5/model/formatter'
], function(MessageBox, BaseController, formatter) {
  'use strict';

  return BaseController.extend('com.mlauffer.gotmoneyappui5.controller.AccountList', {
    formatter: formatter,

    onInit: function() {
      try {
        this.getView().addEventDelegate({
          onAfterShow: function() {
            this.checkSession();
          }
        }, this);

      } catch (e) {
        this.saveLog('E', e.message);
        MessageBox.error(e.message);
      }
    },

    onItemPress: function(oEvent) {
      this.vibrate();
      this.getRouter().navTo('account', {
        accountId: this.extractIdFromPath(oEvent.getSource().getBindingContext().getPath())
      });
    },


    onAddNew: function() {
      this.vibrate();
      this.getRouter().navTo('accountNew');
    }
  });
});
