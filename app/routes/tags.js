/**
 * Created by holger on 08.09.2014.
 */
var express = require('express');
var path = require('path');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var articleModule = require(app_constants.packagedModule('data', 'article_entity'));
var datastore = require(app_constants.packagedModule('infrastructure', 'datastore'));

var router = express.Router();

/**
 * This function parses the properties of the given object and transform them into a JSON string
 * @param {Object} setObject The object, whos properties shall be transformed into an JSON array
 * @return {String} JSON String of the properties of the object
 */
// TODO This together with the logic in the datastore for the tags should be a "set mocking class"
function parseSetToJson(setObject) {
    var tags = [];
    for (var key in setObject) {
        tags.push(key);
    }
    return JSON.stringify(tags);
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
                console.dir(parseSetToJson(tags));
                res.status(200).send(parseSetToJson(tags));
            }
        );
    });
module.exports = router;
