// Use LDAP
var ldap = require('ldapjs');

//ldap.Attribute.settings.guid_format = ldap.GUID_FORMAT_B;

// ldapsearch -H ldap://192.168.1.39:389 -D "FOREST\Administrator" -w Test123 (bind)
// 

// http://ldapjs.org/client.html
// https://gist.github.com/jfromaniello/6537176
var options = this._options = {
    url:             "ldap://192.168.1.39:389",
    base:            "DC=FOREST,DC=COM",
    bindDN:          "FOREST\\Administrator",
    bindCredentials: "Test1235"
  };


var client  = ldap.createClient({
    url:            options.url,
    maxConnections: 10,
    bindDN:         options.bindDN,
    credentials:    options.bindCredentials  
  });

client.on('error', function(e){
	console.log('LDAP connection error:', e);
});

client.bind(options.bindDN, options.bindCredentials, function(err) {
    if(err){
        return console.log("Error binding to LDAP", 'dn: ' + err.dn + '\n code: ' + err.code + '\n message: ' + err.message);
    }
    //this.clientConnected = true;
    //this._queue.forEach(function (cb) { cb(); });

    console.log("Bind correct");
  });