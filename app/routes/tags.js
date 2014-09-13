/**
 * Created by holger on 08.09.2014.
 */
var express = require('express');
var articleModule = require('../data/article_entity');
var datastore = require('../infrastructure/datastore');
var router = express.Router();
var path = require('path');
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
                /* should be filter function */
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
