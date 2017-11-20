var phpbb = require('./phpbb.js');

var User = {};

User.getByName = function(name, callback) {
	phpbb.query("SELECT \
					phpbb_users.user_id, \
					username, \
					username_clean, \
					user_lang as language, \
					phpbb_profile_fields_data.pf_fullname as fullname, \
					user_birthday as dob, \
					CASE WHEN fullmember.group_name IS NOT NULL THEN 'member' ELSE 'supporter' END as rank,  \
					CASE WHEN phpbb_profile_fields_data.pf_zobraz_na_mape = 1 THEN user_from ELSE NULL END as address \
			FROM phpbb_users \
			LEFT JOIN phpbb_profile_fields_data ON (phpbb_users.user_id = phpbb_profile_fields_data.user_id) \
			JOIN phpbb_user_group ON (phpbb_users.user_id = phpbb_user_group.user_id) \
			JOIN phpbb_groups grps ON (phpbb_user_group.group_id = grps.group_id AND (grps.group_name = 'Celostatni forum' OR grps.group_name = 'Registrovani priznivci')) \
			LEFT JOIN phpbb_groups fullmember ON (phpbb_user_group.group_id = fullmember.group_id AND fullmember.group_name = 'Celostatni forum') \
			WHERE username_clean = LOWER(?)  ORDER BY grps.group_name"
			, [name], function(err, result) {
				if (err || !result[0]) {
					callback(err, undefined);
					return;
				}
				callback(err, phpbbUserFinalizer(result[0]));
			});
}
var isPhpbbUser = /deadbeef-babe-f001-(\d{12})/i;
User.getById = function(id, callback) {
	var m = isPhpbbUser.exec(id);
	if (!m) {
		callback(undefined, undefined);
		return;
	}
	id = m[1] * 1;
	phpbb.query("SELECT \
					phpbb_users.user_id, \
					username, \
					username_clean, \
					user_lang as language, \
					phpbb_profile_fields_data.pf_fullname as fullname, \
					user_birthday as dob, \
					CASE WHEN fullmember.group_name IS NOT NULL THEN 'member' ELSE 'supporter' END as rank,  \
					CASE WHEN phpbb_profile_fields_data.pf_zobraz_na_mape = 1 THEN user_from ELSE NULL END as address \
			FROM phpbb_users \
			LEFT JOIN phpbb_profile_fields_data ON (phpbb_users.user_id = phpbb_profile_fields_data.user_id) \
			JOIN phpbb_user_group ON (phpbb_users.user_id = phpbb_user_group.user_id) \
			JOIN phpbb_groups grps ON (phpbb_user_group.group_id = grps.group_id AND (grps.group_name = 'Celostatni forum' OR grps.group_name = 'Registrovani priznivci')) \
			LEFT JOIN phpbb_groups fullmember ON (phpbb_user_group.group_id = fullmember.group_id AND fullmember.group_name = 'Celostatni forum') \
			WHERE phpbb_users.user_id = ? ORDER BY grps.group_name"
			, [id], function(err, result) {
				if (err || !result[0]) {
					callback(err, undefined);
					return;
				}
				callback(err, phpbbUserFinalizer(result[0]));
			});
}

var isPhpbbUser = /deadbeef-babe-f001-(\d{12})/i;
User.getGroups = function(id, callback) {
	var m = isPhpbbUser.exec(id);
	if (!m) {
		callback(undefined, undefined);
		return;
	}
	id = m[1] * 1;
	phpbb.query("SELECT \
					phpbb_groups.group_id, \
					phpbb_groups.group_name \
			FROM phpbb_users \
			JOIN phpbb_user_group ON (phpbb_users.user_id = phpbb_user_group.user_id) \
			JOIN phpbb_groups ON (phpbb_user_group.group_id = phpbb_groups.group_id) \
			WHERE phpbb_users.user_id = ?"
			, [id], function(err, result) {
				if (err || !result[0]) {
					callback(err, undefined);
					return;
				}
				for(var i=0;i<result.length;i++) {
					result[i] = phpbbGroupFinalizer(result[i]);
				}
				callback(err, result);
			});
}

User.list = function(callback) {
	phpbb.query("SELECT DISTINCT \
					phpbb_users.user_id, \
					username, \
					username_clean, \
					user_lang as language, \
					phpbb_profile_fields_data.pf_fullname as fullname, \
					user_birthday as dob, \
					CASE WHEN fullmember.group_id IS NOT NULL THEN 'member' ELSE 'supporter' END as rank,  \
					CASE WHEN phpbb_profile_fields_data.pf_zobraz_na_mape = 1 THEN user_from ELSE NULL END as address \
			FROM phpbb_users \
			LEFT JOIN phpbb_profile_fields_data ON (phpbb_users.user_id = phpbb_profile_fields_data.user_id) \
			JOIN phpbb_user_group ug ON (phpbb_users.user_id = ug.user_id and (ug.group_id = 47 or ug.group_id = 74)) \
			LEFT JOIN phpbb_user_group fullmember ON (phpbb_users.user_id = fullmember.user_id and fullmember.group_id = 47)"
			, function(err, result) {
				if (err || !result[0]) {
					callback(err, []);
					return;
				}
				for(var i = 0;i < result.length; i++) {
					result[i] = phpbbUserFinalizer(result[i]);
				}
				callback(err, result);
			});
}

function phpbbGroupFinalizer(r) {
	var gid = "" + r.group_id;
	r.id = 'deadbeef-babe-f002-' + gid.lpad("0", 12);
	delete r.group_id;
	r.username = r.group_name;
	delete r.group_name;

	return r;
}
function phpbbUserFinalizer(r) {
	var uid = "" + r.user_id;
	r.id = 'deadbeef-babe-f001-' + uid.lpad("0", 12);
	if (r.rank == 'member') {
		r.email = r.username_clean.replace(' ', '.') + "@pirati.cz";
	} else {
		r.email = r.username_clean.replace(' ', '.') + "@regp.pirati.cz";
	}
	delete r. username_clean;
	delete r.dob;
	r.type = "user";
	return r;
}

exports.User = User;
exports.getByName = User.getByName;
exports.getById = User.getById;
exports.list = User.list;
exports.getGroups = User.getGroups;
