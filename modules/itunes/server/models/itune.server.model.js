'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Itune Schema
 */
var ItuneSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: ''
  },
  thumbnail: {
    type: String,
    default: ''
  },
  appLastUpdated: {
    type: String,
    default: ''
  },
  developer: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  ofReviews: {
    type: String,
    default: ''
  },
  ofReviewsCurrent: {
    type: String,
    default: ''
  },
  starts: {
    type: String,
    default: ''
  },
  startsCurrent: {
    type: String,
    default: ''
  },
  version: {
    type: String,
    default: ''
  }
});

mongoose.model('Itune', ItuneSchema);
