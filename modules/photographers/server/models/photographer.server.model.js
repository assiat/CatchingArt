'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Photographer Schema
 */
var PhotographerSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Photographer name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Photographer', PhotographerSchema);
