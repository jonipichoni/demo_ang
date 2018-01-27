var log4js = require('log4js');
var conf = require('./conf');
var sql = require('./sql');
var logger = log4js.getLogger();

function CCData() {

};

CCData.prototype.getCCData = function (req,res) {
  logger.debug("getCCData");

  var respCb = function (result,valid) {
    if(!valid) {
      res.status(401);
      res.json({ 'error': 'Database failed' });
    } else {
      res.status(200);
      res.json(result['recordset']);
    }
  };

  sql.exec('select * from credit_card',respCb);


};


if(typeof module !== 'undefined' && module.exports) {
  module.exports = new CCData();
}