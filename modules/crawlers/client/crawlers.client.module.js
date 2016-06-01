(function (app) {
  'use strict';

  app.registerModule('crawlers', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('crawlers.services');
  app.registerModule('crawlers.routes', ['ui.router', 'core.routes', 'crawlers.services']);
}(ApplicationConfiguration));
