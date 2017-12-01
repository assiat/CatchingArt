'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Guide = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Fetch All Guide
 */
exports.fetchAll = function(req, res) {
  Guide.find({}, function(err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // filter on users just for keep the guide
      const guides = users.filter(user => user.guide == true);
      res.jsonp(guides);
    }
  });

};
