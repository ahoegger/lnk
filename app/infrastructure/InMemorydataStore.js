/**
 * Created by Holger on 05.10.2014.
 */
var path = require('path');
var log4js = require('log4js');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));

// support these entities
var ArticleClass = require(app_constants.packagedModule('entities', 'Article.js'));
var TagClass = require(app_constants.packagedModule('entities', 'Tag.js'));
var CommentClass = require(app_constants.packagedModule('entities', 'Comment.js'));
var ArticleTagClass = require(app_constants.packagedModule('entities', 'ArticleTag.js'));
var ArticleUserVoteClass = require(app_constants.packagedModule('entities', 'ArticleUserVote.js'));
var UserClass = require(app_constants.packagedModule('entities', 'User.js'));
var VoteContainerClass = require(app_constants.packagedModule('entities', 'VoteContainer.js'));

// the table database factory
var CrudDatabaseFactory = require(app_constants.packagedModule('data', 'CrudDatabaseFactory'));

// Construct the required tables
// The  supported tables
var articlesTable = CrudDatabaseFactory.factory(ArticleClass.Article, 'id');
var tagsTable = CrudDatabaseFactory.factory(TagClass.Tag, 'id');
var commentsTable = CrudDatabaseFactory.factory(CommentClass.Comment, 'id', ['articleId']);
var articleTagTable = CrudDatabaseFactory.factory(ArticleTagClass.ArticleTag, 'id', ['articleId']);
var articleUserVoteTable = CrudDatabaseFactory.factory(ArticleUserVoteClass.ArticleUserVote, 'id', ['articleId', 'userId', 'vote']);
var userTable = CrudDatabaseFactory.factory(UserClass.User, 'id', ['userName']);

/**
 * This function finds a tag by ist tag name
 * @param tag
 * @return {*}
 * @private
 */
function _findTag(tag) {
    var queryFunction = function(entity) {
        return entity.tag === tag.tag;
    };
    var resultSet;
    resultSet = tagsTable.select(queryFunction);
    if (!resultSet || resultSet.length === 0) {
        return undefined;
    }
    if (resultSet.length > 1) {
        throw new Error('Internal server error');
    }
    return resultSet[0];
}

/**
 * This function transform an array of tags into an array of article tags
 * @param article
 * @param tags
 * @private
 */
function _tagsToArticleTags(article, tags) {
    var articleTags = [];
    for (var i = 0, len = tags.length; i < len; i++) {
        articleTags.push(new ArticleTagClass.ArticleTag(null, article.id, tags[i].id));
    }
    return articleTags;
}

function _deleteTags(article, tags) {
    var articleTags = _tagsToArticleTags(article, tags);
    for (var i = 0, len = articleTags.length; i < len; i++) {
        articleTagTable.remove(articleTags[i]);
    }
}

function _selectTagsForArticle(articleId) {
    // NICE: Split into two function: one selects the ArticleTag objects, one converts them into simple Tag objects
    var map;
    var resultingTags = [];

    map = articleTagTable.select(function (element) {
        return element.articleId === articleId;
    });

    for (var i = 0, len = map.length; i < len; i++) {
        resultingTags.push(tagsTable.selectById(map[i].tagId));
    }
    return resultingTags;
}

function _selectCommentsForArticle(articleId) {
    var queryFunction = function(entity) {
        return entity.articleId === articleId;
    };
    return commentsTable.select(queryFunction);
}

function _insertUser(user) {
    return userTable.insert(user);
}

function _updateUser(user) {
    return userTable.update(user);
}

function _selectUser(queryFunction) {
    return userTable.select(queryFunction);
}

function _selectVotes(articleId, userId) {
    var singleResult;
    var voteValue = 0;
    var userVote;
    var resultSet;
    var votesQuery = function(entity) {
        return entity.articleId === articleId;
    };
    resultSet = articleUserVoteTable.select(votesQuery);
    for (var i = 0, len = resultSet.length; i < len; i++) {
        singleResult = resultSet[i];
        voteValue = voteValue + singleResult.vote;
        if (singleResult.userId === userId) {
            userVote = voteValue;
        }
    }
    return new VoteContainerClass.VoteContainer(voteValue, userVote, articleId);
}

