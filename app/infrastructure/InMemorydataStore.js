/**
 * Created by Holger on 05.10.2014.
 */
var path = require('path');
var log4js = require('log4js');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));

// support these entities
var ArticleClass = require(app_constants.packagedModule('entities', 'Article.js'));
var TagClass = require(app_constants.packagedModule('entities', 'Tag.js'));
var ArticleTagClass = require(app_constants.packagedModule('entities', 'ArticleTag.js'));
var ArticleUserVoteClass = require(app_constants.packagedModule('entities', 'ArticleUserVote.js'));

// the table database factory
var CrudDatabaseFactory = require(app_constants.packagedModule('data', 'CrudDatabaseFactory'));

// Construct the required tables
// The  supported tables
var articlesTable = CrudDatabaseFactory.factory(ArticleClass.Article, 'id');
var tagsTable = CrudDatabaseFactory.factory(TagClass.Tag, 'id');
var articleTagTable = CrudDatabaseFactory.factory(ArticleTagClass.ArticleTag, 'id', ['articleId']);
var articleUserVoteTable = CrudDatabaseFactory.factory(ArticleUserVoteClass.ArticleUserVote, 'id', ['articleId', 'userId', 'vote']);

module.exports = {
    insertArticle: function(article) {
        return articlesTable.insert(article);
    },
    insertTag: function(tag) {
        return tagsTable.insert(tag);
    },
    /**
     * This functions inserts the tags for an article. The tags are either created
     * or a reference is being used
     * @param article
     * @param tags
     */
    insertArticleTags: function(article, tags) {
        var singleTag;
        var storedTag;
        for (var i = 0, len = tags.length; i < len; i++) {
            singleTag = tags[i];
            storedTag = tagsTable.selectById(singleTag.id);
            if(!storedTag) {
                // first, create the article
                storedTag = tagsTable.insert(singleTag);
            }
            // insert the mapping
            articleTagTable.insert(new ArticleTagClass.ArticleTag(undefined, article.id, storedTag.id))
        }
    },
    /**
     * This function selects the articles table based on the query function
     * @param {Function} queryFunction The function to query the articles
     * @return {*}
     */
    selectArticles: function(queryFunction) {
        return articlesTable.select(queryFunction);
    },
    selectTags: function(queryFunction) {
        return tagsTable.select(queryFunction);
    },
    /**
     * This function selects and returns the tags for a given article
     * @param queryFunction
     */
    selectTagsForArticle: function(articleId) {
        var map;
        var resultingTags = [];

        map = articleTagTable.select(function(element) {
            return element.articleId === articleId;
        });

        for(var i = 0, len = map.length; i < len; i++) {
            resultingTags.push(tagsTable.selectById(map[i].tagId));
        }
        return resultingTags;
    },
    /**
     * This function inserts a new user vote for an article
     * @param articleId
     * @param userId
     * @param value
     */
    insertVote: function(articleUserVote) {
        return articleUserVoteTable.insert(articleUserVote);
    },
    selectVotes: function(queryFunction) {
        return articleUserVoteTable.select(queryFunction);
    },
    updateVote: function(articleUserVote) {
        return articleUserVoteTable.update(articleUserVote);
    }
};