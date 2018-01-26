const sql = require('mssql');
var log4js = require('log4js');
var conf = require('./conf');
var logger = log4js.getLogger();

/*

Open SQL Server Configuration Manager, and then expand SQL Server 2012 Network Configuration.
Click Protocols for InstanceName, and then make sure TCP/IP is enabled in the right panel and
 double-click TCP/IP.
On the Protocol tab, notice the value of the Listen All item.
Click the IP Addresses tab: If the value of Listen All is yes, 
the TCP/IP port number for this instance of SQL Server 2012 is the value of the TCP Dynamic Ports 
item under IPAll. If the value of Listen All is no, the TCP/IP port number for this instance of
 SQL Server 2012 is the value of the TCP Dynamic Ports item for a specific IP address.
Make sure the TCP Port is 1433.
Click OK.

*/

var dbConfig = conf.get('db');

if(typeof dbConfig['user'] === 'undefined' ||
    typeof dbConfig['password'] === 'undefined' ||
    typeof dbConfig['server'] === 'undefined' ||
    typeof dbConfig['database'] === 'undefined') {

    var err = "Missing DB config on config.json";
    logger.error(err);
    throw (err);
    return;
}

function SqlClient() {
  this._config = {
    user: dbConfig['user'],
    password: dbConfig['password'],
    server: dbConfig['server'], // You can use 'localhost\\instance' to connect to named instance
    database: dbConfig['database'],

    options: {
      encrypt: true // Use this if you're on Windows Azure
    }
  };
};

SqlClient.prototype.checkDB = function (cb) {
  logger.debug("sql: checkDB");

  // connect to your database
  sql.connect(this._config, function (err) {

      if (err) {
        logger.error(err);
        cb(false);
        return;
      }

      cb(true);
      return;
  });

  sql.on('error', err => {
    // ... error handler
    logger.error(err);
    cb(false);
    return;
  })

  return;
};

SqlClient.prototype.getCCList = function (cb) {

  logger.debug("sql: getting cc ");

  // connect to your database
  sql.connect(this._config, function (err) {

      if (err) {
        logger.error(err);
        cb(false);
        return;
      }

      // create Request object
      var request = new sql.Request();

      // query to the database and get the records
      request.query('select * from credit_card', function (err, recordset) {

          if (err)  {
            logger.error(err);
            cb(false);
            return;
          }

          // send records as a response
          //res.send(recordset);
          console.log(recordset);
          cb(true);
          return;

      });
  });

  sql.on('error', err => {
    // ... error handler
    logger.error(err);
    cb(false);
    return;
  })

  return;

};



if(typeof module !== 'undefined' && module.exports) {
  module.exports = new SqlClient();
}