/**
 * Created by holger on 05.09.2014.
 */
var express = require('express');
var path = require('path');
var log4js = require('log4js');
var url = require('url');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var halson = require('halson');

var datastore = require(app_constants.packagedModule('infrastructure', 'datastore'));
var ArticleClass = require(app_constants.packagedModule('entities', 'Article.js'));
var TagClass = require(app_constants.packagedModule('entities', 'Tag.js'));
var inMemoryDatabase = require(app_constants.packagedModule('infrastructure', 'InMemoryDatastore.js'));
var router = express.Router();
var logger = log4js.getLogger('routers.articles');

/**
 * This function returns an array of Tag objects from the given JSON object as array
 * @param jsonObject JSON object, that contains a "tag" property
 * @return {Tag[]}
 */
function createTagsFromJsonBody(jsonObject) {
    var tagsSourceArray = jsonObject.tags;
    var tags = [];
    if (jsonObject.tags) {
        for (var i = 0, len = tagsSourceArray.length; i < len; i++) {
            tags.push(new TagClass.Tag(null, tagsSourceArray[i]));
        }
    }
    return tags;
}

function getArticleBaseLink(req, article) {
    return req.baseUrl + url.parse(req.url, true).pathname + '/' + article.id;
}

// This is a controller!
/* GET article data */
router
    .get('/articles', function(req, res, next) {
        // TODO Implement proper query string from HTTP query string
        var resultSet;
        var halsonResultSet = [];
        var halsonSingleArticle;
        var articleUrl = url.parse(req.url, true).pathname;
        var query = function(element) {
            return true;
        };
        resultSet = inMemoryDatabase.selectArticles(query);
        for (var i = 0, len = resultSet.length; i< len; i++) {
            halsonSingleArticle = new halson(resultSet[i]);
            halsonSingleArticle.addLink('self', articleUrl + '/' + resultSet[i].id);
            halsonSingleArticle.addLink('tags', articleUrl + '/' + resultSet[i].id + '/tags');
            halsonResultSet.push(halsonSingleArticle);
        }
        res.status(200).send(JSON.stringify(halsonResultSet));
        next();
    })
    // return the tags for the given article
    .get('/article/:articleId/tags', function(req, res, next) {
        var resultSet;
        var halsonResultSet = [];
        resultSet = inMemoryDatabase.selectTagsForArticle(parseInt(req.params.articleId));
        // TODO Implement halsonification
        res.status(200).send(JSON.stringify(resultSet));
        next();
    })
    .post('/article', function(req, res, next) {
        var articleObject = new ArticleClass.Article();
        var articleUrl;
        var halsonSingleArticle;
        var tagsArray;

        // prepare objects from request
        articleObject.updateFromJsonObject(req.body);
        tagsArray = createTagsFromJsonBody(req.body);

        logger.debug('Request body:', req.body);
        logger.debug('Created article object from request', articleObject);
        logger.debug('Created tags object from request', tagsArray);

        // insert objects
        articleObject = inMemoryDatabase.insertArticle(articleObject);  // insert the article
        inMemoryDatabase.insertArticleTags(articleObject, tagsArray);   // insert it's tags

        // build halson resources
        articleUrl = getArticleBaseLink(req, articleObject);
        halsonSingleArticle = new halson(articleObject);
        halsonSingleArticle.addLink('self', articleUrl);
        halsonSingleArticle.addLink('tags', articleUrl + '/tags');
        halsonSingleArticle.addLink('comments', articleUrl + '/comments');

        // return created article
        res.status(201).send(JSON.stringify(halsonSingleArticle));
        next();
    });

module.exports = router;
