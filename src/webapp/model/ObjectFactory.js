sap.ui.define([], function() {
  'use strict';

  return {
    /**
     * Factory method for User
     *
     * @public
     * @returns {object} User
     */
    buildUser: function() {
      return {
        iduser: null,
        email: null,
        name: null,
        gender: null,
        birthdate: null,
        alert: null,
        facebook: null,
        google: null,
        twitter: null,
        passwd: null,
        lastchange: null,
        lastsync: null
      };
    },

    /**
     * Factory method for Category
     *
     * @public
     * @returns {object} Category
     */
    buildCategory: function() {
      return {
        idcategory: null,
        description: null,
        origin: 'W',
        lastchange: null
      };
    },

    /**
     * Factory method for Account
     *
     * @public
     * @returns {object} Account
     */
    buildAccount: function() {
      return {
        idaccount: null,
        idtype: null,
        description: null,
        creditlimit: null,
        balance: null,
        openingdate: null,
        duedate: null,
        origin: 'W',
        lastchange: null
      };
    },

    /**
     * Factory method for Account
     *
     * @public
     * @returns {object} Account
     */
    buildTransaction: function() {
      return {
        idtransaction: null,
        idaccount: null,
        //idparent: null,
        idstatus: null,
        description: null,
        instalment: null,
        amount: null,
        type: null,
        startdate: null,
        duedate: null,
        tag: null,
        origin: 'W',
        lastchange: null
      };
    }
  };
});
