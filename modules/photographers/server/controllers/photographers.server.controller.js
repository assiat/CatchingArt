'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Photographer = mongoose.model('Photographer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Photographer
 */
exports.create = function(req, res) {
  var photographer = new Photographer(req.body);
  photographer.user = req.user;

  photographer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(photographer);
    }
  });
};

/**
 * Show the current Photographer
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var photographer = req.photographer ? req.photographer.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  photographer.isCurrentUserOwner = req.user && photographer.user && photographer.user._id.toString() === req.user._id.toString();

  res.jsonp(photographer);
};

/**
 * Update a Photographer
 */
exports.update = function(req, res) {
  var photographer = req.photographer;

  photographer = _.extend(photographer, req.body);

  photographer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(photographer);
    }
  });
};

/**
 * Delete an Photographer
 */
exports.delete = function(req, res) {
  var photographer = req.photographer;

  photographer.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(photographer);
    }
  });
};

/**
 * List of Photographers
 */
exports.list = function(req, res) {
  Photographer.find().sort('-created').populate('user', 'displayName').exec(function(err, photographers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(photographers);
    }
  });
};

/**
 * Photographer middleware
 */
exports.photographerByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Photographer is invalid'
    });
  }

  Photographer.findById(id).populate('user', 'displayName').exec(function (err, photographer) {
    if (err) {
      return next(err);
    } else if (!photographer) {
      return res.status(404).send({
        message: 'No Photographer with that identifier has been found'
      });
    }
    req.photographer = photographer;
    next();
  });
};
