var phpbb = require('./phpbb.js');

var Group = {};

Group.getByName = function(name, callback) {
	phpbb.query("SELECT * FROM phpbb_groups WHERE group_name = ?"
			, [name], function(err, result) {
				if (err || !result[0]) {
					callback(err, undefined);
					return;
				}
				callback(err, phpbbGroupFinalizer(result[0]));
			});
}
var isPhpbbGroup = /deadbeef-babe-f002-(\d{12})/i;
Group.getById = function(id, callback) {
	var m = isPhpbbGroup.exec(id);
	if (!m) {
		callback(undefined, undefined);
		return;
	}
	id = m[1] * 1;
	phpbb.query("SELECT * FROM phpbb_groups WHERE group_id = ?"
			, [id], function(err, result) {
				if (err || !result[0]) {
					callback(err, undefined);
					return;
				}
				callback(err, phpbbGroupFinalizer(result[0]));
			});
}

var isPhpbbGroup = /deadbeef-babe-f002-(\d{12})/i;
Group.getMembers = function(id, callback) {
	var m = isPhpbbGroup.exec(id);
	if (!m) {
		callback(undefined, undefined);
		return;
	}
	id = m[1] * 1;
	phpbb.query("SELECT \
					phpbb_users.username, \
					phpbb_user_group.user_id \
			FROM phpbb_user_group \
			JOIN phpbb_users USING (user_id) \
			WHERE user_pending = 0 AND phpbb_user_group.group_id = ?"
			, [id], function(err, result) {
				if (err || !result[0]) {
					callback(err, undefined);
					return;
				}
				for(var i=0;i<result.length;i++) {
					result[i] = phpbbUserFinalizer(result[i]);
				}
				callback(err, result);
			});
}

Group.list = function(callback) {
	phpbb.query("SELECT * FROM phpbb_groups"
			, function(err, result) {
				if (err || !result[0]) {
					callback(err, []);
					return;
				}
				for(var i = 0;i < result.length; i++) {
					result[i] = phpbbGroupFinalizer(result[i]);
				}
				callback(err, result);
			});
}

function phpbbGroupFinalizer(r) {
	var gid = "" + r.group_id;
	var result = {};
	result.id = 'deadbeef-babe-f002-' + gid.lpad("0", 12);
	result.username = r.group_name;
	result.type = "group";
	result.about = r.group_desc;
	result.display = r.group_display;
	result.colour = r.group_colour;
	return result;
}
function phpbbUserFinalizer(r) {
	var uid = "" + r.user_id;
	r.id = 'deadbeef-babe-f001-' + uid.lpad("0", 12);
	delete r.user_id;
	return r;
}

exports.Group = Group;
exports.getByName = Group.getByName;
exports.getById = Group.getById;
exports.list = Group.list;
exports.getMembers = Group.getMembers;
