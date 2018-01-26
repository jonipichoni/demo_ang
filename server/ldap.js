var ldap = require('ldapjs');
var log4js = require('log4js');

var logger = log4js.getLogger();

function LdapClient() {
	this._options = {
  	url:             "ldap://192.168.1.39:389",
  	base:            "DC=FOREST,DC=COM",
  	bindDN:          "FOREST\\Administrator",
  	bindCredentials: "Test1235"
  };
  
};

LdapClient.prototype.validateCredentials = function (user,password,cb) {

  logger.debug("Validate Credentials");

	var client  = ldap.createClient({
    url:            this._options.url,
  });

  client.on('error', function(err){
		console.log('LDAP connection error:', err);
	});

  client.bind(user,password, function(err) {
    if(err){
        logger.error("Error binding to LDAP", 'dn: ' + err.dn + 
          '\n code: ' + err.code + '\n message: ' + err.message);
        cb(false);
        return;
    }
    console.debug("Bind correct");
    cb(true);
  });

};

if(typeof module !== 'undefined' && module.exports) {
	module.exports = new LdapClient();
}