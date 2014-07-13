'use strict';
/**
 * Created by holger on 30.06.2014.
 */
var lnk = lnk || {};
lnk.namespace('lnk.viewmodels');

lnk.viewmodels = (function($, ko, SERVICE, HELPER ) {
    /**
     * This function converts a string with tags (separated by commas) into an array of (trimmed) strings
     * @param tagString {String} A string with comma separated tags
     * @param separator {String} The separator character
     * @return {String[]}
     */
    function tagStringToArray(tagString, separator) {
        var plainTags = [],
            trimmedTags = [];
        if (tagString && $.trim(tagString).length > 0) {
            plainTags = tagString.split(separator);
            $.each(plainTags, function(indexInArray, element) {
                trimmedTags.push($.trim(element));
            });
            return trimmedTags;
        }
    }

    /**
     * This function build an observable array of article views
     * based on a raw article data array
     * @param articleData {Article[]}
     * @return {ko.observableArray}
     */
    function buildObservableArticleViewsArray(articleData) {
        var counter;
        var max = articleData.length;
        var articleViews = ko.observableArray();
        // Build the view models for each article coming from the service
        for (counter = 0; counter < max; counter += 1) {
            articleViews.push(new ArticleViewModel(articleData[counter]));
        }
        return articleViews;
    }

    /**
     * This function build sorted articles as knockout computed objects to reorder the view models
     * based on the observable votes() property. The computed object must be applied to the bindings
     * @param articleViews {ko.observableArray}
     * @return {ko.computed}
     */
    function getArticleViewmodelFromData(articleViews) {
        var backedViews = articleViews;
        var sortedArticles;

        /*
         * Build sorted articles as knockout computed object to reorder the view models
         * based on the observable votes() property. The computed object must be applied to the bindings
         */
        sortedArticles = ko.computed(function () {
            return backedViews().sort(function (left, right) {
                return left.votes() === right.votes() ? 0 : (left.votes() > right.votes() ? -1 : 1);
            });
        });
        return sortedArticles;
    }

    /**
     * This constructor returns the view model required for the add link form
     * @return {AddLinkFormViewModel}
     * @constructor
     */
    function AddLinkFormViewModel(targetDataSource, $messageNode) {
        var self = this;
        // properties & observables
        self.targetDataSource = targetDataSource;
        self.url = ko.observable();
        self.title = ko.observable();
        self.description = ko.observable();
        self.alternateImageUrl = ko.observable();
        self.displayAlternateImageUrl = ko.observable(false);
        self.tags = ko.observable();

        // computed observables
        self.imageUrl = ko.computed(function() {
            HELPER.logDebug('Computing Image URL again');
            return (self.alternateImageUrl() && $.trim(self.alternateImageUrl()).length > 0) ?
                self.alternateImageUrl() : self.url();
        });

        // methods
        /**
         * This function is called, when the image has been loaded successfully
         */
        self.imageLoadedHandler = function() {
            HELPER.logDebug('image loaded handler called');
            if (self.imageUrl() === self.url()) {
                self.alternateImageUrl(null);
                self.displayAlternateImageUrl(false);
            }
        };
        /**
         * This function is called, when the image has not been loaded successfully
         */
        self.imageLoadedErrorHandler = function() {
            HELPER.logInfo('Image error loading');
            if (self.url().length && self.url().length != 0) {
                self.displayAlternateImageUrl(true);
            } else {
                self.displayAlternateImageUrl(false);
            }
        };
        /**
         * This function converts the string with the tags into the tags array
         */
        self.tagsArray = function() {
            return tagStringToArray(self.tags(), ',');
        };
        /**
         * This function creates a new Article based on properties and submits it to the service
         */
        self.submitArticle = function() {
            var newArticle;
            HELPER.logDebug('Submitting a new article.');
            HELPER.logDir(self);
            newArticle = lnk.entities.Article (
                null,
                self.title(),
                self.url(),
                self.imageUrl(),
                self.description(),
                'newSubmitter',
                new Date(),
                0,
                self.tagsArray(),
                0);
            HELPER.logDir(newArticle);
            SERVICE.addArticle(newArticle);    // push it to the service
            self.reset();
            self.showConfirmation();
        };

        self.showConfirmation = function() {
            $.notify.defaults( {
                style:    'bootstrap',
                className: 'success',
                showAnimation: 'fadeIn',
                hideAnimation: 'fadeOut'
            });
            $messageNode.notify(
                'Successfully added .lnk. You can find it using search.',
                {
                    position: 'bottom right'
                }
            );
        };

        self.reset = function() {
            self.url('');
            self.title('');
            self.description('');
            self.alternateImageUrl('');
            self.displayAlternateImageUrl('');
            self.tags('');
        };
        return self;
    }

    function ArticleViewModel(article) {
        var self = this;
        this.article = article;
        $.extend(this, article);
        // Override numberOfComments
        this.numberOfComments = ko.observable(article.numberOfComments);

        // comments
        this.comments = ko.observableArray([]);             // Comments are observable
        this.displayComments = ko.observable(false);        // by default comments are not visible
        this.displayAddComment = ko.observable(false);      // and adding comments isn't visible either
        // toggling displaying of comments
        this.toggleShowComments = function() {
            var tempItem;
            this.displayComments(!this.displayComments());
            this.displayAddComment(this.displayComments());
            if (this.comments().length === 0) {
                // Comments are not loaded
                // Load them and populate the observed comments
                tempItem = SERVICE.getComments(this.id);
                $.each(tempItem, function(index, value) {
                    self.comments.push(value);
                });
                HELPER.logDebug('Length of comments: ' + this.comments.length);
            }
        };

        // toggling displaying of add comment
        this.toggleShowAddComment = function() {
            this.displayAddComment(!this.displayAddComment());
        };

        // Override votes property with behaviours
        this.votes = ko.observable(article.votes);
        this.voteUp = function() {
            this.votes(this.votes() + 1);
            SERVICE.articleVoteUp(this.id);
        };
        this.voteDown = function() {
            this.votes(this.votes() - 1);
            SERVICE.articleVoteDown(this.id);
        };
        this.tags = ko.observableArray(this.tags);
        this.setTags = function(tags) {
            this.tags = tags;
        }.bind(this);
        this.setComments = function (comments) {
            this.comments = comments;
        }.bind(this);
        this.addComment = function (newComment) {
            this.comments.push(newComment);
            this.numberOfComments(this.comments().length);
        }.bind(this);
    }

    return {
        /**
         * This function returns an observableArray of articleViews, constructed on a raw array of articles
         * @param articleData
         */
        buildObservableArticleViews: function(articleData) {
            return buildObservableArticleViewsArray(articleData);
        },
        /**
         * This function returns an sorted observable array of article view models
         * based on the given input article models
         * @param articleViewObservables {ko.observableArray} Observable array of article views
         * @return {ko.computed} The sorted list of article view models
         */
        getSortedArticleViewModel: function(articleViewObservables) {
            return getArticleViewmodelFromData(articleViewObservables);
        },
        /**
         * This function returns a view model for the add link form
         * @param targetDataSource {*} datasource to which the new article shall be added
         */
        buildAddFormViewModel: function(targetDataSource, $messageNode) {
            return new AddLinkFormViewModel(targetDataSource, $messageNode);
        },
        buildArticleViewModel: function(article) {
            return new ArticleViewModel(article);
        }
    };
})(jQuery, ko, lnk.services, lnk.helper);