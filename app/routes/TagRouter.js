var express = require('express');
var path = require('path');
var log4js = require('log4js');
var url = require('url');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));

var datastore = require(app_constants.packagedModule('data', 'InMemorydataStore.js'));

var routerHelperModule = require(app_constants.packagedModule('routes', 'RouterHelperModule.js'))();
var tagRouterModule = require(app_constants.packagedModule('routes', 'TagRouteModule.js'))(datastore);
var tagParamModule = require(app_constants.packagedModule('routes', 'TagParamModule.js'))(datastore);

var router = express.Router();

routerHelperModule.registerParamModule(router, tagParamModule);

router
    .get('/tags', tagRouterModule.getTags)
    .get('/tag/:tagId', tagRouterModule.getTag)
    .get('/tag/:tagId/articles', tagRouterModule.getTagArticles)
;

module.exports = router;
