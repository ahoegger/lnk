/**
 * This module assigns the functions of the {@link module:backend/routes/AuthenticationRouteModule} to the URLs for authentication
 * @module backend/routes/AuthenticationRouter
 * @author Holger Heymanns
 * @since 12.10.2014
 */
var express = require('express');
var path = require('path');
var log4js = require('log4js');
var url = require('url');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));

var datastore = require(app_constants.packagedModule('data', 'InMemorydataStore.js'));

var authenticationRouterModule = require(app_constants.packagedModule('routes', 'AuthenticationRouteModule.js'))(datastore);

var router = express.Router();

router
    .post('/authentication', authenticationRouterModule.authenticate)
;

module.exports = router;
