'use strict'
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
            _.each(plainTags, function(element, index, list) {
                trimmedTags.push($.trim(element));
            });
            return trimmedTags;
        }
    }

    function getArticleViewmodelFromData(articleData) {
        var articleData,
            singleArticleView,
            articleViews = lnk.globals.articleViews,
            sortedArticles,
            max = articleData.length,
            counter;

        /*
         * Build the view models for each article coming from the service
         */
        for (counter = 0; counter < max; counter += 1) {
            singleArticleView = lnk.entities.ArticleViewModel(articleData[counter]);
            articleViews.push(lnk.entities.ArticleViewModel(articleData[counter]));
        }

        /*
         * Build sorted articles as knockout computed object to reorder the view models
         * based an the observable votes() property. The computed object must be applied to the bindings
         */
        sortedArticles = ko.computed(function () {
            return articleViews().sort(function (left, right) {
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
    function AddLinkFormViewModel() {
        var self = this;
        self.url = ko.observable();
        self.title = ko.observable();
        self.description = ko.observable();
        self.alternateImageUrl = ko.observable();
        self.imageUrl = ko.computed(function() {
            lnk.helper.logDebug('Computing Image URL again');
            return (self.alternateImageUrl() && $.trim(self.alternateImageUrl()).length > 0) ?
                self.alternateImageUrl() : self.url();
        });
        self.tags = ko.observable();
        self.tagsArray = function() {
            return tagStringToArray(self.tags, ',');
        };
        self.submitArticle = function() {
            lnk.helper.logDebug('Submitting this object:');
            lnk.helper.logDir(self);
            // TODO HHE Implement converting observable to plain Article object and submitting it to the service
        };
        self.checkImageUrl = function() {
            lnk.helper.logDebug('Checking image URL');
            // TODO HHE Implement checking, which URL will be the effective image URL
        };
        self.displayAlternateImageUrl = function() {
            lnk.helper.logDebug('displayAlternateImageUrl()');
            // TODO HHE Implement logic to check, if alternate image URL must be displayed
        };
        self.setImageUrl = function() {
            lnk.helper.logDebug('imageUrl()');
            // TODO HHE Implement setter for effective image URL
        };

        // TODO HHE Implement functionality to split Tags, check image URL, alternate image URL and stuff
        return self;
    }

    return {
        /**
         * This function returns an sorted observable array of article view models
         * based on the given input article models
         * @param articleData {Article[]} Array of Article objects
         * @return {ko.computed} The sorted list of article view models
         */
        getSortedArticleViewModel: function(articleData) {
            return getArticleViewmodelFromData(articleData);
        },
        /**
         * This function returns a view model for the add link form
         */
        getAddFormViewModel: function() {
            return new AddLinkFormViewModel();
        }
    }
})(jQuery);