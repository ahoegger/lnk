/**
 * This module is the node express server application for .lnk - Love the things you find - share the things you love <3
 * This application has been developed during the CAS-FEE (Certificate of Advanced Studies  in Front End Engineering)
 * Developed by Andy Hoegger and Holger Heymanns
 * @module backend/lnk-server
 * @author Holger Heymanns
 * @author Andy Hoegger
 * @since ever
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

// Prepare the server (express.js) and the web socket server (socket.io)
var app = express();
var server = http.createServer(app);
var socket = require('socket.io').listen(server);       // require socket.io on basis of the express server

// start with the implementation of the business logic
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));

// Infrastructure
var dataStore = require(app_constants.packagedModule('data', 'InMemorydataStore.js'));
var initialLoader = require(app_constants.packagedModule('data', 'InitialLoad.js'))(dataStore);

// routers / route definition modules
var articlesRouter = require(app_constants.packagedModule('routes', 'ArticleRouter.js'))(socket);
var tagsRouter = require(app_constants.packagedModule('routes', 'TagRouter.js'));
var userRouter = require(app_constants.packagedModule('routes', 'UserRouter.js'));
var authenticationRouter = require(app_constants.packagedModule('routes', 'AuthenticationRouter.js'));
// constants and basic variables
var express_server_port = process.env.PORT || 3000;

// Static folders to serve
var public_root_path = path.join(app_constants.appPath, 'client');
var bower_root_path = path.join(app_constants.appPath, 'bower_components');
var fonts_root_path = path.join(app_constants.appPath, 'bower_components/font-awesome/fonts');
var api_base_uri = '/api';

// Generic handling of request
app.use(favicon(path.join(public_root_path, 'favicon.ico')));      // handle favicon requests in a special way
app.use(requestLogger('combined'));                                // use morgan requestLogger function
app.use(lessMiddleware(public_root_path, {compress: true}));       // transpiles a requested css from a less file, if the css is missing

// serving static content
//app.use(express.static(public_root_path));                         // serve static files
app.use(express.static( path.join(app_constants.appPath, 'client')));                         // serve static files
app.use(express.static( path.join(app_constants.appPath, 'socket.io')));                         // serve static files
app.use('/bower_components',  express.static(bower_root_path));    // bower components are not inside public
app.use('/fonts',  express.static(fonts_root_path));               // needed because of font-awesome.css, gulp had done this before

// attach routes for the ajax requersts to the base URL /api
app.use(bodyParser.json());
app.use(api_base_uri, articlesRouter);
app.use(api_base_uri, tagsRouter);
app.use(api_base_uri, userRouter);
app.use(api_base_uri, authenticationRouter);

// attach middleware error handler for errors based in ajax URI
app.use(api_base_uri, function(err, req, res){
    logger.warn('Error in api route', err, err.stack);
    if (res.send != undefined) {
        res.send(err.message);
    } else {
        logger.debug('Not returning error message, as response is already sent.');
    }
});

//
app.use(function(err, req, res){
    logger.warn('Processing error', err.stack);
    // Check error fo "status" not defined.
    res.status(500).send('Internal server error');
});

// Initialload data
initialLoader.loadArticles(app_constants.packagedModule('data', 'articles.json'));
initialLoader.loadComments(app_constants.packagedModule('data', 'comments.json'));
initialLoader.loadUsers(app_constants.packagedModule('data', 'users.json'));
initialLoader.loadVotes(app_constants.packagedModule('data', 'votes.json'));

// listeners on websockets
socket.on('connection', function(client){
    console.log('web socket client connected: ' + socket.id);
    client.on('disconnect', function(){
        console.log('web socket client disconnected: ' + socket.id);
    });
});

// start der server
server.listen(express_server_port, function(){
    console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
});