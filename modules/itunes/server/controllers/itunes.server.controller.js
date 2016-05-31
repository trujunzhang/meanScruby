'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Itune = mongoose.model('Itune'),
    _ = require('lodash'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * List of Itunes
 */
exports.list = function (req, res) {
    var _page = req.params.page;
    var page = 1;
    var per_page = 10;
    Itune.find().sort('-updatedAt').skip((page - 1) * per_page).limit(per_page).exec(function (err, itunes) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(itunes);
        }
    });
};

exports.totalItems = function (req, res) {
    Itune.count(function (err, count) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(count);
        }
    });
};

exports.itunesList = function (req, res) {

    if (!req.params.page) {
        var page = 1;
    } else {
        var page = req.params.page;
    }
    var per_page = 10;

    Itune.find().sort('-updatedAt').skip((page - 1) * per_page).limit(per_page).exec(function (err, itunes) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(itunes);
        }
    });

};


