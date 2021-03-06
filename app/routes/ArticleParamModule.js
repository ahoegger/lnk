/**
 * Module providing functionality for the article as parameter in a path
 * @module backend/routes/ArticleParamModule
 * @author Holger Heymanns
 * @since 12.10.2014
 */

var path = require('path');
var log4js = require('log4js');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));

var logger = log4js.getLogger('routes.ArticleParamModule');

function _paramFunction(req, res, next, articleId) {
    var articleResultSet;
    var singleArticle;
    var queryFunction = function (entity) {
        return entity.id === parseInt(articleId);
    };
    articleResultSet = this.datastore.selectArticles(queryFunction, {
        includeTags: true,
        includeComments: true,
        includeVoteCount: true,
        includeUser: true,
        voteUserId: req.user ? res.user.id : undefined
    });
    if (!articleResultSet || articleResultSet.length === 0) {
        // not found
        res.status(404);
        return next(new Error('Article not found'));
    }
    if (articleResultSet.length > 1) {
        res.status(500);
        return next(new Error('Internal server error'));
    }
    singleArticle = articleResultSet[0];
    singleArticle.tags = this.datastore.selectTagsForArticle(singleArticle.id);
    req.article = singleArticle;
    logger.debug('Added following article to request: ' + req.article);
    next();
}

module.exports = function(datastore) {
    this.datastore = datastore;

    /**
     * The return value is an array of objects each with a paramId property and a paramFunction
     */
    return [
            {
                paramId: ":articleId",
                paramFunction: _paramFunction
            }
        ]
};