sap.ui.define([
  'sap/ui/core/ValueState',
  'sap/ui/core/format/DateFormat'
], function(ValueState, DateFormat) {
  'use strict';

  return {
    /**
     * Set calendar to show months from Jan to Dec
     *
     * @public
     * @returns {date} JavaScript Date Object
     */
    getCalendarStartDate: function() {
      var year = new Date().getFullYear();
      return new Date(year, 0, 1);
    },

    numberState: function(iValue) {
      return (iValue < 0) ? ValueState.Error : ValueState.Success;
    },

    creditDebit: function(sValue) {
      return (sValue === 'D') ? ValueState.Error : ValueState.Success;
    },

    paymentIcon: function(sValue) {
      return ((sValue === 1 || sValue === true)) ? 'sap-icon://accept' : 'sap-icon://decline';
    },

    paymentStatus: function(sValue) {
      return ((sValue === 1 || sValue === true)) ? ValueState.Success : ValueState.Error;
    },

    paymentTooltip: function(sValue) {
      return ((sValue === 1 || sValue === true)) ?
        this.getResourceBundle().getText('Transaction.status.paid') :
        this.getResourceBundle().getText('Transaction.status.awaiting');
    },

    accountTypeIcon: function(sId) {
      switch (sId) {
        // Cash
        case 1:
          return 'sap-icon://money-bills';
        // Credit Card
        case 2:
          return 'sap-icon://credit-card';
        // Bank Account
        case 3:
          return 'sap-icon://loan';
        // Savings
        case 4:
          return 'sap-icon://waiver';
        default:
          return 'sap-icon://money-bills';
      }
    },

    accountTypeName: function(sId) {
      return this.getResourceBundle().getText('Account.Type.' + sId);
    },

    accountName: function(sValue) {
      var sDesc = sValue;
      try {
        var oModel = this.getView().getModel();
        if (oModel) {
          var nItems = oModel.getData().User.Account.length;
          var aAccounts = oModel.getData().User.Account;
          for (var i = 0; i < nItems; i++) {
            if (aAccounts[i].idaccount === sValue) {
              sDesc = aAccounts[i].description;
              break;
            }
          }
        }
      } catch (e) {
        console.dir(e);
      }
      return sDesc;
    },

    numeralBoolean: function(number) {
      return (number === 1);
    },

    dateMySQLFormat: function(dateJS) {
      if (dateJS) {
        var oDateFormat = DateFormat.getDateTimeInstance({pattern: 'yyyy-MM-dd'});
        return oDateFormat.format(new Date(dateJS));
      } else {
        return dateJS;
      }
    },

    dateFromJSON: function(dateJSON) {
      return new Date(dateJSON);
    },

    convertIdStatusToBoolean: function(sIdStatus) {
      return (sIdStatus === 1 || sIdStatus === true);
    }
  };
});
