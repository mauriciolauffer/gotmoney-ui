sap.ui.define([
  'jquery.sap.global',
  'sap/ui/core/message/ControlMessageProcessor',
  'sap/ui/core/UIComponent',
  'sap/ui/Device',
  'com/mlauffer/gotmoneyappui5/model/models'
], function(jQuery, ControlMessageProcessor, UIComponent, Device, Models) {
  'use strict';

  return UIComponent.extend('com.mlauffer.gotmoneyappui5.Component', {
    /**
     * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
     * @public
     * @override
     */
    init: function() {
      UIComponent.prototype.init.apply(this, arguments);
      this.setModels();
      this.getRouter().initialize();
    },


    /**
     * The component is destroyed by UI5 automatically.
     * @public
     * @override
     */
    destroy: function() {
      this._resourceBundle.destroy();
      UIComponent.prototype.destroy.apply(this, arguments);
    },


    setModels: function() {
      this.setModel(Models.createDefaultModel());
      this.setModel(Models.createDeviceModel(), 'device');
      this.oMessageManager = sap.ui.getCore().getMessageManager();
      this.oMessageManager.registerMessageProcessor(new ControlMessageProcessor());
      this.setModel(this.oMessageManager.getMessageModel(), 'message');
    }
  });
});
