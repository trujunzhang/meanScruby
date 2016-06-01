'use strict';

/**
 * Module dependencies
 */
var crawlersPolicy = require('../policies/crawlers.server.policy'),
  crawlers = require('../controllers/crawlers.server.controller');

module.exports = function (app) {
  // Crawlers collection routes
  app.route('/api/crawlers').all(crawlersPolicy.isAllowed)
    .get(crawlers.list)
    .post(crawlers.create);

  // Single crawler routes
  app.route('/api/crawlers/:crawlerId').all(crawlersPolicy.isAllowed)
    .get(crawlers.read)
    .put(crawlers.update)
    .delete(crawlers.delete);

  // Finish by binding the crawler middleware
  app.param('crawlerId', crawlers.crawlerByID);
};
