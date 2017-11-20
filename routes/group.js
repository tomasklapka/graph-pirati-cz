"use strict";

const getResultCallback = require('./common').getResultCallback;
const commonFallThrough = require('./common').fallThrough;

function fallThrough (req, resultCallback, controlCallback) {
    commonFallThrough('group', req, resultCallback, controlCallback);
}

module.exports.list = function (req, res) {
    fallThrough(req, getResultCallback(res), function (control, cb) {
        control.list(cb);
    });
};

module.exports.getMembersById = function (req, res) {
    fallThrough(req, getResultCallback(res), function (control, cb) {
        control.getMembers(req.params.id || req.params[0], cb);
    });
};

module.exports.getByName = function (req, res) {
    fallThrough(req, getResultCallback(res), function (control, cb) {
        control.getByName(req.params.name, cb);
    });
};

module.exports.getMembersByName = function (req, res) {
    fallThrough(req, getResultCallback(res, (res, err, result) => {
        fallThrough(req, (err, result) => { res.json(result) }, (control, cb) => {
            control.getMembers(result.id, cb);
        })
    }), function (control, cb) {
        control.getByName(req.params.name, cb);
    });
};

module.exports.getById = function (req, res) {
    if (/deadbeef-babe-f002-(\d{12})/.exec(req.params.id || req.params[0])) {
        fallThrough(req, getResultCallback(res), function (control, cb) {
            control.getById(req.params.id || req.params[0], cb)
        })
    }
};