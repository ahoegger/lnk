/**
 * Created by Holger on 27.11.2014.
 * Module providing functionality for the tag as parameter in a path
 * @module backend/routes/TagParamModule
 */

var path = require('path');
var log4js = require('log4js');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));

var logger = log4js.getLogger('routes.ArticleParamModule');

function _paramFunction(req, res, next, tagId) {
    var tagResultSet;
    var singleTag;
    var queryFunction = function (entity) {
        return entity.id === parseInt(tagId);
    };
    tagResultSet = this.datastore.selectTags(queryFunction);
    if (!tagResultSet || tagResultSet.length === 0) {
        // not found
        res.status(404);
        return next(new Error('Tag not found'));
    }
    if (tagResultSet.length > 1) {
        res.status(500);
        return next(new Error('Internal server error'));
    }
    singleTag = tagResultSet[0];
    req.tag = singleTag;
    logger.debug('Added following tag to request: ' + req.tag);
    next();
}

module.exports = function(datastore) {
    this.datastore = datastore;

    /**
     * The return value is an array of objects each with a paramId property and a paramFunction
     */
    return [
        {
            paramId: ":tagId",
            paramFunction: _paramFunction
        }
    ]
};