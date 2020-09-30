import cookieParser from 'cookie-parser';
import { Application, Router } from 'express';
import session from 'express-session';
import helpers from 'handlebars-helpers';
// handel bars helpers
import hbs from 'hbs';
import hbs_utils from 'hbs-utils';
import helmet from 'helmet';
import logger from 'morgan';
import path from 'path';
import { parseHrtimeToSeconds, rm_expr_img_meta, update_image_metadata } from './process_experiment_images';
import experiment from './routes/experiment_routes';
import grid from './routes/grid/grid_routes';
import molecule from './routes/molecule_routes';
import platemap from './routes/platemap/platemap_routes';
import upload from './routes/upload/upload_routes';



import express = require('express');
// const cors = require('cors');


const app: Application = express();
const router = Router();

app.use(logger('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use(router);

app.use(cookieParser());

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
// process image locations before setting up static dir
const EXPIRIMENT_DIR = path.join(PUBLIC_DIR, 'experiments');
const startTime = process.hrtime();
update_image_metadata(EXPIRIMENT_DIR, true).then(() => {
    parseHrtimeToSeconds(process.hrtime(startTime), 'update_image_metadata');
});


console.log(`static path: ${PUBLIC_DIR}`);
app.use(express.static(PUBLIC_DIR));

app.set('trust proxy', 1); // trust first proxy
app.use(session({
    secret: 'Zw$shAt$27U%*{5v',
    resave: false,
    saveUninitialized: true,
}));

const hbsutils = hbs_utils(hbs);

helpers.string({ handlebars: hbs.handlebars });
helpers.comparison({ handlebars: hbs.handlebars });

app.set('port', (process.env.PORT || 5000));

const VIEW_DIR = path.join(__dirname, '..', 'views');
// reg partials
hbs.registerPartials(path.join(VIEW_DIR, 'partials'));
hbsutils.registerPartials(path.join(VIEW_DIR, 'partials'));
hbsutils.registerWatchedPartials(path.join(VIEW_DIR, 'partials'));

hbs.registerPartials(path.join(VIEW_DIR, 'partials/form-elements'));
hbsutils.registerWatchedPartials(path.join(VIEW_DIR, 'partials/form-elements'));

// views is directory for all template files
app.set('views', VIEW_DIR);
app.set('view engine', 'hbs');

// app.use('/breed', breed);
// app.use('/mouse', mouse);
// app.use('/cage', cage);
// app.use('/project', project);
// app.use('/dropbox', dropbox);
app.use('/grid', grid);
app.use('/experiment', experiment);
app.use('/upload', upload);
app.use('/molecule', molecule);
app.use('/platemap', platemap);


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
