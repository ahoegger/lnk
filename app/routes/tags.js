/**
 * Created by holger on 08.09.2014.
 */
var express = require('express');
var path = require('path');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var articleModule = require(app_constants.packagedModule('data', 'article_entity'));
var datastore = require(app_constants.packagedModule('infrastructure', 'datastore'));

var router = express.Router();
// current path of node.js root = process.cwd()  //cwd() = current working directory
var rootPath = path.resolve(process.cwd());

function parseBodyToArticle(json) {
    return articleModule.fromJson(json);
}

// This is a controller!
/* GET tags data */
router
    .get('/tags', function(req, res, next) {
        datastore.dao.tags.selectTags(
            function() {
                /* TODO implement filter function to select only specific tags*/
            },
            function(err) {
                console.log('Error querying');
                console.dir(err);
                res.status(503).send('Unable to query tags');
                next();
            },
            function(tags) {
                console.log('Received tags:');
                console.dir(tags);
            }
        );
    });
module.exports = router;
