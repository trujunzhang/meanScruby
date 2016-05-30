'use strict';

/**
 * Module dependencies
 */
var itunesPolicy = require('../policies/itunes.server.policy'),
  itunes = require('../controllers/itunes.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/itunes').all(itunesPolicy.isAllowed)
    .get(itunes.list)
    .post(itunes.create);

  // Single itune routes
  app.route('/api/itunes/:ituneId').all(itunesPolicy.isAllowed)
    .get(itunes.read)
    .put(itunes.update)
    .delete(itunes.delete);

  // Finish by binding the itune middleware
  app.param('ituneId', itunes.ituneByID);
};
