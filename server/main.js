var express = require('express');
var morgan = require('morgan'); 
var bodyParser = require('body-parser');
var path = require("path");

var app = express();
app.set('port', (process.env.PORT || 8080));

app.use('/', express.static(__dirname + '/../dist'));
app.use('/scripts', express.static(__dirname + '/../node_modules'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

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
	console.log("WTF2");
  res.send('POST request to the homepage');
})

app.listen(app.get('port'), function() {
    console.log('Angular2 fullstack listening on port '+app.get('port'));
});