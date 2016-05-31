'use strict';

/**
 * Module dependencies
 */
var itunesPolicy = require('../policies/itunes.server.policy'),
  itunes = require('../controllers/itunes.server.controller');

module.exports = function (app) {
  // Itunes collection routes
  app.route('/api/itunesList/:page')
      .get(itunes.itunesList);

  app.route('/api/totalItems')
      .get(itunes.totalItems);  
};
