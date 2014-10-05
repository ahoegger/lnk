/**
 * Created by Holger on 21.09.2014.
 */
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger('data.ArticlesDatabaseModule');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
//var articleModule = require(app_constants.packagedModule('data', 'article_entity'));
var ArticleClass = require(app_constants.packagedModule('entities', 'Article.js'));
var dbHelper = require(app_constants.packagedModule('data', 'InMemoryDatabaseHelper'));

var articles = [];

/**
 * This function inserts an article into the local datastore. Te article object will be cloned to achieve an independent
 * copy in the datastore array
 * @param {Article} article
 * @return {Article} The cloned article with the ID added
 * @private
 */
function _insertArticle(article) {
    var newId;
    var clonedArticle;
    dbHelper.checkInstance(article, ArticleClass.Article);
    if(dbHelper.findPositionById(articles, 'id', article.id) !== undefined) {
        logger.warn('Article with ID ' + article.id + ' already exists.');
        throw new Error('Unique key constraint violation');
    }
    newId = dbHelper.getNewId(articles, 'id');
    if (newId === undefined) {
        logger.warn('Unable to retrieve new ID from in memory datastore.');
        throw new Error('Generic insert error');
    }
    clonedArticle = article.clone();
    clonedArticle.id = newId;
    articles.push(clonedArticle);
    return clonedArticle;
}

/**
 * This functions searches an article with the given ID
 * @param id
 * @return {Article} The article object
 * @private
 */
function _selectArticle(id) {
    var position;
    position = dbHelper.findPositionById(articles, 'id', id);
    if(position === undefined) {
        logger.info('Article with id ' + id + ' not found');
        throw new Error('No found')
    }
    return articles[position].clone();
}

module.exports = {
    insertArticle: _insertArticle,
    selectArticle: _selectArticle
};