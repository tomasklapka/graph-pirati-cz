const readCache = require('./cache.js').readCache;

const User = {};

User.getByName = function(name, callback) {
    readCache('user_getByName', name, callback);
};

User.getById = function(id, callback) {
    readCache('user_getById', id, callback);
};

User.getGroups = function(id, callback) {
    readCache('user_getGroups', id, callback);
};

User.list = function(callback) {
    readCache('user_list', null, callback);
};

exports.User = User;
exports.getByName = User.getByName;
exports.getById = User.getById;
exports.list = User.list;
exports.getGroups = User.getGroups;
