'use strict';
/**
 * Created by holger on 30.06.2014.
 */
lnk.namespace('lnk.viewmodels');

lnk.viewmodels = (function($) {
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
            _.each(plainTags, function(element) {
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
        var  singleArticleView
            ,counter
            ,max = articleData.length;
        var articleViews = ko.observableArray();

        // Build the view models for each article coming from the service
        for (counter = 0; counter < max; counter += 1) {
            singleArticleView = lnk.entities.ArticleViewModel(articleData[counter]);
            articleViews.push(lnk.entities.ArticleViewModel(articleData[counter]));
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
        var backedViews = articleViews,
            sortedArticles;

        /*
         * Build sorted articles as knockout computed object to reorder the view models
         * based on the observable votes() property. The computed object must be applied to the bindings
         */
        sortedArticles = ko.computed(function () {
            return backedViews().sort(function (left, right) {
                return left.votes() == right.votes() ? 0 : (left.votes() > right.votes() ? -1 : 1);
            });
        });
        return sortedArticles;
    }

    /**
     * This constructor returns the view model required for the add link form
     * @return {AddLinkFormViewModel}
     * @constructor
     */
    function AddLinkFormViewModel(targetDataSource) {
        var self = this;
        self.targetDataSource = targetDataSource;
        self.url = ko.observable();
        self.title = ko.observable();
        self.description = ko.observable();
        self.alternateImageUrl = ko.observable();
        self.imageUrl = ko.computed(function() {
            lnk.helper.logDebug('Computing Image URL again');
            return (self.alternateImageUrl() && $.trim(self.alternateImageUrl()).length > 0) ?
                self.alternateImageUrl() : self.url();
        });
        self.imageLoadedHandler = function() {
            lnk.helper.logDebug('image loaded handler called');
            if (self.imageUrl() == self.url()) {
                self.alternateImageUrl(null);
                self.displayAlternateImageUrl(false);
            }
        };
        self.imageLoadedErrorHandler = function() {
            lnk.helper.logDebug('Image error loading');
            self.displayAlternateImageUrl(true)
        };
        self.tags = ko.observable();
        self.tagsArray = function() {
            return tagStringToArray(self.tags(), ',');
        };
        self.submitArticle = function() {
            var newArticle;
            lnk.helper.logDebug('Submitting this object:');
            lnk.helper.logDir(self);

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
            lnk.helper.logDir(newArticle);
            lnk.services.addArticle(newArticle);    // push it to the service
            // self.targetDataSource.push(lnk.entities.ArticleViewModel(newArticle));  // push it to the observable array
        };
        self.displayAlternateImageUrl = ko.observable(false);
        return self;
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
        getAddFormViewModel: function(targetDataSource) {
            return new AddLinkFormViewModel(targetDataSource);
        }
    }
})(jQuery);