'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Guide = mongoose.model('Guide'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * create Guide
 */
exports.create = function(req, res) {

  var new_guide = new Guide(req.body);

  new_guide.save(function(err, guide) {

    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(guide);
    }

  });
};

/**
 * Delete an Guide by Id
 */
exports.deleteById = function(req, res) {
  var guide = req.guide;

  guide.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(guide);
    }
  });

};

/**
 * Fetch All Guide
 */
exports.fetchAll = function(req, res) {

  Guide.find({}, function(err, guides) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(guides);
    }
  });

};

/**
 * Fetch by Id the current Guide
 */
exports.fetchById = function(req, res) {
  // convert mongoose document to JSON
  var guide = req.guide ? req.guide.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  guide.isCurrentUserOwner = req.user && guide.user && guide.user._id.toString() === req.user._id.toString();

  res.jsonp(guide);
};

/**
 * Update a Guide
 */
exports.updateById = function(req, res) {
  var guide = req.guide;

  guide = _.extend(guide, req.body);

  guide.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(guide);
    }
  });
};

/**
 * Guide middleware
 */
exports.guideByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Guide is invalid'
    });
  }

  Guide.findById(id).exec(function (err, guide) {
    if (err) {
      return next(err);
    } else if (!guide) {
      return res.status(404).send({
        message: 'No Guide with that identifier has been found'
      });
    }
    req.guide = guide;
    next();
  });
};
