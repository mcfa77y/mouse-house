var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var pg = require('pg');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors')
// var routes = require('./routes/index');
var Sequelize = require('sequelize')

const rp = require('request-promise');
var app = express();
// var routes = require('./routes/index');
// handel bars helpers
var hbs = require('hbs');
var hbsutils = require('hbs-utils')(hbs);
var helpers = require('handlebars-helpers')({handlebars: hbs.handlebars});
//helpers.comparison({handlebars: hbs.handlebars});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
// reg partials
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerPartials(__dirname + '/views/partials/form-elements');
hbsutils.registerWatchedPartials(__dirname + '/views/partials');
hbsutils.registerWatchedPartials(__dirname + '/views/partials/form-elements');

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.get('/', function(request, response) {
  response.render('pages/index')
});

app.get('/mouse', function(request, response) {
  response.render('pages/mouse')
});
app.get('/cage', function(request, response) {
  response.render('pages/cage')
});
app.get('/breed', function(request, response) {
  response.render('pages/breed')
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

var sequelize = new Sequelize('joelau', '', '', {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});


app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));