sap.ui.define([
  'sap/base/Log',
  'sap/base/util/UriParameters',
  'sap/ui/core/util/MockServer',
  'sap/ui/model/json/JSONModel'
], function(Log, UriParameters, MockServer, JSONModel) {
  'use strict';

  let oMockServer;

  return {
    /**
     * Initializes the mock server.
     * You can configure the delay with the URL parameter "serverDelay".
     * The local mock data in this folder is returned instead of the real data for testing.
     * @public
     */

    init: function() {
      const oUriParameters = new UriParameters(window.location.href);
      const oMockServer = new MockServer({
        rootUri: '/'
      });
      MockServer.config({
        autoRespond: true,
        autoRespondAfter: oUriParameters.get('serverDelay') || 1000
      });
      const sPath = sap.ui.require.toUrl('com/mlauffer/gotmoneyappui5/localService');
      //oMockServer.simulate(sPath + '/metadata.xml', sPath + '/mockdata', true);

      const oModel = new JSONModel(sPath + '/mockdata/mock.json');
      oModel.loadData(sPath + '/mockdata/mock.json', false);

      this.setRequestHandler(oMockServer, oModel);

      oMockServer.start();
      Log.info('Running the app with mock data');
    },

    /**
     * @public returns the mockserver of the app, should be used in integration tests
     * @returns {sap.ui.core.util.MockServer} the mockserver instance
     */
    getMockServer: function() {
      return oMockServer;
    },

    setRequestHandler: function(mockServer, model) {
      // handling mocking a function import call step
      const aRequests = mockServer.getRequests();
      aRequests.push({
        method: 'GET',
        path: new RegExp('api/session/(.*)'),
        response: function(oXhr, sUrlParams) {
          Log.debug('Incoming request for /session/loggedin');
          oXhr.respondJSON(200, {'Content-Type': 'application/json'}, JSON.stringify({}));
          return true;
        }
      });
      aRequests.push({
        method: 'GET',
        path: new RegExp('api/user(.*)'),
        response: function(oXhr, sUrlParams) {
          Log.debug('Incoming request for /user');
          oXhr.respondJSON(200, {'Content-Type': 'application/json'}, model.getJSON());
          return true;
        }
      });
      aRequests.push({
        method: 'GET',
        path: new RegExp('api/transaction(.*)'),
        response: function(oXhr, sUrlParams) {
          Log.debug('Incoming request for /user');
          oXhr.respondJSON(200, {'Content-Type': 'application/json'}, []);
          return true;
        }
      });
      mockServer.setRequests(aRequests);
    }
  };
});
