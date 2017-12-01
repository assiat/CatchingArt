'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Trophy = mongoose.model('Trophy'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Trophy
 */
exports.create = function(req, res) {
  var trophy = new Trophy(req.body);
  trophy.user = req.user;

  trophy.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(trophy);
    }
  });
};

/**
 * Show the current Trophy
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var trophy = req.trophy ? req.trophy.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  trophy.isCurrentUserOwner = req.user && trophy.user && trophy.user._id.toString() === req.user._id.toString();

  res.jsonp(trophy);
};

/**
 * Update a Trophy
 */
exports.update = function(req, res) {
  var trophy = req.trophy;

  trophy = _.extend(trophy, req.body);

  trophy.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(trophy);
    }
  });
};

/**
 * Delete an Trophy
 */
exports.delete = function(req, res) {
  var trophy = req.trophy;

  trophy.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(trophy);
    }
  });
};

/**
 * List of Trophies
 */
exports.list = function(req, res) {
  Trophy.find().sort('-created').populate('user', 'displayName').exec(function(err, trophies) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(trophies);
    }
  });
};

/**
 * Trophy middleware
 */
exports.trophyByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Trophy is invalid'
    });
  }

  Trophy.findById(id).populate('user', 'displayName').exec(function (err, trophy) {
    if (err) {
      return next(err);
    } else if (!trophy) {
      return res.status(404).send({
        message: 'No Trophy with that identifier has been found'
      });
    }
    req.trophy = trophy;
    next();
  });
};
