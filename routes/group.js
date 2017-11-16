const debug = require('debug')('group');

var Group = require('../control/graphapi_group');

exports.list = function(req, res) {
	Group.list(function(err, result) {
		if (err) {
			console.log(err);
			res.status(500).send("backend error");
			return;
		}
		if (!result) {
			res.status(500).send("no such user");
			return;
		}
		res.json(result);
		return;
	});

}

exports.getMembersById = function(req, res) {
	Group.getMembers(req.params.id || req.params[0], function(err, result) {
		if (err) {
			console.log(err);
			res.status(500).send("backend error");
			return;
		}
		if (!result) {
			res.status(404).send("no such user");
			return;
		}
		res.json(result);
		return;
	});
};

exports.getByName = function(req, res) {
	Group.getByName(req.params.name, function(err, result) {
		if (err) {
			console.log(err);
			res.status(500).send("backend error");
			return;
		}
		if (!result) {
			res.status(404).send("no such user");
			return;
		}
		res.json(result);
		return;
	});
};

exports.getMembersByName = function(req, res) {
	Group.getByName(req.params.name, function(err, result) {
		if (err) {
			console.log(err);
			res.status(500).send("backend error");
			return;
		}
		if (!result) {
			res.status(404).send("no such user");
			return;
		}
		Group.getMembers(result.id, function(err, result) {
			res.json(result);
		});
		return;
	});
};

exports.getById = function(req, res, next) {
	if (/deadbeef-babe-f002-(\d{12})/.exec(req.params.id || req.params[0])) {
		Group.getById(req.params.id || req.params[0], function(err, result) {
			if (err) {
				console.log(err);
				res.status(500).send("backend error");
				return;
			}
			if (!result) {
				res.status(404).send("no such user");
				
				return;
			}
			res.json(result);
			return;
		});
		return;
	}	
};
