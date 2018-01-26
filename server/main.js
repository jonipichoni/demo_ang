var express = require('express');
var morgan = require('morgan'); 
var bodyParser = require('body-parser');
var path = require("path");
var fs    = require('fs');
var log4js = require('log4js');

var conf = require('./conf');
var ldapClient = require('./ldap');
var auth = require('./auth');



// LOG CONFIG
var logConfig   = conf.get('log');
var logFileName = logConfig['fileName'] || 'server.log';
var logLevel    = logConfig['level'] || 'debug';

log4js.configure({
  appenders: { 
  	tofile: { type: 'file', 
      filename: logFileName},
  	console: { type: 'console' }
  },
  categories: { default: { appenders: ['tofile','console'], level: logLevel } }
});

var logger = log4js.getLogger();

function valCred(ret) {	
	if(ret) {
		logger.debug("Connection to Ldap: OK");
	} else {
    var ret = "Connection to Ldap: Failed";
		logger.error(ret);
    throw (ret);
	}
}


if(!ldapClient.validateCredentials(
    conf.get('ldap')['bindDN'],
    conf.get('ldap')['bindCredentials'],
    valCred)) {
  logger.error('Failed to connect to the ldap server');
}


var app = express();
// Logger express modules
app.use(log4js.connectLogger(logger));
app.use(morgan('dev'));

app.set('port', (process.env.PORT || conf.get('port') || 8080));

if(typeof conf.get('jwt_secret') === 'undefined') {
  logger.error("Missing jwt secret on config");
  return;
}
app.set('superSecret', conf.get('jwt_secret')); 

app.use('/', express.static(__dirname + '/../dist'));
app.use('/scripts', express.static(__dirname + '/../node_modules'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/*app.use(function (req, res, next) {
    if (path.extname(req.path).length > 0) {
        // normal static file request
        next();
    }
    else {
        // redirect all html requests to `index.html`
        res.sendFile(path.resolve(__dirname + '/../dist/index.html'));
    }
});*/


// Not middleware api calls
app.get('/login', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../dist/index.html'));
})

// POST method route
app.post('/api/authenticate', function (req, res) {
  auth.authenticateUser(req,res);
})

app.get('/api/checkAuth', function (req, res) {
  auth.checkAuth(req,res);
})


// Middleware to protect following routes?
// req._isAuth , is it authed?
// req._userName , username of the logged user
app.use(function(req, res, next) {
  auth.middleAuth(req,res);
  next();
});

// Middleware api calls

app.get('/api/random', function (req, res) {
  res.send("OK");
})


app.listen(app.get('port'), function() {
    logger.debug('Demo Angular istening on port '+app.get('port'));
});