sap.ui.define([
  'sap/m/MessageBox',
  'sap/m/MessageToast',
  'sap/ui/model/Filter',
  'sap/ui/model/FilterOperator',
  'sap/ui/core/Fragment',
  'sap/ui/core/ValueState',
  'com/mlauffer/gotmoneyappui5/controller/BaseController',
  'com/mlauffer/gotmoneyappui5/model/formatter'
], function(MessageBox, MessageToast, Filter, FilterOperator, Fragment, ValueState, BaseController, formatter) {
  'use strict';

  return BaseController.extend('com.mlauffer.gotmoneyappui5.controller.Home', {
    formatter: formatter,

    onInit: function() {
      try {
        this.getView().addEventDelegate({
          onAfterShow: function() {
            this.checkSession();
            this._getTitleTotalItems();
          }
        }, this);

      } catch (e) {
        this.saveLog('E', e.message);
        MessageBox.error(e.message);
      }
    },

    onAccount: function() {
      this.vibrate();
      this.getRouter().navTo('accountList');
    },

    onCategory: function() {
      this.vibrate();
      this.getRouter().navTo('categoryList');
    },

    onTransaction: function() {
      this.vibrate();
      this.getRouter().navTo('transactionList');
    },

    onTransactionOverdue: function() {
      this.vibrate();
      this.getRouter().navTo('transactionOverdue');
    },

    onReport: function() {
      //TODO:
      this.vibrate();
    },

    onProfile: function() {
      this.vibrate();
      this.getRouter().navTo('profile');
    },


    _getTitleTotalItems: function() {
      try {
        var oView = this.getView();
        var oData = oView.getModel().getData();

        if (oData) {
          oView.byId('accountTile').setValue(oData.User.Account.length);
          oView.byId('categoryTile').setValue(oData.User.Category.length);
          oView.byId('transactionOverdueTile').setValue(this._getTransactionOverdueItems());
        }
      } catch (e) {
        console.dir(e);
      }
    },

    _getTransactionOverdueItems: function() {
      var overdue = this.getView().getModel().getData().User.Transaction.filter(function(item) {
        return item.idstatus === 0 && item.duedate < new Date().toJSON();
      });
      return overdue.length;
    }
  });
});
