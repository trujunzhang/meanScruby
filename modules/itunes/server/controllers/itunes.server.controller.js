'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an itune
 */
exports.create = function (req, res) {
  var itune = new Article(req.body);
  itune.user = req.user;

  itune.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(itune);
    }
  });
};

/**
 * Show the current itune
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var itune = req.itune ? req.itune.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  itune.isCurrentUserOwner = !!(req.user && itune.user && itune.user._id.toString() === req.user._id.toString());

  res.json(itune);
};

/**
 * Update an itune
 */
exports.update = function (req, res) {
  var itune = req.itune;

  itune.title = req.body.title;
  itune.content = req.body.content;

  itune.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(itune);
    }
  });
};

/**
 * Delete an itune
 */
exports.delete = function (req, res) {
  var itune = req.itune;

  itune.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(itune);
    }
  });
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
  Article.find().sort('-created').populate('user', 'displayName').exec(function (err, itunes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(itunes);
    }
  });
};

/**
 * Article middleware
 */
exports.ituneByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Article is invalid'
    });
  }

  Article.findById(id).populate('user', 'displayName').exec(function (err, itune) {
    if (err) {
      return next(err);
    } else if (!itune) {
      return res.status(404).send({
        message: 'No itune with that identifier has been found'
      });
    }
    req.itune = itune;
    next();
  });
};
