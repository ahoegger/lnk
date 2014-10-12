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

/*
router.param(':articleId', function(req, res, next, articleId) {
    var articleResultSet;
    var queryFunction = function(entity) {
        return entity.id === parseInt(articleId);
    };
    articleResultSet = inMemoryDatabase.selectArticles(queryFunction);
    if(!articleResultSet || articleResultSet.length === 0) {
        // not found
        res.status(404);
        return next(new Error('Article not found'));
    }
    if(articleResultSet.length > 1) {
        res.status(500);
        return next(new Error('Internal server error'));
    }
    req.article = articleResultSet[0];
    logger.debug('Added following article to request: ' +  req.article);
    next();
});
*/
/*
router.param(':commentId', function(req, res, next, commentId) {
    var commentResultSet;
    var queryFunction = function(entity) {
        return entity.id === parseInt(commentId);
    };
    commentResultSet = inMemoryDatabase.selectComments(queryFunction);
    if(!commentResultSet || commentResultSet.length === 0) {
        // not found
        res.status(404);
        return next(new Error('Comment not found'));
    }
    if(commentResultSet.length > 1) {
        res.status(500);
        return next(new Error('Internal server error'));
    }
    req.comment = commentResultSet[0];
    logger.debug('Added following comment to request: ' +  req.comment);
    next();
});
*/

router
    .get('/articles', articleRouterModule.getArticles)
    .get('/article/:articleId', articleRouterModule.getSingleArticle)
    .get('/article/:articleId/tags', articleRouterModule.getSingleArticleTags)
    .get('/article/:articleId/comments', articleRouterModule.getSingleArticleComments)
    .get('/article/:articleId/comment/:commentId', articleRouterModule.getSingleArticleComments)
    .post('/articles', articleRouterModule.postArticle)
    .post('/article/:articleId/voteUp', articleRouterModule.postVoteUp)
    .post('/article/:articleId/voteDown', articleRouterModule.postVoteDown)
    .post('/article/:articleId/comments', articleRouterModule.postSingleArticleComment);

module.exports = router;
