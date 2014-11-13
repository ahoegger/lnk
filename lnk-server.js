/**
 * This is the express server of the web application
 * Created by holger on 31.08.2014.
 */
'use strict';
// the requirements
var express = require('express');
var requestLogger = require('morgan');     // a requestLogger
var http = require('http');
var path = require('path');                       // path utilities
var favicon = require('serve-favicon');           // fav-icon handling
var lessMiddleware = require('less-middleware');  // less middleware, compiles the .less files into .css on the fly; gulp had done this before
var bodyParser = require('body-parser');          // middleware for body-parsing
var log4js = require('log4js');
var logger = log4js.getLogger('lnk-server');

var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));

var dataStore = require(app_constants.packagedModule('infrastructure', 'InMemorydataStore.js'));
var initialLoader = require(app_constants.packagedModule('data', 'InitialLoad.js'))(dataStore);

var articlesRouter = require(app_constants.packagedModule('routes', 'ArticleRouter.js'));
var tagsRouter = require(app_constants.packagedModule('routes', 'tags'));
var userRouter = require(app_constants.packagedModule('routes', 'UserRouter.js'));
var authenticationRouter = require(app_constants.packagedModule('routes', 'AuthenticationRouter.js'));
// constants and basic variables
var express_server_port = process.env.PORT || 5000;

var public_root_path = path.join(app_constants.appPath, 'public');
var bower_root_path = path.join(app_constants.appPath, 'bower_components');
var fonts_root_path = path.join(app_constants.appPath, 'bower_components/font-awesome/fonts');

// The express server
var app = express();

// Generic handling of request
app.use(favicon(path.join(public_root_path, 'favicon.ico')));      // handle favicon requests in a special way
app.use(requestLogger('combined'));                                       // use morgan requestLogger function
app.use(lessMiddleware(public_root_path, {compress: true}));       // transpiles a requested css from a less file, if the css is missing

// serving static content
//app.use(express.static(public_root_path));                         // serve static files
app.use(express.static( path.join(app_constants.appPath, 'client')));                         // serve static files
app.use('/bower_components',  express.static(bower_root_path));    // bower components are not inside public
app.use('/fonts',  express.static(fonts_root_path));               // needed because of font-awesome.css, gulp had done this before

// handling api requests
app.use(bodyParser.json());
app.use('/api', articlesRouter);
app.use('/api', tagsRouter);
app.use('/api', userRouter);
app.use('/api', authenticationRouter);

// error handler
app.use('/api', function(err, req, res){
    logger.warn(err.stack);
    if (res.send != undefined) {
        res.send(err.message);
    } else {
        logger.debug('Not returning error message, as response is already sent.');
    }
});
app.use(function(err, req, res){
    logger.warn(err.stack);
    res.status(500).send('Internal server error');
});

// Initialload data
initialLoader.loadArticles(app_constants.packagedModule('data', 'articles.json'));
initialLoader.loadComments(app_constants.packagedModule('data', 'comments.json'));
initialLoader.loadUsers(app_constants.packagedModule('data', 'users.json'));
initialLoader.loadVotes(app_constants.packagedModule('data', 'votes.json'));

// start der server
http.createServer(app).listen(express_server_port);
console.log('Server started on localhost:' + express_server_port + '; press Ctrl-C to terminate....');