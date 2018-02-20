sap.ui.require([
  'sap/ui/test/Opa5',
  'sap/ui/test/opaQunit',
  'test/integration/pages/App'
], function(Opa5, opaTest) {
  'use strict';

  QUnit.module('App');
  opaTest('Should open the Login dialog', function(Given, When, Then) {
    Given.iStartMyApp();
    When.onTheAppPage.iPressTheLoginDialogButton();
    Then.onTheAppPage.iShouldSeeTheLoginDialog()
      .and.iTeardownMyAppFrame();
  });

  opaTest('Should open and close the Login dialog', function(Given, When, Then) {
    Given.iStartMyApp();
    When.onTheAppPage.iPressTheLoginDialogButton();
    When.onTheAppPage.iPressTheCloseLoginDialogButton();
    Then.onTheAppPage.iShouldSeeTheAppHeader()
      .and.iTeardownMyAppFrame();
  });

  opaTest('Should open the Forget Password dialog', function(Given, When, Then) {
    Given.iStartMyApp();
    When.onTheAppPage.iPressTheLoginDialogButton();
    When.onTheAppPage.iPressTheForgetPasswordDialogLink();
    Then.onTheAppPage.iShouldSeeTheForgetPasswordDialog()
      .and.iTeardownMyAppFrame();
  });

  opaTest('Should open and close the Forget Password dialog', function(Given, When, Then) {
    Given.iStartMyApp();
    When.onTheAppPage.iPressTheLoginDialogButton();
    When.onTheAppPage.iPressTheForgetPasswordDialogLink();
    When.onTheAppPage.iPressTheCloseForgetPasswordDialogButton();
    Then.onTheAppPage.iShouldSeeTheAppHeader()
      .and.iTeardownMyAppFrame();
  });
});
