sap.ui.define([
  'sap/m/MessageBox',
  'sap/m/MessageToast',
  'sap/ui/model/json/JSONModel',
  'com/mlauffer/gotmoneyappui5/controller/BaseController',
  'com/mlauffer/gotmoneyappui5/model/formatter',
  'com/mlauffer/gotmoneyappui5/model/ObjectFactory',
  'openui5/validator/Validator'
], function(MessageBox, MessageToast, JSONModel, BaseController, formatter, ObjectFactory, Validator) {
  'use strict';

  return BaseController.extend('com.mlauffer.gotmoneyappui5.controller.Account', {
    formatter: formatter,

    onInit: function() {
      try {
        this.getView().setModel(new JSONModel(), 'account');
        const oRouter = this.getRouter();
        oRouter.getRoute('account').attachMatched(this._onRouteMatched, this);
        oRouter.getRoute('accountNew').attachMatched(this._onRouteMatchedNew, this);
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


    onDelete: function(oEvent) {
      this.vibrate();
      const that = this;
      const oContext = oEvent.getSource().getBindingContext();
      MessageBox.confirm(that.getResourceBundle().getText('Delete.message'), function(sAction) {
        if (MessageBox.Action.OK === sAction) {
          that._delete(oContext);
        }
      }, that.getResourceBundle().getText('Delete.title'));
    },


    onChangeType: function() {
      this._setInvoicedayVisibility();
    },

    _onRouteMatched: function(oEvent) {
      const sObjectPath = '/User/Account/' + oEvent.getParameter('arguments').accountId;
      this._bindView(sObjectPath);
      this._setInvoicedayVisibility();
    },


    _onRouteMatchedNew: function() {
      this.getView().getModel('account').setData(ObjectFactory.buildAccount());
      //this.getView().getModel("account").refresh(true);
      this._setInvoicedayVisibility();
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


    _saveNew: function() {
      const mPayload = this._getPayload();
      mPayload.idaccount = Date.now();
      return this.getView().getModel().create('account', null, JSON.stringify(mPayload))
        .then(function() {
          this._newDone(mPayload);
        }.bind(this))
        .catch(this._backendFail.bind(this));
    },


    _saveEdit: function(oContext) {
      const mPayload = this._getPayload();
      mPayload.idaccount = oContext.getProperty('idaccount');
      return this.getView().getModel().update('account/' + mPayload.idaccount, null, JSON.stringify(mPayload))
        .then(function() {
          this._editDone(mPayload, oContext);
        }.bind(this))
        .catch(this._backendFail.bind(this));
    },


    _delete: function(oContext) {
      this.getView().setBusy(true);
      return this.getView().getModel().delete('account/' + oContext.getProperty('idaccount'), oContext.getPath())
        .then(function() {
          this._deleteDone(oContext);
        }.bind(this))
        .catch(this._backendFail.bind(this));
    },


    _newDone: function(mPayload) {
      try {
        this.getView().getModel().getProperty('/User/Account').push(mPayload);
        //this.getView().getModel().getData().User.Account.push(mPayload);
        this.onFinishBackendOperation();
        MessageToast.show(this.getResourceBundle().getText('Success.save'));

      } catch (e) {
        this.saveLog('E', e.message);
        MessageBox.error(e.message);
      }
    },


    _editDone: function(mPayload, oContext) {
      try {
        const oModel = this.getView().getModel();
        oModel.setProperty('idtype', mPayload.idtype, oContext);
        oModel.setProperty('description', mPayload.description, oContext);
        //TODO: mPayload.balance = 1;
        oModel.setProperty('openingdate', mPayload.openingdate, oContext);
        oModel.setProperty('creditlimit', mPayload.creditlimit, oContext);
        oModel.setProperty('duedate', mPayload.duedate, oContext);
        this.onFinishBackendOperation();
        MessageToast.show(this.getResourceBundle().getText('Success.save'));

      } catch (e) {
        this.saveLog('E', e.message);
        MessageBox.error(e.message);
      }
    },


    _deleteDone: function(oContext) {
      try {
        this.onFinishBackendOperation();
        MessageToast.show(this.getResourceBundle().getText('Success.delete'));

      } catch (e) {
        this.saveLog('E', e.message);
        MessageBox.error(e.message);
      }
    },


    _getPayload: function() {
      const oView = this.getView();
      const mPayload = ObjectFactory.buildAccount();
      mPayload.idtype = parseInt(oView.byId('idtype').getSelectedKey(), 10);
      mPayload.description = oView.byId('description').getValue();
      mPayload.creditlimit = parseFloat(oView.byId('creditlimit').getValue());
      mPayload.balance = 0;
      mPayload.openingdate = oView.byId('opendate').getDateValue();
      mPayload.duedate = parseInt(oView.byId('invoiceday').getValue(), 10);
      if (mPayload.openingdate) {
        mPayload.openingdate.setHours(12); //Workaround for date location, avoid D -1
      }
      if (!Number.isFinite(mPayload.duedate) || mPayload.duedate === 0) {
        mPayload.duedate = null;
      }
      return mPayload;
    },


    _setInvoicedayVisibility: function() {
      const bShow = (this.getView().byId('idtype').getSelectedKey() === '2');
      this.getView().byId('invoiceday').setVisible(bShow);
      this.getView().byId('invoicedayLabel').setVisible(bShow);
    },


    _initValidator: function() {
      //This is the schema with all rules used to validate the UI5 Controls
      const validationSchema = {
        properties: {
          iduser: {
            type: 'integer',
            maximum: 99999999999999999999
          },
          idaccount: {
            type: 'integer',
            maximum: 99999999999999999999
          },
          idtype: {
            type: 'integer',
            maximum: 99999999999999999999
          },
          description: {
            type: 'string',
            minLength: 3,
            maxLength: 50
          },
          creditlimit: {
            type: 'number',
            default: 0,
            minimum: 0,
            maximum: 99999999999999999999
          },
          balance: {
            type: 'number',
            default: 0,
            maximum: 99999999999999999999
          },
          opendate: {
            format: 'date'
          },
          duedate: {
            type: ['integer', 'null'],
            maximum: 31
          }
        }
      };

      //Initialize the OpenUI5 Validator object
      this._validator = new Validator(this.getView(), validationSchema);
    },

    _onValidationSuccess: function(context) {
      this.getMessagePopover().close();
      this.getView().setBusy(true);
      if (this.getView().getViewName() === 'com.mlauffer.gotmoneyappui5.view.Account') {
        this._saveEdit(context);
      } else {
        this._saveNew();
      }
    },

    _onValidationError: function(errors) {
      this.getOwnerComponent().oMessageManager.addMessages(errors);
    },

    _clearValueState: function() {
      const controls = ['idtype', 'description', 'creditlimit', 'balance', 'opendate', 'duedate'];
      this.clearValueState(controls);
    }
  });
});
