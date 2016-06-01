'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Category = mongoose.model('Category'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an category
 */
exports.create = function (req, res) {
    var category = new Category(req.body);
    category.user = req.user;

    category.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(category);
        }
    });
};

/**
 * Show the current category
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
    var category = req.category ? req.category.toJSON() : {};

    // Add a custom field to the Category, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Category model.
    category.isCurrentUserOwner = !!(req.user && category.user && category.user._id.toString() === req.user._id.toString());

    res.json(category);
};

/**
 * Update an category
 */
exports.update = function (req, res) {
    var category = req.category;

    category.title = req.body.title;
    category.content = req.body.content;

    category.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(category);
        }
    });
};

/**
 * Delete an category
 */
exports.delete = function (req, res) {
    var category = req.category;

    category.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(category);
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


exports.categoriesCount = function (req, res) {
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
exports.categoryByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Category is invalid'
        });
    }

    Category.findById(id).populate('user', 'displayName').exec(function (err, category) {
        if (err) {
            return next(err);
        } else if (!category) {
            return res.status(404).send({
                message: 'No category with that identifier has been found'
            });
        }
        req.category = category;
        next();
    });
};
