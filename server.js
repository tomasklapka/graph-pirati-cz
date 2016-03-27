var forever = require('forever-monitor');

var child = new (forever.Monitor)('app.js', { args: []});

child.start();
