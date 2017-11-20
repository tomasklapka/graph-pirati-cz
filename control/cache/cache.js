"use strict";

const debug = require('debug')('cache');
const fs = require('fs');
const moment = require('moment');
const join = require('path').join;

function cacheFilename (collection_method) {
    return join(__dirname, '..', '..', 'cache', collection_method + '.json');
}

function load (collection_method, parameter, callback) {
    debug('loading cache: ' + collection_method + ' (' + parameter + ')');
    fs.readFile(cacheFilename(collection_method), function (err, data) {
        debug('read');
        debug(err);
        let obj = {};
        if (!err) { obj = JSON.parse(data) }
        callback(err, obj);
    })
}

exports.readCache = function (collection_method, parameter, callback) {
    parameter = parameter || '__null';
    debug('reading cache: ' + collection_method + ' (' + parameter + ')');
    load(collection_method, parameter, function (err, data) {
        callback(err, data[parameter])
    })
};

exports.cacheRequest = function (collection, method, parameter, result, done) {
    parameter = parameter || '__null';
    const collection_method = collection+'_'+method;
    debug('reading cache: ' + collection_method + ' (' + parameter + ')');
    load(collection_method, parameter, function (err, data) {
        data['__cache'] = { timestamp: moment().unix() };
        data[parameter] = result;
        fs.writeFile(cacheFilename(collection_method), JSON.stringify(data), function(err) {
            debug('write');
            debug(err);
            done()
        })
    });
};
