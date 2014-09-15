/**
 * Created by holger on 08.09.2014.
 */
var express = require('express');
var path = require('path');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var datastore = require(app_constants.packagedModule('infrastructure', 'datastore'));

var router = express.Router();

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
                res.status(200).send(JSON.stringify(tags));
            }
        );
    });
module.exports = router;
