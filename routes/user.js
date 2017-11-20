"use strict";

const getResultCallback = require('./common').getResultCallback;
const commonFallThrough = require('./common').fallThrough;

function fallThrough (req, resultCallback, controlCallback) {
    commonFallThrough('user', req, resultCallback, controlCallback);
}

module.exports.list = function (req, res) {
    fallThrough(req, getResultCallback(res), function (control, cb) {
        control.list(cb);
    });
};

module.exports.getGroupsById = function (req, res) {
    fallThrough(req, getResultCallback(res), function (control, cb) {
        control.getGroups(req.params.id || req.params[0], cb);
    });
};

module.exports.get = function (req, res) {
    fallThrough(req, getResultCallback(res), function (control, cb) {
        control.getByName(req.params.id, cb);
    });
};

module.exports.getGroups = function (req, res) {
    if (/deadbeef-babe-f001-(\d{12})/.exec(req.params.id || req.params[0])) {
        fallThrough(req, getResultCallback(res), function (control, cb) {
            control.getGroups(req.params.id, cb);
        });
    } else {
        fallThrough(req, getResultCallback(res, (res, err, result) => {
            fallThrough(req, getResultCallback(res), function (control, cb) {
                control.getGroups(result.id, cb);
            });
        }), function (control, cb) {
            control.getByName(req.params.id, cb);
        });
    }
};

module.exports.getById = function (req, res) {
    if (/deadbeef-babe-f001-(\d{12})/.exec(req.params.id || req.params[0])) {
        fallThrough(req, getResultCallback(res), function (control, cb) {
            control.getById(req.params.id || req.params[0], cb);
        });
    }
};

