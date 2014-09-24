/**
 * Created by holger on 05.09.2014.
 */
var express = require('express');
var path = require('path');
var log4js = require('log4js');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));

var datastore = require(app_constants.packagedModule('infrastructure', 'datastore'));
var ArticleClass = require(app_constants.packagedModule('entities', 'Article.js'));
var TagClass = require(app_constants.packagedModule('entities', 'Tag.js'));
var articleDB = require(app_constants.packagedModule('data', 'ArticlesDatabaseModule'));
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

// This is a controller!
/* GET article data */
router
    .get('/articles', function(req, res, next) {
        // TODO Implement proper query string from HTTP query string
        var query = {
            'title': {$gte: 'Jersey' }
        };
        datastore.dao.articles.select(
            query,
            function(err) {
                logger.error('Error querying', err);
                res.status(503).send('Unable to query data');
                next();
            }  ,
            function(docs) {
                logger.debug('Success querying these docs: ', docs);
                res.status(200).send(JSON.stringify(docs));
                next();
            }
        );
    })
    .post('/article', function(req, res, next) {
        var articleObject = new ArticleClass.Article();
        articleObject.updateFromJsonObject(req.body);
        var tagsArray = createTagsFromJsonBody(req.body);
        logger.debug('Request body:', req.body);
        logger.debug('Created article object from request', articleObject);
        logger.debug('Created tags object from request', tagsArray);
//        articleDB.insert(articleObject);

    });

module.exports = router;
