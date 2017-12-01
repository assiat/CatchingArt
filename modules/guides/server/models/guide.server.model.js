
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Guide Schema
 */
var GuideSchema = new Schema({
  type: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  }
});

mongoose.model('Guide', GuideSchema);
