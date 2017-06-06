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
const rp = require('request-promise');
var router = express.Router();
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(router);

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



var breed = require('./routes/breed');

var mouse = require('./routes/mouse');

var cage = require('./routes/cage');

// var routes = require('./routes/index');
// handel bars helpers
var hbs = require('hbs');
var hbsutils = require('hbs-utils')(hbs);
var helpers = require('handlebars-helpers')({
    handlebars: hbs.handlebars
});
//helpers.comparison({handlebars: hbs.handlebars});

app.set('port', (process.env.PORT || 5000));

// reg partials
hbs.registerPartials(__dirname + '/views/partials');
hbsutils.registerWatchedPartials(__dirname + '/views/partials');

hbs.registerPartials(__dirname + '/views/partials/form-elements');
hbsutils.registerWatchedPartials(__dirname + '/views/partials/form-elements');

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.use('/breed', breed);
app.use('/mouse', mouse);
app.use('/cage', cage);


app.get('/', function(request, response) {
    response.render('pages/index')
});



app.get('/cool', function(request, response) {
    response.send(cool());
});
app.get('/xxx', (req, res) => {

    ds.discoverModelDefinitions({ views: false, limit: 20 })
        .then((args) => {
            let dmp = args.map((arg) => {
                return arg.name
            })
            return BlueBird.reduce(dmp, (acc, tableName) => {
                return ds.discoverModelProperties(tableName).then((args) => {
                    return acc.add(args)
                })
            }, [])
        })
        .then((acc) => {
            res.render('pages/add_enum', { data: acc })
        })
        .catch((err) => {
            console.log("boo " + err)
            res.send(err)
        })

})
const db = require('./lib/database')
const squel = require('squel')
app.get('/db', function(request, response) {
    db.any(squel.select().from('enum').toString())
        .then((result) => {
            response.render('pages/db', {
                results: result
            });
        })
        .catch((err) => {
            console.error(err);
            response.send("Error " + err);
        })
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
