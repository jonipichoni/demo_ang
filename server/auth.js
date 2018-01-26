var log4js = require('log4js');
var conf = require('./conf');
var logger = log4js.getLogger();
var ldapClient = require('./ldap');

//https://github.com/auth0/node-jsonwebtoken
var jwt    = require('jsonwebtoken');

function Auth() {
  
};

Auth.prototype.middleAuth = function (req,res) {
  req._isAUth = false;
  req._userName = "";

  if (!req.headers.authorization) {
    return;
  }

  var token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, conf.get('jwt_secret'), function(err, decoded) {
    if (!err) {
      req._isAUth = true;
      req._userName = decoded['user'];
    }
  });
}

Auth.prototype.checkAuth = function (req,res) {

  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'No authorization header found' });
  }

  var token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, conf.get('jwt_secret'), function(err, decoded) {
    if (err) {
      res.status(401);
      res.send(JSON.stringify({ 'error': err }));
    } else {
      res.status(200);
      res.send(JSON.stringify({ 
        'data': decoded 
      }));
    }
  });

  return;

};

Auth.prototype.authenticateUser = function (req,res) {

  if(typeof req.body.username === 'undefined' ||
    typeof req.body.password === 'undefined') {
    
    var ret ='Username or Password missing'; 
    logger.debug(ret)
    res.status(400);
    res.send(JSON.stringify({ error: ret }));

    return;
  }

  var username = req.body.username;
  var password = req.body.password;

  var ldapcb = function(ret) {
    if(ret) {

      const payload = {
        user: username
      };
      var token = jwt.sign(payload, conf.get('jwt_secret'), {
        expiresIn: 60*60 // expires in seconds 60*60 = 1h
      });

      /*res.headers = {};
      res.headers.authorization = 'Bearer ' + token;*/

      res.status(200);
      res.send(JSON.stringify({ 
        token: token ,
        userName: username
      }));
    } else {
      res.status(401);
      res.send(JSON.stringify({ error: 'Authentication Failed' }));
    }
  }

  ldapClient.validateCredentials(username,password,ldapcb);

};

if(typeof module !== 'undefined' && module.exports) {
	module.exports = new Auth();
}