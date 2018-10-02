const express = require('express');
const spdy = require('spdy');
const fs = require('fs');

const app = express();
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const cors = require('cors');
const helmet = require('helmet');
const hbs_utils = require('hbs-utils');
// const routes = require('./routes/index');
const router = express.Router();

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt'),
};

app.use(logger('dev'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(router);

app.use(cookieParser());

// serve zip files
app.get('*.js', function (req, res, next) {
      // only if file exists, the substr is to remove /assets in front
      console.log(`\n\nreq for JS:${req.url}\n\n`);
      if (!fs.existsSync(`./public/${req.url}.gz`)) {
        return next();
    }
    console.log(`\n\nreq for JS:${req.url}\n\n`);
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    next();
  });

app.use(express.static(path.join(__dirname, 'public')));

const breed = require('./routes/breed_routes');
const mouse = require('./routes/mouse_routes');
const cage = require('./routes/cage_routes');
const graphql = require('./routes/graphql_routes');


// handel bars helpers
const hbs = require('hbs');

const hbsutils = hbs_utils(hbs);

const helpers = require('handlebars-helpers')({
    handlebars: hbs.handlebars,
});

// helpers.comparison({ handlebars: hbs.handlebars });

app.set('port', (process.env.PORT || 5000));

// reg partials
hbsutils.registerPartials(`${__dirname}/views/partials`);
hbsutils.registerWatchedPartials(`${__dirname}/views/partials`);

hbs.registerPartials(`${__dirname}/views/partials/form-elements`);
hbsutils.registerWatchedPartials(`${__dirname}/views/partials/form-elements`);


// views is directory for all template files
app.set('views', `${__dirname}/views`);
app.set('view engine', 'hbs');

app.use('/breed', breed);
app.use('/mouse', mouse);
app.use('/cage', cage);
app.use('/g', graphql);


app.get('/', (request, response) => {
    response.render('pages/index');
});


// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res) => {
        // res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
        err,
    });
});

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});

spdy
    .createServer(options, app)
    .listen(5001, (err) => {
        if (err) {
            throw new Error(err);
        }
        console.log(`Listening on port: ${5001}.`);
    });