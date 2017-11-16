const debug = require('debug')('graphapi_group');

const graphapi = require('../control/graphapi.js');

const Group = {};

Group.getByName = function(name, callback) {
	graphapi.query('group/' + name, callback)
};

Group.getById = function(id, callback) {
	graphapi.query(id, callback)
};

const isPhpbbGroup = /deadbeef-babe-f002-(\d{12})/i;
Group.getMembers = function(id, callback) {
    if (isPhpbbGroup.exec(id)) {
        graphapi.query(id + '/members', callback)
    } else {
        graphapi.query('group/' + id + '/members', callback)
    }
};

Group.list = function(callback) {
    graphapi.query('groups', callback)
}

exports.Group = Group;
exports.getByName = Group.getByName;
exports.getById = Group.getById;
exports.list = Group.list;
exports.getMembers = Group.getMembers;
