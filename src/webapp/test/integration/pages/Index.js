sap.ui.require([
  'sap/ui/test/Opa5',
  'sap/ui/test/actions/Press'
], function(Opa5, Press) {
  'use strict';

  function firePress(sId, viewName) {
    return this.waitFor({
      id: sId,
      viewName: viewName,
      actions: new Press()
    });
  }

  Opa5.createPageObjects({
    onTheAppPage: {
      actions: {
        iPressTheLoginDialogButton: function() {
          return firePress.call(this, 'btLogin', 'App');
        },
        iPressTheCloseLoginDialogButton: function() {
          return firePress.call(this, 'Login--btClose');
        },
        iPressTheForgetPasswordDialogLink: function() {
          return firePress.call(this, 'Login--btRecovery');
        },
        iPressTheCloseForgetPasswordDialogButton: function() {
          return firePress.call(this, 'Recovery--btClose');
        }
      },

      assertions: {
        iShouldSeeTheLoginDialog: function() {
          return this.waitFor({
            id: 'Login--dialogLogin',
            success: function() {
              Opa5.assert.ok(true, 'The dialog is open');
            }
          });
        },
        iShouldSeeTheForgetPasswordDialog: function() {
          return this.waitFor({
            id: 'Recovery--dialogRecovery',
            success: function() {
              Opa5.assert.ok(true, 'The dialog is open');
            }
          });
        },
        iShouldSeeTheAppHeader: function() {
          return this.waitFor({
            controlType: 'sap.ui.unified.ShellHeadItem',
            success: function() {
              Opa5.assert.ok(true, 'The dialog is closed');
            }
          });
        }
      }
    }
  });
});
