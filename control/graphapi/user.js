const debug = require('debug')('graphapi_user');

const graphapi = require('./graphapi.js');

const User = {};

User.getByName = function(name, callback) {
	graphapi.query('user/' + name, callback)
};

User.getById = function(id, callback) {
	graphapi.query(id, callback)
};

const isPhpbbUser = /deadbeef-babe-f001-(\d{12})/i;
User.getGroups = function(id, callback) {
    if (isPhpbbUser.exec(id)) {
        graphapi.query(id + '/groups', callback)
    } else {
        graphapi.query('user/' + id + '/groups', callback)
    }
};

User.list = function(callback) {
    graphapi.query('users', callback)
};

exports.User = User;
exports.getByName = User.getByName;
exports.getById = User.getById;
exports.list = User.list;
exports.getGroups = User.getGroups;
