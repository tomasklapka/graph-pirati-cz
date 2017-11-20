"use strict";

const commonGetResultCallback = require('./common').getResultCallback;
const commonFallThrough = require('./common').fallThrough;

function getResultCallback (method, parameter, res, next) {
    return commonGetResultCallback ('user', method, parameter, res, next);
}
function fallThrough (req, resultCallback, controlCallback) {
    return commonFallThrough('user', req, resultCallback, controlCallback);
}

module.exports.list = function (req, res) {
    fallThrough(req, getResultCallback('list', null, res), function (control, cb) {
        control.list(cb);
    });
};

module.exports.getGroupsById = function (req, res) {
    const parameter = req.params.id || req.params[0];
    fallThrough(req, getResultCallback('getGroups', parameter, res), function (control, cb) {
        control.getGroups(parameter, cb);
    });
};

module.exports.get = function (req, res) {
    fallThrough(req, getResultCallback('getByName', req.params.id, res), function (control, cb) {
        control.getByName(req.params.id, cb);
    });
};

module.exports.getGroups = function (req, res) {
    if (/deadbeef-babe-f001-(\d{12})/.exec(req.params.id || req.params[0])) {
        fallThrough(req, getResultCallback('getGroups', req.params.id, res), function (control, cb) {
            control.getGroups(req.params.id, cb);
        });
    } else {
        fallThrough(req, getResultCallback('getByName', req.params.id, res, (res, err, result) => {
            fallThrough(req, getResultCallback('getGroups', result.id, res), function (control, cb) {
                control.getGroups(result.id, cb);
            });
        }), function (control, cb) {
            control.getByName(req.params.id, cb);
        });
    }
};

module.exports.getById = function (req, res) {
    const parameter = req.params.id || req.params[0];
    if (/deadbeef-babe-f001-(\d{12})/.exec(parameter)) {
        fallThrough(req, getResultCallback('getById', parameter, res), function (control, cb) {
            control.getById(parameter, cb);
        });
    }
};

