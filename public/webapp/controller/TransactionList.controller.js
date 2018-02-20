sap.ui.define([
  'sap/m/MessageBox',
  'sap/ui/core/ValueState',
  'sap/ui/model/Filter',
  'sap/ui/model/FilterOperator',
  'sap/ui/unified/DateRange',
  'com/mlauffer/gotmoneyappui5/controller/BaseController',
  'com/mlauffer/gotmoneyappui5/model/formatter'
], function(MessageBox, ValueState, Filter, FilterOperator, DateRange, BaseController, formatter) {
  'use strict';

  return BaseController.extend('com.mlauffer.gotmoneyappui5.controller.TransactionList', {
    formatter: formatter,

    onInit: function() {
      try {
        this.getRouter().getRoute('transactionOverdue').attachMatched(this._onRouteOverdue, this);

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

    onAfterRendering: function() {
      if (this.getView().getViewName() === 'com.mlauffer.gotmoneyappui5.view.TransactionList') {
        var oDataRange = new DateRange({ startDate: new Date()});
        this.getView().byId('transactionTable').getBinding('items').filter([]);
        this.getView().byId('calendar').addSelectedDate(oDataRange);
        this._setFilterByYearMonth(new Date());
      }
    },


    /**
     * Event handler when a table item gets pressed
     * @param {sap.ui.base.Event} oEvent the table selectionChange event
     * @public
     */
    onItemPress: function(oEvent) {
      this.vibrate();
      this.getRouter().navTo('transaction', {
        transactionId: this.extractIdFromPath(oEvent.getSource().getBindingContext().getPath())
      });
    },


    onAddNew: function() {
      this.vibrate();
      this.getRouter().navTo('transactionNew');
    },


    onSelectDate: function(oEvent) {
      this.vibrate();
      this._setFilterByYearMonth(oEvent.getSource().getSelectedDates()[0].getStartDate());
    },


    _onRouteOverdue: function() {
      this._filterOverdue();
    },


    /**
     * Triggered by the table's 'updateStarted' event: after new table
     * data is available, this handler method updates the table counter.
     * This should only happen if the update was successful, which is
     * why this handler is attached to 'updateFinished' and not to the
     * table's list binding's 'dataReceived' method.
     * @param {sap.ui.base.Event} oEvent the update finished event
     * @public
     */
    onUpdateStarted: function(oEvent) {
      oEvent.getSource().setBusy(true);
    },


    /**
     * Triggered by the table's 'updateFinished' event: after new table
     * data is available, this handler method updates the table counter.
     * This should only happen if the update was successful, which is
     * why this handler is attached to 'updateFinished' and not to the
     * table's list binding's 'dataReceived' method.
     * @param {sap.ui.base.Event} oEvent the update finished event
     * @public
     */
    onUpdateFinished: function(oEvent) {
      this._setTableTitle(oEvent.getParameter('total') || 0);
      this._calculateTotal();
      oEvent.getSource().setBusy(false);
    },

    _setTableTitle: function(totalItems) {
      this.getView().byId('countTitle').setText(this.getResourceBundle().getText('Transaction.count', [totalItems]));
    },

    _calculateTotal: function() {
      var debit = 0;
      var credit = 0;
      this.getView().byId('transactionTable').getItems().forEach(function(item) {
        var context = item.getBindingContext();
        var amount = parseFloat(context.getProperty('amount'));
        if (context.getProperty('type') === 'D') {
          debit += amount;
        } else {
          credit += amount;
        }
      });
      var total = parseFloat(credit - debit).toFixed(2);
      var state = (total < 0) ? ValueState.Error : ValueState.Success;
      this.getView().byId('totalAmount').setText('$ ' + total);
      this.getView().byId('totalAmount').setState(state);
    },

    _filterOverdue: function() {
      var aFilters = [];
      var table = this.getView().byId('transactionTable');
      table.setBusy(true);
      aFilters.push(new Filter('duedate', FilterOperator.LT, new Date().toJSON()));
      aFilters.push(new Filter('idstatus', FilterOperator.EQ, 0));
      table.getBinding('items').filter(aFilters);
      table.setBusy(false);
    },

    _setFilterByYearMonth: function(oDateFrom) {
      var aFilters = [];
      var table = this.getView().byId('transactionTable');
      table.setBusy(true);
      oDateFrom = new Date(oDateFrom.getFullYear(), (oDateFrom.getMonth()), 1);
      var oDateTo = new Date(oDateFrom.getFullYear(), (oDateFrom.getMonth() + 1), 0);
      aFilters.push(new Filter('duedate', FilterOperator.BT, oDateFrom.toJSON(), oDateTo.toJSON()));
      table.getBinding('items').filter(aFilters);
      table.setBusy(false);
    }
  });
});
