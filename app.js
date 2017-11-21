String.prototype.lpad = function (padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
};

// official server
//const sources = ['phpbb', 'cache'];
// live mirror server
const sources = ['graphapi', 'cache'];

const express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    group = require('./routes/group'),
    join = require('path').join,
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    bodyParser = require('body-parser');

const app = express();

app.set('sources', sources);
app.set('base', 'https://graph.pirati.info');
app.set('sameAsBase', 'https://graph.pirati.cz');
app.set('port', process.env.PORT || 3042);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.enable('trust proxy');
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(favicon(join(__dirname, 'public/favicon.ico')));
app.use(logger('dev'));
app.set('json spaces', 2);
app.use(express.static(join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/user/:id', user.get);
app.get('/user/:id/groups', user.getGroups);
app.get(/^\/(deadbeef-babe-f001-\d{12})$/, user.getById);
app.get(/^\/(deadbeef-babe-f001-\d{12})\/groups$/, user.getGroupsById);

app.get('/groups', group.list);
app.get('/group/:name', group.getByName);
app.get('/group/:name/members', group.getMembersByName);
app.get(/^\/(deadbeef-babe-f002-\d{12})$/, group.getById);
app.get(/^\/(deadbeef-babe-f002-\d{12})\/members$/, group.getMembersById);

app.listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});
