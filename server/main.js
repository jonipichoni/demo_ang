var express = require('express');
var morgan = require('morgan'); 
var bodyParser = require('body-parser');
var path = require("path");
var fs = require('fs');
var http = require('http');
var https = require('https');

var log4js = require('log4js');

var conf = require('./conf');
var ldapClient = require('./ldap');
var auth = require('./auth');
var sql = require('./sql');
var cc = require('./cc');



// LOG CONFIG
var logConfig   = conf.get('log');
var logFileName = logConfig['fileName'] || 'server.log';
var logLevel    = logConfig['level'] || 'debug';

log4js.configure({
  appenders: { 
  	tofile: { 
      type: 'file', 
      filename: logFileName
    },
  	console: { type: 'console' }
  },
  categories: { 
      default: { 
        appenders: ['tofile','console'], 
        level: logLevel 
      }
    }
});

var logger = log4js.getLogger();

// VALIDATE LDAP 
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

// VALIDATE DB
function valDB(ret) { 
  if(ret) {
    logger.debug("Connection to DB: OK");
  } else {
    var ret = "Connection to DB: Failed";
    logger.error(ret);
    throw (ret);
  }
}

sql.checkDB(valDB);


// CONFIGURE EXPRESS

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


var options = {
    key: fs.readFileSync('certificates/localhost.key'),
    cert: fs.readFileSync('certificates/localhost.crt'),
    requestCert: false,
    rejectUnauthorized: false
};

var server = https.createServer(options, app).listen(
  app.get('port'), 
  function(){
    logger.debug('Demo Angular istening on port '+app.get('port'));
  }
);

/*app.listen(app.get('port'), function() {
    logger.debug('Demo Angular istening on port '+app.get('port'));
});*/

// Not middleware api calls

app.get('/favicon.ico', function(req, res) {
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    res.end(/* icon content here */);
});

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

  if(!req._isAUth) {
    res.status(401);
    res.json({ 'error': 'Session expired or not valid' });
    return;
  }
  next();
});

// Middleware api calls

app.get('/api/random', function (req, res) {
  res.send("OK");
});

app.get('/api/res', function (req, res) {
  res.send("OK");
});

app.get('/api/users', function (req, res) {
  res.send("OK");
});

app.get('/api/cc', function (req, res) {
  cc.getCCData(req,res);
});

