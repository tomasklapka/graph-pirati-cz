exports.index = function (req, res) {
  const base = req.protocol + '://' + req.get('host');
  res.render('index', { title: 'Graph API for ' + base, base: base });
};
