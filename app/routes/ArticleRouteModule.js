/**
 * Created by Holger on 12.10.2014.
 * This module exports the functions needed for article functionality
 * @module backend/routes/ArticleRouteModule
 * @type {exports}
 */
var path = require('path');
var log4js = require('log4js');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var helper = require(app_constants.packagedModule('routes', 'ArticleRouterHelperModule.js'))(this.datastore);

var ArticleClass = require(app_constants.packagedModule('entities', 'Article.js'));
var ArticleUserVoteClass = require(app_constants.packagedModule('entities', 'ArticleUserVote.js'));
var CommentClass = require(app_constants.packagedModule('entities', 'Comment.js'));

var halsonFactory = require(app_constants.packagedModule('data', 'HalsonFactory.js'));
var logger = log4js.getLogger('routes.ArticleRouteModule');

/**
 * This function handles post request for voteUp and vote down situations
 * @param req The express request
 * @param res The express response
 * @param {Function} checkExistingVoteValueFunction Function that evaluates the current value if a vote exists and returns true, of the vote can be modified. Parameter is the current value of the existing vote
 * @param {Function} updateExistingVoteValueFunction Function that changes the current value of the vote. Parameter is the current value of the existing vote
 * @param newVoteValue Value to be set, if a new vote will be made (i.e. -1 oder 1)
 */
function _handleVoteUpOrDown(req, res, checkExistingVoteValueFunction, updateExistingVoteValueFunction, newVoteValue) {
    var userId = req.user ? req.user.id : undefined;
    var userVote;
    var articleUserVote;
    var returnCode;
    var updatedVoteContainer;
    var halsonUpdatedVoteContainer;
    var userVoteQuery = function(element) {
        if(element.articleId != parseInt(req.params.articleId)) {
            return false;
        }
        return (element.userId == userId);
    };

    // Get the (possible) vote from the user
    userVote = this.datastore.selectVotes(userVoteQuery)[0];
    if(userVote) {
        // There is already a vote
        if(checkExistingVoteValueFunction(userVote.vote)) {
            // and the vote is not too high, so increment and update
            userVote.vote = updateExistingVoteValueFunction(userVote.vote);
            userVote = this.datastore.updateVote(userVote);
        } else {
            // for the moment do nothing (i.e. no error to the client, just don't increment or decrement the votes value
        }
        returnCode = 200;
    } else {
        articleUserVote = new ArticleUserVoteClass.ArticleUserVote(null, parseInt(req.article.id), userId, newVoteValue);
        userVote = this.datastore.insertVote(articleUserVote);
        returnCode = 201;
    }
    // Cheap trick: Select the article, grab it's VoteContainer and return it to the frontend
    updatedVoteContainer = helper.selectArticleVotes(userVote.articleId, userVote.userId);
    if (updatedVoteContainer) {
        halsonUpdatedVoteContainer = halsonFactory.halsonify('VoteContainer', updatedVoteContainer);
        socket.emit('vote:updated', halsonUpdatedVoteContainer);
        return res.status(returnCode).send(JSON.stringify(halsonUpdatedVoteContainer));
    }
}

/**
 * This function insert or updates a given article in the database and return the halsonified article object. A response is not being sent
 * @param {Request} req
 * @param {Function} articleDbFunction Function that executes the actual DB operation on the article (i.e insert or update). Argument is articleObject
 * @param {Function} tagsDbFunction Function that executes the actual DB operation on the tags array (i.e insert or update). Arguments are articleObject and tagsArray
 * @private
 */
function _insertOrUpdateArticle(req, articleDbFunction, tagsDbFunction) {
    var articleObject = new ArticleClass.Article();
    var tagsArray;

    articleObject.updateFromJsonObject(req.body);            // put posted content into article
    articleObject.submittedBy = req.paramhandler_user.userName;              // Take user name from request (user must be logged in) and possible user name in the article provided by the frontend.
    tagsArray = helper.createTagsFromJsonBody(req.body);     // create the tags as well
    articleObject = articleDbFunction(articleObject);
    articleObject.tags = tagsDbFunction(articleObject, tagsArray);
    return halsonFactory.halsonify('Article', articleObject);
}

