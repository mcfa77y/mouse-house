
import express from 'express';

const app = express();
import path from 'path';
import logger from 'morgan'
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
// const cors = require('cors');
import helmet from 'helmet';
import hbs_utils from 'hbs-utils';
import session from 'express-session';
// const routes = require('./routes/index');
const router = express.Router();


app.use(logger('dev'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(router);

app.use(cookieParser());

// const foo = __dirname.substring(4);
const foo = __dirname;
const bar = path.join(foo, '..', 'public')
console.log(`static path: ${bar}`);
app.use(express.static(bar));

app.set('trust proxy', 1); // trust first proxy
app.use(session({
    secret: 'Zw$shAt$27U%*{5v',
    resave: false,
    saveUninitialized: true,
}));

// handel bars helpers
import hbs from 'hbs';
import helpers from 'handlebars-helpers';

import breed from './routes/breed_routes';
import mouse from './routes/mouse_routes';
import cage from './routes/cage_routes';
import grid from './routes/grid_routes';
import project from './routes/project_routes';

const hbsutils = hbs_utils(hbs);


helpers.string({ handlebars: hbs.handlebars });
helpers.comparison({ handlebars: hbs.handlebars });

app.set('port', (process.env.PORT || 5000));

// reg partials
hbs.registerPartials(`${__dirname}/views/partials`);
// hbsutils.registerPartials(`${__dirname}/views/partials`);
// hbsutils.registerWatchedPartials(`${__dirname}/views/partials`);

hbs.registerPartials(`${__dirname}/views/partials/form-elements`);
// hbsutils.registerWatchedPartials(`${__dirname}/views/partials/form-elements`);

// views is directory for all template files
app.set('views', `${__dirname}/views`);
app.set('view engine', 'hbs');

app.use('/breed', breed);
app.use('/mouse', mouse);
app.use('/cage', cage);
app.use('/grid', grid);
app.use('/project', project);


app.get('/', (request, response) => {
    response.render('pages/index');
});


// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    // err.status = 404;
    next(err);
});
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        // res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        err,
    });
});

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});
