/**
 * Created by Holger on 12.10.2014.
 * Module providing functionality for the artile as parameter in a path
 */

var path = require('path');
var log4js = require('log4js');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));

var ArticleClass = require(app_constants.packagedModule('entities', 'Comment.js'));
/*
 var TagClass = require(app_constants.packagedModule('entities', 'Tag.js'));
 var UserClass = require(app_constants.packagedModule('entities', 'User.js'));
 var ArticleUserVoteClass = require(app_constants.packagedModule('entities', 'ArticleUserVote.js'));
 var CommentClass = require(app_constants.packagedModule('entities', 'Comment.js'));
 */
// var inMemoryDatabase = require(app_constants.packagedModule('infrastructure', 'InMemorydataStore.js'));

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