"use strict";

const commonGetResultCallback = require('./common').getResultCallback;
const commonFallThrough = require('./common').fallThrough;

function getResultCallback (method, parameter, res, next) {
    return commonGetResultCallback ('group', method, parameter, res, next);
}
function fallThrough (req, resultCallback, controlCallback) {
    return commonFallThrough('group', req, resultCallback, controlCallback);
}

module.exports.list = function (req, res) {
    fallThrough(req, getResultCallback('list', null, res), function (control, cb) {
        control.list(cb);
    });
};

module.exports.getMembersById = function (req, res) {
    const parameter = req.params.id || req.params[0];
    fallThrough(req, getResultCallback('getMembers', parameter, res), function (control, cb) {
        control.getMembers(parameter, cb);
    });
};

module.exports.getByName = function (req, res) {
    fallThrough(req, getResultCallback('getByName', req.params.name, res), function (control, cb) {
        control.getByName(req.params.name, cb);
    });
};

module.exports.getMembersByName = function (req, res) {
    fallThrough(req, getResultCallback('getByName', req.params.name, res, (res, err, result) => {
        fallThrough(req,
            getResultCallback('getMembers', result.id, res),
            //(err, result) => { res.json(result) },
            function (control, cb) {
                control.getMembers(result.id, cb);
            }
        )
    }), function (control, cb) {
        control.getByName(req.params.name, cb);
    });
};

module.exports.getById = function (req, res) {
    const parameter = req.params.id || req.params[0];
    if (/deadbeef-babe-f002-(\d{12})/.exec(parameter)) {
        fallThrough(req, getResultCallback('getById', parameter, res), function (control, cb) {
            control.getById(parameter, cb)
        })
    }
};