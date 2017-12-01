'use strict';

/**
 * Module dependencies
 */
var photographersPolicy = require('../policies/photographers.server.policy'),
  photographers = require('../controllers/photographers.server.controller');

module.exports = function(app) {
  // Photographers Routes
  app.route('/api/photographers').all(photographersPolicy.isAllowed)
    .get(photographers.list)
    .post(photographers.create);

  app.route('/api/photographers/:photographerId').all(photographersPolicy.isAllowed)
    .get(photographers.read)
    .put(photographers.update)
    .delete(photographers.delete);

  // Finish by binding the Photographer middleware
  app.param('photographerId', photographers.photographerByID);
};
