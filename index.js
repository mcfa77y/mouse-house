const cool = require('cool-ascii-faces');
const express = require('express');
const app = express();
const pg = require('pg');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors')
    // const routes = require('./routes/index');
const rp = require('request-promise');
const router = express.Router();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(router);

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



const breed = require('./routes/breed');
const mouse = require('./routes/mouse');
const cage = require('./routes/cage');

// const routes = require('./routes/index');
// handel bars helpers
const hbs = require('hbs');
const hbsutils = require('hbs-utils')(hbs);
const helpers = require('handlebars-helpers')({
    handlebars: hbs.handlebars
});
//helpers.comparison({handlebars: hbs.handlebars});

app.set('port', (process.env.PORT || 5000));

// reg partials
hbs.registerPartials(__dirname + '/views/partials');
hbsutils.registerWatchedPartials(__dirname + '/views/partials');

// hbs.registerPartials(__dirname + '/views/partials/form-elements');
// hbsutils.registerWatchedPartials(__dirname + '/views/partials/form-elements');

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

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
