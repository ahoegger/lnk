/**
 * This module defines the routes for the user API
 * @module backend/routes/UserRouter
 * @author Holger Heymanns
 * @since 25.06.2014
 */
var express = require('express');
var path = require('path');
var log4js = require('log4js');
var url = require('url');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));

var datastore = require(app_constants.packagedModule('data', 'InMemorydataStore.js'));
var jwt = require('express-jwt');       // route handler for authenticating against a token

var routerHelperModule = require(app_constants.packagedModule('routes', 'RouterHelperModule.js'))(datastore);
var userRouterModule = require(app_constants.packagedModule('routes', 'UserRouteModule.js'))(datastore);
var userParamModule = require(app_constants.packagedModule('routes', 'UserParamModule.js'))(datastore);

var router = express.Router();

routerHelperModule.registerParamModule(router, userParamModule);

router
    .get('/users', userRouterModule.getUsers)
    .get('/user/:userId', userRouterModule.getUser)
    .get('/user/:userId/articles', userRouterModule.getUserArticles)
    .post('/users', userRouterModule.postUser)
    .put('/user/:userId', jwt({secret: app_constants.secret.secretToken}), userRouterModule.putUser)
    .delete('/user/:userId', jwt({secret: app_constants.secret.secretToken}), userRouterModule.deleteUser)
    ;

module.exports = router;
