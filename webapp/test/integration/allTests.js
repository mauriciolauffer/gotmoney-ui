sap.ui.require([
  'sap/ui/test/Opa5',
  'sap/ui/test/opaQunit',
  'test/integration/arrangements/Common',
  'test/integration/journeys/navigation'
], function(Opa5, opaTest, Common) {
  'use strict';

  Opa5.extendConfig({
    viewNamespace: 'com.mlauffer.gotmoneyappui5.view.',
    arrangements: new Common(),
    autoWait: true
  });
});
