var User = require('../control/user');

exports.list = function(req, res) {
	User.list(function(err, result) {
		if (err) {
			console.log(err);
			res.send(500, "backend error");
			return;
		}
		if (!result) {
			res.send(404, "no such user");
			return;
		}
		res.json(result);
		return;
	});

}

exports.getGroupsById = function(req, res) {
	User.getGroups(req.params.id || req.params[0], function(err, result) {
		if (err) {
			console.log(err);
			res.send(500, "backend error");
			return;
		}
		if (!result) {
			res.send(404, "no such user");
			return;
		}
		res.json(result);
		return;
	});
};

exports.get = function(req, res) {
	User.getByName(req.params.id, function(err, result) {
		if (err) {
			console.log(err);
			res.send(500, "backend error");
			return;
		}
		if (!result) {
			res.send(404, "no such user");
			return;
		}
		res.json(result);
		return;
	});
};

exports.getGroups = function(req, res) {
	User.getByName(req.params.id, function(err, result) {
		if (err) {
			console.log(err);
			res.send(500, "backend error");
			return;
		}
		if (!result) {
			res.send(404, "no such user");
			return;
		}
		User.getGroups(result.id, function(err, result) {
			console.log(err);
			res.json(result);
		});
		return;
	});
};

exports.getById = function(req, res, next) {
	if (/deadbeef-babe-f001-(\d{12})/.exec(req.params.id || req.params[0])) {
		User.getById(req.params.id || req.params[0], function(err, result) {
			if (err) {
				console.log(err);
				res.send(500, "backend error");
				return;
			}
			if (!result) {
				res.send(404, "no such user");
				
				return;
			}
			res.json(result);
			return;
		});
		return;
	}	
};
