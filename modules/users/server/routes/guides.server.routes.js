'use strict';

module.exports = function (app) {
  // User Routes
  var guides = require('../controllers/guides/guides.server.controllers');

  // Setting up the users profile api
  app.route('/api/guides').get(guides.fetchAll);

  // Finish by binding the user middleware
  // app.param('userId', users.userByID);
};
