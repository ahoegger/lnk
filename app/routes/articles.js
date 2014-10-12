/**
 * Created by holger on 05.09.2014.
 */
var express = require('express');
var path = require('path');
var log4js = require('log4js');
var url = require('url');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));

var ArticleClass = require(app_constants.packagedModule('entities', 'Article.js'));
var TagClass = require(app_constants.packagedModule('entities', 'Tag.js'));
var UserClass = require(app_constants.packagedModule('entities', 'User.js'));
var ArticleUserVoteClass = require(app_constants.packagedModule('entities', 'ArticleUserVote.js'));
var CommentClass = require(app_constants.packagedModule('entities', 'Comment.js'));

var inMemoryDatabase = require(app_constants.packagedModule('infrastructure', 'InMemorydataStore.js'));
var halsonFactory = require(app_constants.packagedModule('data', 'HalsonFactory.js'));

var router = express.Router();
var logger = log4js.getLogger('routers.articles');

/**
 * This function returns an array of Tag objects from the given JSON object as array
 * @param jsonObject JSON object, that contains a "tag" property
 * @return {Tag[]}
 */
function createTagsFromJsonBody(jsonObject) {
    var tagsSourceArray = jsonObject.tags;
    var tags = [];
    if (jsonObject.tags) {
        for (var i = 0, len = tagsSourceArray.length; i < len; i++) {
            tags.push(new TagClass.Tag(null, tagsSourceArray[i]));
        }
    }
    return tags;
}

/**
 * This function handles post request for voteUp and vote down situations
 * @param req The express request
 * @param res The express response
 * @param next The express next callback
 * @param {Function} checkExistingVoteValueFunction Function that evaluates the current value if a vote exists and returns true, of the vote can be modified. Parameter is the current value of the existing vote
 * @param {Function} updateExistingVoteValueFunction Function that changes the current value of the vote. Parameter is the current value of the existing vote
 * @param newVoteValue Value to be set, if a new vote will be made (i.e. -1 oder 1)
 */
function handleVoteUpOrDown(req, res, next, checkExistingVoteValueFunction, updateExistingVoteValueFunction, newVoteValue) {
    var user = new UserClass.User(0, 'DefaultUser', true);    // TODO Implement retrieving user from request
    var userVote;
    var userVoteQuery = function(element) {
        if(element.articleId != parseInt(req.params.articleId)) {
            return false;
        }
        return (element.userId == user.id);
    };

    // Get the (possible) vote from the user
    userVote = inMemoryDatabase.selectVotes(userVoteQuery)[0];
    if(userVote) {
        // There is already a vote
        if(checkExistingVoteValueFunction(userVote.vote)) {
            // and the vote is not too high, so increment and update
            userVote.vote = updateExistingVoteValueFunction(userVote.vote);
            userVote = inMemoryDatabase.updateVote(userVote);
        } else {
            // for the moment do nothing
        }
        res.status(200).send(JSON.stringify(userVote));
        next();
    } else {
        userVote = inMemoryDatabase.insertVote(new ArticleUserVoteClass.ArticleUserVote(null, parseInt(req.params.articleId), user.id, newVoteValue));
        res.status(201).send(JSON.stringify(userVote));
        next();
    }
}

router.param(':articleId', function(req, res, next, articleId) {
    var articleResultSet;
    var queryFunction = function(entity) {
        return entity.id === parseInt(articleId);
    };
    articleResultSet = inMemoryDatabase.selectArticles(queryFunction);
    if(!articleResultSet || articleResultSet.length === 0) {
        // not found
        res.status(404);
        return next(new Error('Article not found'));
    }
    if(articleResultSet.length > 1) {
        res.status(500);
        return next(new Error('Internal server error'));
    }
    req.article = articleResultSet[0];
    logger.debug('Added following article to request: ' +  req.article);
    next();
});

router.param(':commentId', function(req, res, next, commentId) {
    var commentResultSet;
    var queryFunction = function(entity) {
        return entity.id === parseInt(commentId);
    };
    commentResultSet = inMemoryDatabase.selectComments(queryFunction);
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
});



// This is a controller!
/* GET article data */
router
    .get('/articles', function(req, res, next) {
        // TODO Implement proper query string from HTTP query string
        var resultSet;
        var halsonResultSet;
        var query = function() {
            // Add element parameter after implementing dummy logic
            return true;
        };
        // TODO Check the votes for the user to provide (or not provide) the voteUp / voteDown links
        resultSet = inMemoryDatabase.selectArticles(query);
        halsonResultSet = halsonFactory.halsonifyArray('Article', resultSet);
        res.status(200).send(JSON.stringify(halsonResultSet));
        next();
    })
    // Get a single article
    .get('/article/:articleId', function(req, res, next) {
        var halsonResult;
        halsonResult = halsonFactory .halsonify('Article', req.article);
        res.status(200).send(JSON.stringify(halsonResult));
        next();
    })
    // return the tags for the given article
    .get('/article/:articleId/tags', function(req, res, next) {
        var resultSet;
        var halsonResultSet;
        // first check article
        resultSet = inMemoryDatabase.selectTagsForArticle(req.article.id);
        halsonResultSet = halsonFactory.halsonifyArray('Tag', resultSet);
        res.status(200).send(JSON.stringify(halsonResultSet));
        next();
    })
    .get('/article/:articleId/comments', function(req, res, next) {
        var resultSet;
        var halsonResultSet;
        var query = function(entity) {
            return entity.articleId === req.article.id;
        };
        // first check article
        resultSet = inMemoryDatabase.selectComments(query);
        halsonResultSet = halsonFactory.halsonifyArray('Comment', resultSet);
        res.status(200).send(JSON.stringify(halsonResultSet));
        next();
    })
    .post('/article', function(req, res, next) {
        var articleObject = new ArticleClass.Article();
        var halsonSingleArticle;
        var tagsArray;

        // prepare objects from request
        articleObject.updateFromJsonObject(req.body);
        tagsArray = createTagsFromJsonBody(req.body);

        // insert objects
        articleObject = inMemoryDatabase.insertArticle(articleObject);  // insert the article
        inMemoryDatabase.insertArticleTags(articleObject, tagsArray);   // insert it's tags

        // build halson resources
        halsonSingleArticle = halsonFactory.halsonify('Article', articleObject);

        // return created article
        res.status(201).send(JSON.stringify(halsonSingleArticle));
        next();
    })
    .post('/article/:articleId/voteUp', function(req, res, next) {
        handleVoteUpOrDown(req, res, next,
            function(value) {
                return value < 1;
            },
            function(value) {
                return value + 1;
            },
            1
        );
    })
    .post('/article/:articleId/voteDown', function(req, res, next) {
        handleVoteUpOrDown(req, res, next,
            function(value) {
                return value > -1;
            },
            function(value) {
                return value - 1;
            },
            -1
        );
    })
    .post('/article/:articleId/comments', function(req, res, next) {
        var commentObject = new CommentClass.Comment();
        var halsonSingleComment;

        // prepare objects from request
        commentObject.updateFromJsonObject(req.body);
        // Add articleId from article
        commentObject.articleId = req.article.id;
        // insert objects
        commentObject = inMemoryDatabase.insertComment(commentObject);  // insert the comment

        // build halson resources
        halsonSingleComment = halsonFactory.halsonify('Comment', commentObject);

        // return created article
        res.status(201).send(JSON.stringify(halsonSingleComment));
        next();
    });

module.exports = router;
