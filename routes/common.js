"use strict";

const debug = require('debug')('routes/common');
const tryEach = require('async/tryEach');

const cacheRequest = require('../control/cache/cache').cacheRequest;
const view = require('../views/view');

const controls = {
    'user': {},
    'group': {}
};

module.exports.fallThrough = function (collection, req, resultCallback, controlCallback) {
    const tasks = [];
    req.app.get('sources').forEach((source) => {
        let control = controls[collection][source];
        if (!control) {
            debug('loading control: '+source+'/'+collection);
            control = require('../control/' + source + '/' + collection);
            controls[collection][source] = control;
        }

        tasks.push((cb) => {
            controlCallback(control, cb);
        });
    });
    tryEach(tasks, resultCallback);
};

module.exports.getResultCallback = function (collection, method, parameter, req, res, next) {
    return function (err, result) {
        debug('result callback err: ' + err);
        if (err) {
            console.log(err);
            res.status(500).send("backend error");
            return;
        }
        if (!result) {
            res.status(404).send("no such user");
            return;
        }
        cacheRequest(collection, method, parameter, result, () => {
            if (next) {
                next(res, err, result);
            } else {
                view(collection, method, req, res, result);
            }
        });
    }
};

