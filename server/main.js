var express = require('express');
var morgan = require('morgan'); 
var bodyParser = require('body-parser');
var path = require("path");
var fs    = require('fs');
var log4js = require('log4js');

var conf = require('./conf');
var ldapClient = require('./ldap');


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
		logger.debug("GOOD2");
	} else {
		logger.debug("FALSE2");
	}
}

if(ldapClient.validateCredentials("FOREST\\Administrator","Test123",valCred)) {
	logger.debug("GOOD");
} else {
	logger.debug("BAD");
}


var app = express();
// Logger express modules
app.use(log4js.connectLogger(logger));
app.use(morgan('dev'));

app.set('port', (process.env.PORT || conf.get('port') || 8080));

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

app.get('/login', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../dist/index.html'));
})

// POST method route
app.post('/api/authenticate', function (req, res) {
	logger.debug("WTF2");
  res.send('POST request to the homepage');
})

app.listen(app.get('port'), function() {
    logger.debug('Angular2 fullstack listening on port '+app.get('port'));
});