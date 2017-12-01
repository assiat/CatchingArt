'use strict';

/**
 * Module dependencies
 */
var trophiesPolicy = require('../policies/trophies.server.policy'),
  trophies = require('../controllers/trophies.server.controller');

module.exports = function(app) {
  // Trophies Routes
  app.route('/api/trophies').all(trophiesPolicy.isAllowed)
    .get(trophies.list)
    .post(trophies.create);

  app.route('/api/trophies/:trophyId').all(trophiesPolicy.isAllowed)
    .get(trophies.read)
    .put(trophies.update)
    .delete(trophies.delete);

  // Finish by binding the Trophy middleware
  app.param('trophyId', trophies.trophyByID);
};
