const request = require('request');

const debug = require('debug')('graph');

apiUrl = 'https://graph.pirati.cz/';

exports.query = function (url, done) {
    debug('request for ' + url);
    request({
        url: apiUrl + url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            done(null, body)
        } else {
            done(error)
        }
    })
};
