/**
 * Created by holger on 08.09.2014.
 */
var express = require('express');
var log4js = require('log4js');
var path = require('path');
var halson = require('halson');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var datastore = require(app_constants.packagedModule('infrastructure', 'datastore'));

var router = express.Router();
var logger = log4js.getLogger('routers.tags');

var halsonifyTags = function(tags, baseUrl) {
    var tagResource;
    var halsonTags = [];
    var i;
    var tagLength = tags.length;
    for (i = 0; i < tagLength; i++) {
        tagResource = new halson({ tag: tags[i] });
        tagResource.addLink('self', baseUrl + tags[i]);
        halsonTags.push(tagResource);
    }
    return halsonTags
};

// This is a controller!
/* GET tags data */
router
    .get('/tags', function(req, res, next) {
        datastore.dao.tags.selectTags(
            function() {
                /* TODO implement filter function to select only specific tags*/
            },
            function(err) {
                logger.error('Error querying', err);
                res.status(503).send('Unable to query tags');
                next();
            },
            function(tags) {
                var halsonTags;
                logger.debug('Returning these tags: ', tags);
                halsonTags = halsonifyTags(tags, '/api/tags/');
                res.status(200).send(JSON.stringify(halsonTags));
            }
        );
    });
module.exports = router;
