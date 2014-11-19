/**
 * Created by holger on 05.09.2014.
 *
 * This module defines the routes and assigns the url to the effective functions
 * @module backend/routes/ArticleRouter
*/
var express = require('express');
var path = require('path');
var log4js = require('log4js');
var url = require('url');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));

var datastore = require(app_constants.packagedModule('infrastructure', 'InMemorydataStore.js'));

var routerHelperModule = require(app_constants.packagedModule('routes', 'RouterHelperModule.js'))();
var articleRouterModule = require(app_constants.packagedModule('routes', 'ArticleRouteModule.js'))(datastore);
var articleParamModule = require(app_constants.packagedModule('routes', 'ArticleParamModule.js'))(datastore);
var commentParamModule = require(app_constants.packagedModule('routes', 'CommentParamModule.js'))(datastore);
var jwt = require('express-jwt');       // route handler for authenticating against a token

var router = express.Router();

routerHelperModule.registerParamModule(router, articleParamModule);
routerHelperModule.registerParamModule(router, commentParamModule);

router
    .get('/articles', jwt({secret: app_constants.secret.secretToken, credentialsRequired: false}), articleRouterModule.getArticles)
    .get('/article/:articleId', jwt({secret: app_constants.secret.secretToken, credentialsRequired: false}), articleRouterModule.getSingleArticle)
    .get('/article/:articleId/tags', jwt({secret: app_constants.secret.secretToken, credentialsRequired: false}), articleRouterModule.getSingleArticleTags)
    .get('/article/:articleId/comments', jwt({secret: app_constants.secret.secretToken, credentialsRequired: false}), articleRouterModule.getSingleArticleComments)
    .get('/article/:articleId/comment/:commentId', jwt({secret: app_constants.secret.secretToken, credentialsRequired: false}), articleRouterModule.getSingleArticleComments)

    .post('/articles', jwt({secret: app_constants.secret.secretToken}), articleRouterModule.postArticle)
    .post('/article/:articleId/voteUp', jwt({secret: app_constants.secret.secretToken}), articleRouterModule.postVoteUp)
    .post('/article/:articleId/voteDown', jwt({secret: app_constants.secret.secretToken}), articleRouterModule.postVoteDown)
    .post('/article/:articleId/comments', jwt({secret: app_constants.secret.secretToken}), articleRouterModule.postSingleArticleComment)

    .put('/article/:articleId', jwt({secret: app_constants.secret.secretToken}), articleRouterModule.putArticle)

    .delete('/article/:articleId', jwt({secret: app_constants.secret.secretToken}), articleRouterModule.deleteArticle)

    // the following functions must still be implemented in this module
    .put('/article/:articleId/comment/:commentId', routerHelperModule.notYetImplementedHandler) // TODO Implement
    .delete('/article/:articleId/comment/:commentId', routerHelperModule.notYetImplementedHandler)  // TODO Implement
    .get('/article/:articleId/votes/:userId', routerHelperModule.notYetImplementedHandler)  // TODO Implement
    ;

module.exports = router;
