sap.ui.define([
  'sap/ui/model/BindingMode',
  'sap/ui/model/json/JSONModel',
  'sap/ui/Device'
], function(BindingMode, JSONModel, Device) {
  'use strict';

  return {
    createDeviceModel: function() {
      var oModel = new JSONModel(Device);
      oModel.setDefaultBindingMode(BindingMode.OneWay);
      return oModel;
    },

    editDefaultModel: function(model) {
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
    }
  };
});
