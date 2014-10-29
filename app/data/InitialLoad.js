/**
 * Created by Holger on 11.10.2014.
 * This module allows the initial load auf data from a json file into the datastore
 */

var fs = require('fs');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger('data.IntialLoad');

var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var ArticleClass = require(app_constants.packagedModule('entities', 'Article.js'));
var CommentClass = require(app_constants.packagedModule('entities', 'Comment.js'));
var TagClass = require(app_constants.packagedModule('entities', 'Tag.js'));

module.exports = function (datastore) {
    this.datastore = datastore;
    function _loadJsonFile(fileName, callback) {
        fs.readFile(fileName, {encoding: 'utf8'}, function (err, content) {
            if (err) {
                logger.error('Error', err);
                return;
            }
            logger.debug('Loaded', content);
            return callback(JSON.parse(content));
        });
    }

    function _createTagsFromArticle(jsonObject) {
        var tagsSourceArray = jsonObject.tags;
        var tags = [];
        if (jsonObject.tags) {
            for (var i = 0, len = tagsSourceArray.length; i < len; i++) {
                tags.push(new TagClass.Tag(null, tagsSourceArray[i]));
            }
        }
        return tags;
    }

    function _insertArticles(articles) {
        var articleObject;
        var tagsArray;
        for (var i = 0, len = articles.length; i < len; i++) {
            articleObject = new ArticleClass.Article();
            articleObject.updateFromJsonObject(articles[i]);
            tagsArray = _createTagsFromArticle(articles[i]);

            articleObject = datastore.insertArticle(articleObject);
            datastore.insertArticleTags(articleObject, tagsArray);
        }
    }

    function _insertComments(comments) {
        var commentObject;
        for (var i = 0, len = comments.length; i < len; i++) {
            commentObject = new CommentClass.Comment();
            commentObject.updateFromJsonObject(comments[i]);
            datastore.insertComment(commentObject);
        }
    }

    return {
        /**
         * Load articles into the datastore
         * @param jsonFileReference Path to a JSON file with article data
         */
        loadArticles: function (jsonFileReference) {
            _loadJsonFile(jsonFileReference, _insertArticles);
        },
        loadComments: function (jsonFileReference) {
            _loadJsonFile(jsonFileReference, _insertComments);
        },
        loadUsers: function (jsonFileReference) {
            // TODO Implement loading dummy users
        }
    }
};