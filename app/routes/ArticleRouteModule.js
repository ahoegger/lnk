/**
 * Created by Holger on 12.10.2014.
 * This module exports the functions needed for article functionality
 */
var path = require('path');
var log4js = require('log4js');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var helper = require(app_constants.packagedModule('routes', 'ArticleRouterHelperModule.js'))();

var ArticleClass = require(app_constants.packagedModule('entities', 'Article.js'));
var UserClass = require(app_constants.packagedModule('entities', 'User.js'));
var ArticleUserVoteClass = require(app_constants.packagedModule('entities', 'ArticleUserVote.js'));
var CommentClass = require(app_constants.packagedModule('entities', 'Comment.js'));

var halsonFactory = require(app_constants.packagedModule('data', 'HalsonFactory.js'));
var logger = log4js.getLogger('routes.ArticleRouteModule');

/**
 * This function handles post request for voteUp and vote down situations
 * @param req The express request
 * @param res The express response
 * @param next The express next callback
 * @param {Function} checkExistingVoteValueFunction Function that evaluates the current value if a vote exists and returns true, of the vote can be modified. Parameter is the current value of the existing vote
 * @param {Function} updateExistingVoteValueFunction Function that changes the current value of the vote. Parameter is the current value of the existing vote
 * @param newVoteValue Value to be set, if a new vote will be made (i.e. -1 oder 1)
 */
function _handleVoteUpOrDown(req, res, next, checkExistingVoteValueFunction, updateExistingVoteValueFunction, newVoteValue) {
    var user = new UserClass.User(0, 'DefaultUser', true);    // TODO Implement retrieving user from request, the session, whatever
    var userVote;
    var articleUserVote;
    var userVoteQuery = function(element) {
        if(element.articleId != parseInt(req.params.articleId)) {
            return false;
        }
        return (element.userId == user.id);
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
        res.status(200).send(JSON.stringify(userVote));
        next();
    } else {
        articleUserVote = new ArticleUserVoteClass.ArticleUserVote(null, parseInt(req.article.id), user.id, newVoteValue);
        userVote = this.datastore.insertVote(articleUserVote);
        res.status(201).send(JSON.stringify(userVote));
        next();
    }
}

module.exports = function(datastore) {
    this.datastore = datastore;

    return {
        /**
         * Returns a list of articles matching the query parameters.
         * This function will send the response
         * so the article is present in teh request
         * @param {Object} req The request object
         * @param {Object} res The response object
         */
        getArticles: function(req, res) {
            // TODO Implement proper query string from HTTP query string
            var resultSet;
            var halsonResultSet;
            var query = function() {
                // TODO Implement query / filter logic based on query parameters
                return true;
            };
            // TODO Check the votes for the user to provide (or not provide) the voteUp / voteDown links
            resultSet = datastore.selectArticles(query, {
                includeTags: true,
                includeComments: true
            });
            halsonResultSet = halsonFactory.halsonifyArray('Article', resultSet);
            logger.debug('Returning articles', halsonResultSet);
            res.status(200).send(JSON.stringify(halsonResultSet));
        },
        postArticle: function(req, res) {
            var articleObject = new ArticleClass.Article();
            var halsonSingleArticle;
            var tagsArray;

            articleObject.updateFromJsonObject(req.body);            // put posted content into article
            tagsArray = helper.createTagsFromJsonBody(req.body);     // create the tags as well
            articleObject = datastore.insertArticle(articleObject);  // insert the article
            datastore.insertArticleTags(articleObject, tagsArray);   // insert it's tags
            halsonSingleArticle = halsonFactory.halsonify('Article', articleObject);
            res.status(201).send(JSON.stringify(halsonSingleArticle));
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
            res.status(200).send(JSON.stringify(halsonResult));
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
            res.status(200).send(JSON.stringify(halsonResultSet));
        },
        postVoteUp: function(req, res, next) {
            _handleVoteUpOrDown(req, res, next,
                function(value) {
                    return value < 1;
                },
                function(value) {
                    return value + 1;
                },
                1
            );
        },
        postVoteDown: function(req, res, next) {
            _handleVoteUpOrDown(req, res, next,
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
            commentObject = datastore.insertComment(commentObject);  // insert the comment
            halsonSingleComment = halsonFactory.halsonify('Comment', commentObject);
            res.status(201).send(JSON.stringify(halsonSingleComment));
        }
    }
};
