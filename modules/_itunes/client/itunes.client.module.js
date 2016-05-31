(function (app) {
  'use strict';

  app.registerModule('itunes', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('itunes.services');
  app.registerModule('itunes.routes', ['ui.router', 'core.routes', 'itunes.services']);
}(ApplicationConfiguration));
