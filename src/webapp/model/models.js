sap.ui.define([
  'sap/ui/model/BindingMode',
  'sap/ui/model/json/JSONModel',
  'sap/ui/Device',
  'openui5/model/json/crud/CRUDModel'
], function(BindingMode, JSONModel, Device, CRUDModel) {
  'use strict';

  return {
    createDeviceModel: function() {
      var oModel = new JSONModel(Device);
      oModel.setDefaultBindingMode(BindingMode.OneWay);
      return oModel;
    },

    createDefaultModel: function() {
      const model = new CRUDModel(window.GOTMONEY.BACKEND_API_HOSTNAME + '/api/');
      model.setDefaultBindingMode(BindingMode.OneWay);
      model.setSizeLimit(1000);
      model.setData({
        AccountType: [],
        User: {
          Account: [],
          Category: [],
          Transaction: []
        }
      });
      model.setFetchParameters({
        cache: 'no-cache',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return model;
    }
  };
});
