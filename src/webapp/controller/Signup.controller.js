sap.ui.define([
  'jquery.sap.global',
  'sap/m/MessageBox',
  'sap/m/MessageToast',
  'sap/ui/model/json/JSONModel',
  'sap/ui/core/message/ControlMessageProcessor',
  'sap/ui/core/ValueState',
  'com/mlauffer/gotmoneyappui5/controller/BaseController',
  'com/mlauffer/gotmoneyappui5/controller/FacebookLogin',
  'com/mlauffer/gotmoneyappui5/controller/GoogleLogin',
  'com/mlauffer/gotmoneyappui5/model/ObjectFactory',
  'com/mlauffer/gotmoneyappui5/model/formatter',
  'openui5/validator/Validator'
], function(jQuery, MessageBox, MessageToast, JSONModel, ControlMessageProcessor,
  ValueState, BaseController, FacebookLogin, GoogleLogin, ObjectFactory, formatter, Validator) {
  'use strict';

  return BaseController.extend('com.mlauffer.gotmoneyappui5.controller.Signup', {
    formatter: formatter,

    onInit: function() {
      try {
        var that = this;
        this.getView().setModel(new JSONModel(), 'user');
        this.getRouter().getRoute('signup').attachMatched(this._onRouteMatchedNew, this);
        this.getOwnerComponent().oMessageManager.registerObject(this.getView(), true);
        this._initValidator();
        this.getView().addEventDelegate({
          onBeforeShow: function() {
            this._clearValueState();
          },
          onAfterShow: function() {
            var oGoogleLogin = new GoogleLogin();
            oGoogleLogin.renderButton(that, that.getView().byId('btGoogle').getDomRef().id);
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

    onFacebookLogin: function() {
      var oFacebookLogin = new FacebookLogin();
      oFacebookLogin.login(this);
    },


    _onRouteMatched: function() {
      var sObjectPath = '/User/';
      this._bindView(sObjectPath);
    },


    _onRouteMatchedNew: function() {
      this.getView().getModel('user').setData(ObjectFactory.buildUser());
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


    _loginDone: function() {
      this.setUserLogged(true);
      this._loadBackendData();
      this.getOwnerComponent().byId('rootApp').getController()._toogleButtonsVisible();
      this.getView().setBusy(false);
      this.getRouter().navTo('home');
      MessageToast.show(this.getResourceBundle().getText('Success.login'));
    },


    _saveNew: function() {
      var that = this;
      var mPayload = this._getPayload();
      mPayload.iduser = jQuery.now();

      jQuery.ajax({
        url: '/api/session/signup',
        data: JSON.stringify(mPayload),
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


    _newDone: function(mPayload) {
      try {
        this.getView().getModel().getData().User = mPayload;
        //this.onFinishBackendOperation();
        this._loginDone();
        //MessageToast.show(this.getResourceBundle().getText("Success.save"));
        this.getView().setBusy(false);

      } catch (e) {
        this.saveLog('E', e.message);
        MessageBox.error(e.message);
        this.getView().setBusy(false);
      }
    },


    _getPayload: function() {
      var oView = this.getView();
      var mPayload = ObjectFactory.buildUser();

      //iduser : null,
      mPayload.email = oView.byId('email').getValue();
      mPayload.passwd = oView.byId('pwd').getValue();
      mPayload.passwdconf = oView.byId('pwdRepeat').getValue();
      mPayload.name = oView.byId('name').getValue();
      mPayload.gender = oView.byId('sex').getSelectedKey();
      mPayload.birthdate = oView.byId('birthdate').getDateValue();
      mPayload.alert = oView.byId('alert').getState();
      mPayload.tec = oView.byId('terms').getSelected();
      //mPayload.captcha = oView.byId('captcha').getValue();
      mPayload.lastchange = jQuery.now();
      //mPayload.lastsync : null
      if (mPayload.birthdate) {
        mPayload.birthdate.setHours(12); //Workaround for date location, avoid D -1
      }
      return mPayload;
    },


    _initValidator: function() {
      //This is the schema with all rules used to validate the UI5 Controls
      var validationSchema = {
        properties: {
          pwd: {
            type: 'string',
            minLength: 6
          },
          pwdRepeat: {
            type: 'string',
            const: { '$data': '1/pwd' }
          },
          name: {
            type: 'string',
            minLength: 3
          },
          email: {
            type: 'string',
            format: 'email',
            minLength: 0
          },
          birthdate: {
            format: 'date'
          },
          terms: {
            type: 'boolean',
            const: true
          }
        }
      };

      //Initialize the OpenUI5 Validator object
      this._validator = new Validator(this.getView(), validationSchema);
    },

    _onValidationSuccess: function(context) {
      var oView = this.getView();
      this.getMessagePopover().close();
      oView.setBusy(true);
      if (oView.getViewName() === 'com.mlauffer.gotmoneyappui5.view.User') {
        this._saveEdit(context);
      } else {
        this._saveNew();
      }
    },

    _onValidationError: function(errors) {
      this.getOwnerComponent().oMessageManager.addMessages(errors);
    },

    _clearValueState: function() {
      var controls = ['pwd', 'pwdRepeat', 'name', 'email', 'birthdate', 'terms'];
      this.clearValueState(controls);
    }
  });
});
