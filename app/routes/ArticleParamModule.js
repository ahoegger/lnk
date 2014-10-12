/**
 * Created by Holger on 12.10.2014.
 * Module providing functionality for the artile as parameter in a path
 */

var path = require('path');
var log4js = require('log4js');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));

var ArticleClass = require(app_constants.packagedModule('entities', 'Article.js'));

var logger = log4js.getLogger('routes.ArticleParamModule');

function _paramFunction(req, res, next, articleId) {
    var articleResultSet;
    var queryFunction = function (entity) {
        return entity.id === parseInt(articleId);
    };
    articleResultSet = this.datastore.selectArticles(queryFunction);
    if (!articleResultSet || articleResultSet.length === 0) {
        // not found
        res.status(404);
        return next(new Error('Article not found'));
    }
    if (articleResultSet.length > 1) {
        res.status(500);
        return next(new Error('Internal server error'));
    }
    req.article = articleResultSet[0];
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