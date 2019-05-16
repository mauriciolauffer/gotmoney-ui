sap.ui.define([
  'sap/ui/core/message/ControlMessageProcessor',
  'sap/ui/core/UIComponent',
  'sap/ui/Device',
  'com/mlauffer/gotmoneyappui5/model/models'
], function(ControlMessageProcessor, UIComponent, Device, Models) {
  'use strict';

  return UIComponent.extend('com.mlauffer.gotmoneyappui5.Component', {
    /**
     * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
     * @public
     * @override
     */
    init: function() {
      this.setPolyfills();
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
    },

    setPolyfills: function() {
      if (Number.isFinite === undefined) {
        Number.isFinite = function(value) {
          return typeof value === 'number' && isFinite(value);
        };
      }
    }
  });
});
