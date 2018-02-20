sap.ui.define([
  'jquery.sap.global',
  'sap/m/MessageBox',
  'sap/m/MessageToast',
  'sap/ui/model/json/JSONModel',
  'com/mlauffer/gotmoneyappui5/controller/BaseController',
  'com/mlauffer/gotmoneyappui5/model/ObjectFactory',
  'com/mlauffer/gotmoneyappui5/model/formatter',
  'openui5/validator/Validator'
], function(jQuery, MessageBox, MessageToast, JSONModel, BaseController, ObjectFactory, formatter, Validator) {
  'use strict';

  return BaseController.extend('com.mlauffer.gotmoneyappui5.controller.Transaction', {
    formatter: formatter,

    onInit: function() {
      try {
        this.getView().setModel(new JSONModel(), 'transaction');
        var oRouter = this.getRouter();
        oRouter.getRoute('transaction').attachMatched(this._onRouteMatched, this);
        oRouter.getRoute('transactionNew').attachMatched(this._onRouteMatchedNew, this);
        this._initValidator();
        this._initValidatorMultiple();
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
      var isValid = false;
      var errors = null;
      if (this.getView().byId('occurrence').getSelectedKey() === 'U') {
        isValid = this._validator.validate();
        errors = this._validator.getErrors();
      } else {
        isValid = this._validatorMultiple.validate();
        errors = this._validatorMultiple.getErrors();
      }
      if (isValid) {
        this._onValidationSuccess(oEvent.getSource().getBindingContext());
      } else {
        this._onValidationError(errors);
      }
    },


    onDelete: function(oEvent) {
      this.vibrate();
      var that = this;
      var oContext = oEvent.getSource().getBindingContext();
      MessageBox.confirm(that.getResourceBundle().getText('Delete.message'), function(sAction) {
        if (MessageBox.Action.OK === sAction) {
          that._delete(oContext);
        }
      }, that.getResourceBundle().getText('Delete.title'));
    },

    onChangeOccur: function() {
      this._setOccurrenceVisibility();
    },


    _onRouteMatched: function(oEvent) {
      var sObjectPath = '/User/Transaction/' + oEvent.getParameter('arguments').transactionId;
      this._bindView(sObjectPath);
    },


    _onRouteMatchedNew: function() {
      this.getView().getModel('transaction').setData(ObjectFactory.buildTransaction());
      this._setOccurrenceVisibility();
    },


    _bindView: function(sPath) {
      var oView = this.getView();
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
      //TODO: Validation
      var oView = this.getView();
      if (oView.byId('occurrence').getSelectedKey() !== 'U' && !oView.byId('startdate').getDateValue()) {
        return;
      }
      var that = this;
      var mPayload = this._createRepetition(oView.byId('occurrence').getSelectedKey());
      var data = { data: mPayload };

      jQuery.ajax({
        url: '/api/transaction',
        data: JSON.stringify(data),
        method: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        }
      })
        .done(function() {
          that._newDone(mPayload);
        })
        .fail(jQuery.proxy(that._ajaxFail, this));
    },


    _saveEdit: function(oContext) {
      //TODO: Validation
      var that = this;
      var mPayload = this._getPayload();
      mPayload.idtransaction = oContext.getProperty('idtransaction');

      jQuery.ajax({
        url: '/api/transaction/' + mPayload.idtransaction,
        data: JSON.stringify(mPayload),
        method: 'PUT',
        contentType: 'application/json',
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        }
      })
        .done(function() {
          that._editDone(mPayload, oContext);
        })
        .fail(jQuery.proxy(that._ajaxFail, this));
    },


    _delete: function(oContext) {
      this.getView().setBusy(true);
      var that = this;
      jQuery.ajax({
        url: '/api/transaction/' + oContext.getProperty('idtransaction'),
        method: 'DELETE',
        contentType: 'application/json',
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        }
      })
        .done(function() {
          that._deleteDone(oContext);
        })
        .fail(jQuery.proxy(this._ajaxFail, this));
    },


    _newDone: function(payload) {
      try {
        var oView = this.getView();
        jQuery.each(payload, function(i, item) {
          oView.getModel().getData().User.Transaction.push(item);
        });
        this.getView().getModel().updateBindings(true);
        this.onFinishBackendOperation();
        MessageToast.show(this.getResourceBundle().getText('Success.save'));

      } catch (e) {
        this.saveLog('E', e.message);
        MessageBox.error(e.message);
      }
    },


    _editDone: function(mPayload, oContext) {
      try {
        var oModel = this.getView().getModel();
        oModel.setProperty('idaccount', mPayload.idaccount, oContext);
        oModel.setProperty('type', mPayload.type, oContext);
        oModel.setProperty('idstatus', mPayload.idstatus, oContext);
        oModel.setProperty('description', mPayload.description, oContext);
        oModel.setProperty('amount', mPayload.amount, oContext);
        oModel.setProperty('startdate', mPayload.startdate, oContext);
        oModel.setProperty('duedate', mPayload.duedate, oContext);
        oModel.setProperty('tag', mPayload.tag, oContext);
        this.onFinishBackendOperation();
        MessageToast.show(this.getResourceBundle().getText('Success.save'));

      } catch (e) {
        this.saveLog('E', e.message);
        MessageBox.error(e.message);
      }
    },


    _deleteDone: function(oContext) {
      try {
        this.getView().getModel().getData().User.Transaction.splice(this.extractIdFromPath(oContext.getPath()), 1);
        this.onFinishBackendOperation();
        MessageToast.show(this.getResourceBundle().getText('Success.delete'));

      } catch (e) {
        this.saveLog('E', e.message);
        MessageBox.error(e.message);
      }
    },


    _getPayload: function() {
      var oView = this.getView();
      var mPayload = ObjectFactory.buildTransaction();
      //idlancamento : null,
      //mPayload.idparent = null;
      mPayload.idaccount = parseInt(oView.byId('idaccount').getSelectedKey(), 10);
      mPayload.idstatus = (oView.byId('idstatus').getSelected()) ? 1 : 0;
      mPayload.description = oView.byId('description').getValue();
      mPayload.instalment = oView.byId('split').getValue();
      mPayload.amount = parseFloat(parseFloat(oView.byId('amount').getValue()).toFixed(2));
      mPayload.type = oView.byId('type').getSelectedKey();
      mPayload.startdate = oView.byId('startdate').getDateValue();
      mPayload.duedate = oView.byId('duedate').getDateValue();
      mPayload.tag = this._getTag();
      if (mPayload.startdate) {
        mPayload.startdate.setHours(12); //Workaround for date location, avoid D -1
      }
      if (mPayload.duedate) {
        mPayload.duedate.setHours(12); //Workaround for date location, avoid D -1
      }
      return mPayload;
    },

    _getTag: function() {
      var tag = '';
      var categories = this.getView().byId('category').getSelectedKeys().filter(function(item) { return (item); });
      if (categories.length > 0) {
        tag = '#' + categories.join(', #');
      }
      return tag;
    },

    _setOccurrenceVisibility: function() {
      var oView = this.getView();
      var bShow = (oView.byId('occurrence').getSelectedKey() !== 'U');

      // Show?
      oView.byId('startdate').setVisible(bShow);
      oView.byId('startdateLabel').setVisible(bShow);
      oView.byId('split').setVisible(bShow);
      oView.byId('splitLabel').setVisible(bShow);

      // Do not show?
      bShow = (!bShow);
      oView.byId('duedate').setVisible(bShow);
      oView.byId('duedateLabel').setVisible(bShow);
    },


    _createRepetition: function(sOccurrence) {
      var oView = this.getView();
      //var oStartDate = oView.byId("startdate").getDateValue() || oView.byId("duedate").getDateValue();
      var sSplit = oView.byId('split').getValue() || 1;
      var sLastId;
      var aPayloads = [];
      var mPayloadReference = this._getPayload();
      mPayloadReference.startdate = mPayloadReference.startdate || mPayloadReference.duedate;
      mPayloadReference.idtransaction = jQuery.now();

      for (var i = 0; i < sSplit; i++) {
        var mPayload = jQuery.extend(true, {}, mPayloadReference);
        mPayload.duedate = this._getRepetitionDueDate(sOccurrence, mPayload.startdate, i);

        //Set ID
        do {
          mPayload.idtransaction = jQuery.now();
        }
        while (sLastId === mPayload.idtransaction);

        sLastId = mPayload.idtransaction;

        //Set parent ID
        if (i > 0) {
          mPayload.idparent = mPayloadReference.idtransaction;
        } else {
          //Get parent ID
          mPayloadReference.idtransaction = mPayload.idtransaction;
        }

        mPayload.instalment = (i + 1) + '' + '/' + '' + sSplit;
        aPayloads.push(mPayload);
      }
      return aPayloads;
    },

    _getRepetitionDueDate: function(sOccurrence, startDate, index) {
      var dueDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      switch (sOccurrence) {
        case 'U': //Once
          break;

        case 'D': //Dayly
          dueDate.setDate(startDate.getDate() + index);
          break;

        case 'W': //Weekly
          dueDate.setDate(startDate.getDate() + (index * 7));
          break;

        case 'M': //Monthly
          dueDate.setMonth(startDate.getMonth() + index);
          break;

        case 'Y': //Annualy
          dueDate.setFullYear(startDate.getFullYear() + index);
          break;

        default:
          break;
      }
      dueDate.setHours(12); //Workaround for date location, avoid D -1
      return dueDate.toJSON();
    },


    _initValidator: function() {
      //This is the schema with all rules used to validate the UI5 Controls
      var validationSchema = {
        properties: {
          iduser: {
            type: 'integer',
            maximum: 99999999999999999999
          },
          idtransaction: {
            type: 'integer',
            maximum: 99999999999999999999
          },
          idaccount: {
            type: 'integer',
            maximum: 99999999999999999999
          },
          idparent: {
            type: ['integer', 'null'],
            maximum: 99999999999999999999
          },
          idstatus: {
            type: 'integer',
            maximum: 9
          },
          description: {
            type: 'string',
            minLength: 3,
            maxLength: 100
          },
          amount: {
            type: 'number',
            default: 0,
            minimum: 0,
            maximum: 99999999999999999999
          },
          type: {
            type: 'string',
            maxLength: 1,
            enum: ['C', 'D']
          },
          duedate: {
            format: 'date'
          },
          tag: {
            type: ['string', 'null'],
            maxLength: 255
          }
        }
      };

      //Initialize the OpenUI5 Validator object
      this._validator = new Validator(this.getView(), validationSchema);
    },


    _initValidatorMultiple: function() {
    //This is the schema with all rules used to validate the UI5 Controls
      var validationSchema = {
        properties: {
          iduser: {
            type: 'integer',
            maximum: 99999999999999999999
          },
          idtransaction: {
            type: 'integer',
            maximum: 99999999999999999999
          },
          idaccount: {
            type: 'integer',
            maximum: 99999999999999999999
          },
          idparent: {
            type: ['integer', 'null'],
            maximum: 99999999999999999999
          },
          idstatus: {
            type: 'integer',
            maximum: 9
          },
          description: {
            type: 'string',
            minLength: 3,
            maxLength: 100
          },
          split: {
            type: 'number',
            minimum: 2
          },
          amount: {
            type: 'number',
            default: 0,
            minimum: 0,
            maximum: 99999999999999999999
          },
          type: {
            type: 'string',
            maxLength: 1,
            enum: ['C', 'D']
          },
          startdate: {
            format: 'date'
          },
          tag: {
            type: ['string', 'null'],
            maxLength: 255
          }
        }
      };

      //Initialize the OpenUI5 Validator object
      this._validatorMultiple = new Validator(this.getView(), validationSchema);
    },

    _onValidationSuccess: function(context) {
      this.getMessagePopover().close();
      this.getView().setBusy(true);
      if (this.getView().getViewName() === 'com.mlauffer.gotmoneyappui5.view.Transaction') {
        this._saveEdit(context);
      } else {
        this._saveNew();
      }
      this.getView().setBusy(false);
    },

    _onValidationError: function(errors) {
      this.getOwnerComponent().oMessageManager.addMessages(errors);
    },

    _clearValueState: function() {
      var controls = ['description', 'amount', 'type', 'duedate', 'startdate', 'tag', 'split'];
      this.clearValueState(controls);
    }
  });
});
