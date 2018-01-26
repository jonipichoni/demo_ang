var ldap = require('ldapjs');
var log4js = require('log4js');
var conf = require('./conf');

var logger = log4js.getLogger();

var ldapConfig = conf.get('ldap');

if(typeof ldapConfig['server'] === 'undefined' ||
    typeof ldapConfig['port'] === 'undefined' ||
    typeof ldapConfig['base'] === 'undefined' ||
    typeof ldapConfig['bindDN'] === 'undefined' ||
    typeof ldapConfig['bindCredentials'] === 'undefined') {

    var err = "Missing Ldap config on config.json";
    logger.error(err);
    throw (err);
    return;
}

function LdapClient() {
	this._options = {
  	url:             "ldap://"+ldapConfig['server']+":"+ldapConfig['port']
  };
  
};

LdapClient.prototype.validateCredentials = function (user,password,cb) {

  logger.debug("ldap: validating credentials for: ",user);

	var client  = ldap.createClient({
    url:            this._options.url,
  });

  client.on('error', function(err){
		logger.error('LDAP connection error:', err);
    cb(false);
    return;
	});

  client.bind(user,password, function(err) {
    if(err){
        logger.error("Error binding to LDAP", 'dn: ' + err.dn + 
          '\n code: ' + err.code + '\n message: ' + err.message);
        cb(false);
        return;
    }
    logger.debug("Bind correct");
    cb(true);
    return;
  });

  return true;

};

if(typeof module !== 'undefined' && module.exports) {
	module.exports = new LdapClient();
}