/**
 * This is the express server of the web application
 * Created by holger on 31.08.2014.
 */
'use strict';
// the requirements
var express = require('express');
var logger = require('morgan');     // a logger
var http = require('http');
var path = require('path');         // path utilities
var favicon = require('serve-favicon');    // fav-icon handling
// var fs = require('fs');

// constants and basic variables
var express_server_port = 3000;

// The express server
var app = express();
app.use(favicon(path.join(__dirname, 'favicon.ico')));      // handle favicon requests in a special way
app.use(logger('combined'));                                // use morgan logger function
app.use(express.static(path.join(__dirname, 'public')));    // serve static files


// start der server
http.createServer(app).listen(express_server_port);

console.log('Server started on localhost:' + express_server_port + '; press Ctrl-C to terminate....');