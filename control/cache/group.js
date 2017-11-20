const readCache = require('./cache.js').readCache;

const Group = {};

Group.getByName = function(name, callback) {
    readCache('group_getByName', name, callback);
};

Group.getById = function(id, callback) {
    readCache('group_getById', name, callback);
};

Group.getMembers = function(id, callback) {
    readCache('group_getMembers', id, callback);
};

Group.list = function(callback) {
    readCache('group_list', null, callback);
};

exports.Group = Group;
exports.getByName = Group.getByName;
exports.getById = Group.getById;
exports.list = Group.list;
exports.getMembers = Group.getMembers;
