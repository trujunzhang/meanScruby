'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Category = mongoose.model('Category'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an crawler
 */
exports.create = function (req, res) {
    var crawler = new Category(req.body);
    crawler.user = req.user;

    crawler.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(crawler);
        }
    });
};

/**
 * Show the current crawler
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
    var crawler = req.crawler ? req.crawler.toJSON() : {};

    // Add a custom field to the Category, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Category model.
    crawler.isCurrentUserOwner = !!(req.user && crawler.user && crawler.user._id.toString() === req.user._id.toString());

    res.json(crawler);
};

/**
 * Update an crawler
 */
exports.update = function (req, res) {
    var crawler = req.crawler;

    crawler.title = req.body.title;
    crawler.content = req.body.content;

    crawler.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(crawler);
        }
    });
};

/**
 * Delete an crawler
 */
exports.delete = function (req, res) {
    var crawler = req.crawler;

    crawler.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(crawler);
        }
    });
};

/**
 * List of Categories
 */
exports.list = function (req, res) {
    Category.find().sort('-created_at').populate('user', 'displayName').exec(function (err, categories) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(categories);
        }
    });
};


exports.totalItems = function (req, res) {
    Category.count(function (err, count) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(count);
        }
    });
};

exports.categoriesList = function (req, res) {

    if (!req.params.page) {
        var page = 1;
    } else {
        var page = req.params.page;
    }
    var per_page = 50;

    Category.find().sort('-created_at').skip((page - 1) * per_page).limit(per_page).exec(function (err, itunes) {
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
 * Category middleware
 */
exports.crawlerByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Category is invalid'
        });
    }

    Category.findById(id).populate('user', 'displayName').exec(function (err, crawler) {
        if (err) {
            return next(err);
        } else if (!crawler) {
            return res.status(404).send({
                message: 'No crawler with that identifier has been found'
            });
        }
        req.crawler = crawler;
        next();
    });
};
