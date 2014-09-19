/**
 * Created by holger on 05.09.2014.
 */
var express = require('express');
var path = require('path');
var log4js = require('log4js');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));

var datastore = require(app_constants.packagedModule('infrastructure', 'datastore'));
var articleModule = require(app_constants.packagedModule('data', 'article_entity'));
var router = express.Router();
var logger = log4js.getLogger('routers.articles');

function parseBodyToArticle(json) {
    return articleModule.fromJson(json);
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
        console.log(req.body);
        console.dir(parseBodyToArticle(req.body));
        datastore.dao.articles.insert(
            parseBodyToArticle(req.body),
            function(err) {
                logger.error('Error posting article ', err);
                res.status(503).send('Unable to store data');
                next();
            },
            function(newDoc) {
                logger.info('Success inserting new document ', newDoc);
                res.status(201).send(JSON.stringify(newDoc));
                next();
            }
        );
    });

module.exports = router;
