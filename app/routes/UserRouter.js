/**
 * Created by holger on 05.09.2014.
 */
var express = require('express');
var path = require('path');
var log4js = require('log4js');
var url = require('url');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));

var datastore = require(app_constants.packagedModule('infrastructure', 'InMemorydataStore.js'));

var routerHelperModule = require(app_constants.packagedModule('routes', 'RouterHelperModule.js'))();
var userRouterModule = require(app_constants.packagedModule('routes', 'UserRouteModule.js'))(datastore);
var userParamModule = require(app_constants.packagedModule('routes', 'UserParamModule.js'))(datastore);

var router = express.Router();

routerHelperModule.registerParamModule(router, userParamModule);

router
    .get('/users', routerHelperModule.notYetImplementedHandler)
    .get('/user/:userId', userRouterModule.getUser)
    .post('/users', userRouterModule.postUser)
    .put('/user/:userId', userRouterModule.putUser)
    .delete('/user/:userId', userRouterModule.deleteUser)
    ;

module.exports = router;
