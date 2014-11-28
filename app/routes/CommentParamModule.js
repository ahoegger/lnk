/**
 * Module providing functionality for the commentId  as parameter in a path
 * @module backend/routes/CommentParamModule
 * @author Holger Heymanns
 * @since 12.10.2014
 */

var path = require('path');
var log4js = require('log4js');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));

var logger = log4js.getLogger('routes.CommentParamModule');

function _paramFunction(req, res, next, commentId) {
    var commentResultSet;
    var queryFunction = function(entity) {
        return entity.id === parseInt(commentId);
    };
    commentResultSet = this.datastore.selectComments(queryFunction);
    if(!commentResultSet || commentResultSet.length === 0) {
        // not found
        res.status(404);
        return next(new Error('Comment not found'));
    }
    if(commentResultSet.length > 1) {
        res.status(500);
        return next(new Error('Internal server error'));
    }
    req.comment = commentResultSet[0];
    logger.debug('Added following comment to request: ' +  req.comment);
    next();
}

module.exports = function(datastore) {
    this.datastore = datastore;

    /**
     * The return value is an array of objects each with a paramId property and a paramFunction
     */
    return [
            {
                paramId: ":commentId",
                paramFunction: _paramFunction
            }
        ]
};