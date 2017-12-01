'use strict';

/**
 * Module dependencies
 */
var guidesPolicy = require('../policies/guides.server.policy'),
  guides = require('../controllers/guides.server.controller');

module.exports = function(app) {
  // Guides Routes
  app.route('/api/guides')
    .get(guides.fetchAll)
    .post(guides.create);

  app.route('/api/guides/:guideId')
    .get(guides.fetchById)
    .put(guides.updateById)
    .delete(guides.deleteById);

  // Finish by binding the Guide middleware
  app.param('guideId', guides.guideByID);
};
