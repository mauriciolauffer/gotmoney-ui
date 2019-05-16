sap.ui.define([
  'sap/m/MessageBox',
  'sap/m/MessageToast',
  'sap/ui/model/json/JSONModel',
  'sap/ui/core/ValueState',
  'com/mlauffer/gotmoneyappui5/controller/BaseController',
  'com/mlauffer/gotmoneyappui5/model/ObjectFactory',
  'com/mlauffer/gotmoneyappui5/model/formatter',
  'openui5/validator/Validator'
], function(MessageBox, MessageToast, JSONModel, ValueState, BaseController,
            ObjectFactory, formatter, Validator) {
  'use strict';

  return BaseController.extend('com.mlauffer.gotmoneyappui5.controller.User', {
    formatter: formatter,

    onInit: function() {
      try {
        this.getView().setModel(new JSONModel(), 'user');
        const oRouter = this.getRouter();
        oRouter.getRoute('profile').attachMatched(this._onRouteMatched, this);
        //oRouter.getRoute('signup').attachMatched(this._onRouteMatchedNew, this);
        this._initValidator();
        this.getView().addEventDelegate({
          onBeforeShow: function() {
            this._clearValueState();
          },
          onAfterShow: function() {
            this.checkSession();
          }
        }, this);

      } catch (e) {
        this.saveLog('E', e.message);
        MessageBox.error(e.message);
      }
    },


    onSave: function(oEvent) {
      //Validates UI5 Controls against the validation schema set before
      this.vibrate();
      this.getOwnerComponent().oMessageManager.removeAllMessages();
      if (this._validator.validate()) {
        this._onValidationSuccess(oEvent.getSource().getBindingContext());
      } else {
        this._onValidationError(this._validator.getErrors());
      }
    },


    _onRouteMatched: function() {
      const sObjectPath = '/User/';
      this._bindView(sObjectPath);
    },


    _onRouteMatchedNew: function() {
      this.getView().getModel('user').setData(ObjectFactory.buildUser());
    },


    _bindView: function(sPath) {
      const oView = this.getView();
      oView.unbindElement();
      oView.bindElement({
        path: sPath,
        events: {
          change: this._onBindingChange.bind(this),
          dataRequested: function(oEvent) {
            oView.setBusy(true);
          },
          dataReceived: function(oEvent) {
            oView.setBusy(false);
          }
        }
      });
    },


    _onBindingChange: function() {
      // No data for the binding
      if (!this.getView().getBindingContext()) {
        this.getRouter().getTargets().display('notFound');
      }
    },


    _saveEdit: function(oContext) {
      const mPayload = this._getPayload();
      mPayload.iduser = oContext.getProperty('iduser');
      if (!mPayload.passwd) {
        delete mPayload.passwd;
      }
      return this.getView().getModel().update('user/' + mPayload.iduser, null, JSON.stringify(mPayload))
        .then(function() {
          this._editDone(mPayload, oContext);
        }.bind(this))
        .catch(this._backendFail.bind(this));
    },


    _editDone: function(mPayload, oContext) {
      try {
        const oModel = this.getView().getModel();
        oModel.setProperty('name', mPayload.name, oContext);
        oModel.setProperty('alert', mPayload.alert, oContext);
        this.onFinishBackendOperation();
        MessageToast.show(this.getResourceBundle().getText('Success.save'));

      } catch (e) {
        this.saveLog('E', e.message);
        MessageBox.error(e.message);
      }
    },


    _getPayload: function() {
      const oView = this.getView();
      const mPayload = ObjectFactory.buildUser();
      mPayload.email = oView.byId('email').getValue();
      mPayload.passwdold = oView.byId('pwdOld').getValue();
      mPayload.passwd = oView.byId('pwd').getValue();
      mPayload.name = oView.byId('name').getValue();
      mPayload.alert = false;
      return mPayload;
    },


    _initValidator: function() {
      //This is the schema with all rules used to validate the UI5 Controls
      const validationSchema = {
        properties: {
          iduser: {
            type: 'integer',
            maximum: 99999999999999999999
          },
          name: {
            type: 'string',
            minLength: 3,
            maxLength: 80
          },
          email: {
            type: 'string',
            format: 'email',
            minLength: 3,
            maxLength: 60
          },
          alert: {
            type: 'boolean'
          },
          pwdOld: {
            type: 'string',
            maxLength: 100
          },
          pwd: {
            type: 'string',
            maxLength: 100
          },
          pwdRepeat: {
            type: 'string',
            const: {'$data': '1/pwd'}
          }
        }
      };

      //Initialize the OpenUI5 Validator object
      this._validator = new Validator(this.getView(), validationSchema);
    },

    _onValidationSuccess: function(context) {
      this.getMessagePopover().close();
      this.getView().setBusy(true);
      this._saveEdit(context);
    },

    _onValidationError: function(errors) {
      this.getOwnerComponent().oMessageManager.addMessages(errors);
    },

    _clearValueState: function() {
      const controls = ['name', 'email'];
      this.clearValueState(controls);
    }
  });
});
