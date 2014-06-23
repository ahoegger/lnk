'use strict'
/**
 * Created by holger on 16.06.2014.
 */

lnk.namespace('lnk.entities');

/**
 * The entities module provides constructors for model entities
 */
lnk.entities = (function() {
    var constructors = {
        /**
         * Constructor for Article bean
         * @param id {Number}
         * @param title {String}
         * @param url {String}
         * @param description {String}
         * @param submittedBy {String}
         * @param submittedOn {Date}
         * @param votes {Number}
         * @param tags {String[]} Array of tags
         * @param numberOfComments {Number} Number od comments
         * @constructor
         */
        Article: function Article(id, title, url, description, submittedBy, submittedOn, votes, tags, numberOfComments) {
            this.id = id;
            this.title = title;
            this.url = url;
            this.description = description;
            this.submittedBy = submittedBy;
            this.submittedOn = submittedOn;
            this.votes = votes;
            this.tags = tags;
            this.numberOfComments = numberOfComments;
        },
        /**
         * Construcotr function of Comment bean
         * @param id {Number}
         * @param articleId {Number}
         * @param text {String}
         * @param submittedBy {String}
         * @param submittedOn {Date}
         * @constructor
         */
        Comment: function (id, articleId, text, submittedBy, submittedOn) {
            this.id = id;
            this.articleId = articleId;
            this.text = text;
            this.submittedBy = submittedBy;
            this.submittedOn = submittedOn;
        },
        ArticleViewModel: function ArticleViewModel(article) {
            var tempItem;
            this.article = article;
            _.extend(this, article);
            // comments
            this.comments = [];
            this.comments = ko.observableArray(this.comments);

            this.displayComments = ko.observable(false);
            this.displayAddComment = ko.observable(false);

            this.toggleShowComments = function() {
                this.displayComments(!this.displayComments());
                this.displayAddComment(this.displayComments());
                if (this.comments.length == 0) {
                    // Comments are not loaded
                    // Load them and poluplate the observed comments
                    tempItem = lnk.services.getComments(this.id);
                    _.each(tempItem, function(element, index, list) { this.comments.push(element);}, this);
                }
            };
            this.toggleShowAddComment = function() {
                this.displayAddComment(!this.displayAddComment());
            };

            // Override votes property with behaviours
            this.votes = ko.observable(article.votes);
            this.voteUp = function() {
                this.votes(this.votes() + 1);
            };
            this.voteDown = function() {
                this.votes(this.votes() - 1);
            };
            this.tags = ko.observableArray(this.tags);
            this.setTags = function(tags) {
                this.tags = tags;
            }.bind(this);
            this.setComments = function (comments) {
                this.comments = comments;
            }.bind(this);
            this.addComment = function () {
                this.comments.push("New comment");
            }.bind(this);
        }
    };

    return {
        Article: function(id, title, url, description, submittedBy, submittedOn, votes, tagsString, numberOfComments) {
            return new constructors.Article(id, title, url, description, submittedBy, submittedOn, votes, tagsString.split(/\s*,\s*/), numberOfComments);
        },
        Comment: function(id, articleId, text, submittedBy, submittedOn) {
            return new constructors.Comment(id, articleId, text, submittedBy, submittedOn);
        },
        ArticleViewModel: function(article) {
            return new constructors.ArticleViewModel(article);
        }
    }
})();