function _insertTags(article, tags) {
    var singleTag;
    var storedTag;
    var updatedTags = [];
    for (var i = 0, len = tags.length; i < len; i++) {
        singleTag = tags[i];
        storedTag = _findTag(singleTag);
        if (!storedTag) {
            // first, create the article
            storedTag = tagsTable.insert(singleTag);
        }
        updatedTags.push(storedTag);
        // insert the mapping
        articleTagTable.insert(new ArticleTagClass.ArticleTag(undefined, article.id, storedTag.id))
    }
    return updatedTags;
}

function _deleteArticle(article) {
    articlesTable.remove(article);
}

function _deleteArticleTags(article) {
    var articleTags;
    var query = function(entity) {
        return entity.articleId = article.id
    };
    articleTags = articleTagTable.select(query);
    for (var i = 0, len = articleTags.length; i < len; i++) {
        articleTagTable.remove(articleTags[i]);
    }
}
module.exports = {
    insertArticle: function(article) {
        return articlesTable.insert(article);
    },
    /**
     * This function updates an existing article object in the datastore
     * @param article
     * @return {Article} The article object after inserting
     */
    updateArticle: function(article) {
        return articlesTable.update(article)
    },
    /**
     * This function deletes the article and deletes the articletags
     * @param article
     */
    deleteArticle: function(article) {
        _deleteArticle(article);
        _deleteArticleTags(article);
    },
    insertTag: function(tag) {
        return tagsTable.insert(tag);
    },
    /**
     * This functions inserts the tags for an article. The tags are either created
     * or a reference is being used
     * @param article
     * @param tags
     * @return {Tag[]} returns the updated tags from the database (i.e. with a proper id)
     */
    insertArticleTags: function(article, tags) {
        return _insertTags(article, tags);
    },
    /**
     * This function updates the tags array of a given article
     * @param {Article} article The article
     * @param {Tags[]} tags The complete list of tags associated with the article
     */
    updateArticleTags: function(article, tags) {
        // crude implementation: First, delete all current tags from the article, then insert the new array
        // note: the provided article is the NEW one, to delete the tags, the old tags array has to be retrieved
        var oldTags = _selectTagsForArticle(article.id);
        _deleteTags(article, oldTags);
        _insertTags(article, tags);
    },
    insertComment: function(comment) {
        return commentsTable.insert(comment);
    },
    selectComments: function(queryFunction) {
        return commentsTable.select(queryFunction);
    },
    /**
     * This function selects the articles table based on the query function
     * @param {Function} queryFunction The function to query the articles
     * @param {Object} options Options-object
     * @return {Article[]}
     */
    selectArticles: function(queryFunction, options) {
        var resultSet;
        var i,len;
        options = options || {
            includeTags: false,
            includeComments: false,
            includeVoteCount: false,
            voteUserId: undefined
        };   // default value
        resultSet = articlesTable.select(queryFunction);
        // according to the options, include the various sub entities, if requested
        if (options.includeTags) {
            for(i = 0, len = resultSet.length; i < len; i++) {
                resultSet[i].tags = _selectTagsForArticle(resultSet[i].id);
            }
        }
        if (options.includeComments) {
            for(i = 0, len = resultSet.length; i < len; i++) {
                resultSet[i].comments = _selectCommentsForArticle(resultSet[i].id);
            }
        }
        if (options.includeVoteCount) {
            for(i = 0, len = resultSet.length; i < len; i++) {
                resultSet[i].votes = _selectVotes(resultSet[i].id, options.voteUserId);
            }
        }
        return resultSet;
    },
    selectTags: function(queryFunction) {
        return tagsTable.select(queryFunction);
    },
    /**
     * This function selects and returns the tags for a given article
     * @param {number} articleId The ID of the article
     */
    selectTagsForArticle: _selectTagsForArticle,

    /**
     * This function inserts a new user vote for an article
     * @param {ArticleUserVote} articleUserVote The article user vote to be inserted
     */
    insertVote: function(articleUserVote) {
        return articleUserVoteTable.insert(articleUserVote);
    },
    selectVotes: function(queryFunction) {
        return articleUserVoteTable.select(queryFunction);
    },
    updateVote: function(articleUserVote) {
        return articleUserVoteTable.update(articleUserVote);
    },
    insertUser: function(userObject) {
        return _insertUser(userObject);
    },
    selectUser: function(queryFunction) {
        return _selectUser(queryFunction);
    },
    updateUser: function(userObject) {
        return _updateUser(userObject);
    }
};