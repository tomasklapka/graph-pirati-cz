
var mysql = require('mysql');
var connection = new mysql.createPool({
	connectionLimit: 4,
	user: process.env.GAPI_DATABASE_USER,
	password: process.env.GAPI_DATABASE_PASSWORD,
	database: process.env.GAPI_DATABASE_NAME,
        host: process.env.GAPI_DATABASE_HOST
});
	
exports.query = function() { connection.query.apply(connection, arguments); };