module.exports = function(datastore, socket) {
    this.datastore = datastore;
    this.socket = socket;

    return {
        /**
         * Returns a list of articles matching the query parameters.
         * This function will send the response
         * so the article is present in teh request
         * @param {Object} req The request object
         * @param {Object} res The response object
         */
        getArticles: function(req, res) {
            // NICE Implement filter on tags as well.
            var resultSet;
            var halsonResultSet;
            var searchAnywhere = helper.createSearchAnywhere(req);
            var query = function(entity) {
                return searchAnywhere(entity);
            };
            resultSet = datastore.selectArticles(query, {
                includeTags: true,
                includeComments: false,
                includeVoteCount: true,
                includeUser: true,
                voteUserId: req.user ? req.user.id : undefined
            });
            halsonResultSet = halsonFactory.halsonifyArray('Article', resultSet);
            return res.status(200).send(JSON.stringify(halsonResultSet));
        },
        postArticle: function(req, res) {
            var halsonSingleArticle = _insertOrUpdateArticle(
                req,
                function(articleObject) {
                    return datastore.insertArticle(articleObject);  // insert the article
                },
                function(articleObject, tagsArray) {
                    return datastore.insertArticleTags(articleObject, tagsArray);   // insert it's tags
                }
            );
            return res.status(201).send(JSON.stringify(halsonSingleArticle));
        },
        /**
         * Updates a given article on the data store. The response will be the updated article as halson object
         * @param req
         * @param res
         */
        putArticle: function(req, res) {
            var halsonSingleArticle = _insertOrUpdateArticle(
                req,
                function(articleObject) {
                    return datastore.updateArticle(articleObject);
                },
                function(articleObject, tagsArray) {
                    return datastore.updateArticleTags(articleObject, tagsArray);
                }
            );
            return res.status(200).send(JSON.stringify(halsonSingleArticle));
        },
        /**
         * Deletes the article from the datastore
         * @param req
         * @param res
         */
        deleteArticle: function(req, res) {
            if (req.user.userName === req.article.submittedBy) {
                datastore.deleteArticle(req.article);
                return res.status(204).send();
            }
            return res.status(403).send();      // forbidden, as logegd in user ist not the one that submitted the article
        },
        /**
         * Returns a single article. The articleId must be in the path and the paramHandler must be installed.
         * This function will send the response
         * so the article is present in teh request
         * @param {Object} req The request object
         * @param {Object} res The response object
         */
        getSingleArticle: function(req, res) {
            var halsonResult;
            halsonResult = halsonFactory.halsonify('Article', req.article);
            logger.debug('Returning article', halsonResult);
            return res.status(200).send(JSON.stringify(halsonResult));
        },
        /**
         * Returns the tags of a single article. The articleId must be in the path and the paramHandler must be installed.
         * This function will send the response
         * so the article is present in teh request
         * @param {Object} req The request object
         * @param {Object} res The response object
         */
        getSingleArticleTags: function(req, res) {
            var resultSet;
            var halsonResultSet;
            // first check article
            resultSet = datastore.selectTagsForArticle(req.article.id);
            halsonResultSet = halsonFactory.halsonifyArray('Tag', resultSet);
            logger.debug('Returning tags for article', halsonResultSet);
            res.status(200).send(JSON.stringify(halsonResultSet));
        },
        /**
         * Returns the tags of a single article. The articleId must be in the path and the paramHandler must be installed.
         * This function will send the response
         * so the article is present in teh request
         * @param {Object} req The request object
         * @param {Object} res The response object
         */
        getSingleArticleComments: function(req, res) {
            var resultSet;
            var halsonResultSet;
            var query = function(entity) {
                return entity.articleId === req.article.id;
            };
            resultSet = datastore.selectComments(query);
            halsonResultSet = halsonFactory.halsonifyArray('Comment', resultSet);
            logger.debug('Returning comments for article', halsonResultSet);
            return res.status(200).send(JSON.stringify(halsonResultSet));
        },
        postVoteUp: function(req, res) {
            _handleVoteUpOrDown(req, res,
                function(value) {
                    return value < 1;
                },
                function(value) {
                    return value + 1;
                },
                1
            );
        },
        postVoteDown: function(req, res) {
            _handleVoteUpOrDown(req, res,
                function(value) {
                    return value > -1;
                },
                function(value) {
                    return value - 1;
                },
                -1
            );
        },
        postSingleArticleComment: function(req, res) {
            var commentObject = new CommentClass.Comment();
            var halsonSingleComment;
            commentObject.updateFromJsonObject(req.body);
            commentObject.articleId = req.article.id;           // update with article id
            commentObject.submittedBy = req.user ? req.user.userName : undefined;  // set the user name of the logged in user
            commentObject = datastore.insertComment(commentObject);  // insert the comment
            halsonSingleComment = halsonFactory.halsonify('Comment', commentObject);
            return res.status(201).send(JSON.stringify(halsonSingleComment));
        },
        /**
         * Deletes the article from the datastore
         * @param req
         * @param res
         */
        deleteSingleArticleComment: function(req, res) {
            if (req.user.userName === req.comment.submittedBy) {
                datastore.deleteComment(req.comment);
                return res.status(204).send();
            }
            return res.status(403).send();      // forbidden, as logged in user ist not the one that submitted the article
        }
    }
};
