var nconf = require('nconf');

function Conf() {
  nconf.argv()
    .env()
    .file({ file: 'config.json' });
};

Conf.prototype.get = function(item) {
 return nconf.get(item);
}


if(typeof module !== 'undefined' && module.exports) {
  module.exports = new Conf();
} 