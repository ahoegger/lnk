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
var articleRouterModule = require(app_constants.packagedModule('routes', 'ArticleRouteModule.js'))(datastore);
var articleParamModule = require(app_constants.packagedModule('routes', 'ArticleParamModule.js'))(datastore);
var commentParamModule = require(app_constants.packagedModule('routes', 'CommentParamModule.js'))(datastore);

var router = express.Router();

routerHelperModule.registerParamModule(router, articleParamModule);
routerHelperModule.registerParamModule(router, commentParamModule);

router
    .get('/articles', articleRouterModule.getArticles)
    .get('/article/:articleId', articleRouterModule.getSingleArticle)
    .get('/article/:articleId/tags', articleRouterModule.getSingleArticleTags)
    .get('/article/:articleId/comments', articleRouterModule.getSingleArticleComments)
    .get('/article/:articleId/comment/:commentId', articleRouterModule.getSingleArticleComments)

    .post('/articles', articleRouterModule.postArticle)
    .post('/article/:articleId/voteUp', articleRouterModule.postVoteUp)
    .post('/article/:articleId/voteDown', articleRouterModule.postVoteDown)
    .post('/article/:articleId/comments', articleRouterModule.postSingleArticleComment)

    .put('/article/:articleId', articleRouterModule.putArticle)

    .delete('/article/:articleId', articleRouterModule.deleteArticle)

    // the following functions must still be implemented in this module
    .put('/article/:articleId/comment/:commentId', routerHelperModule.notYetImplementedHandler) // TODO Implement
    .delete('/article/:articleId/comment/:commentId', routerHelperModule.notYetImplementedHandler)  // TODO Implement
    .get('/article/:articleId/votes/:userId', routerHelperModule.notYetImplementedHandler)  // TODO Implement
    ;

module.exports = router;
