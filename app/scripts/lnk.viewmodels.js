'use strict'
/**
 * Created by holger on 30.06.2014.
 */
lnk.namespace('lnk.viewmodels');

lnk.viewmodels = (function() {
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
        self.url = ko.observable('URL');
        self.title = ko.observable('Title');
        self.description = ko.observable('Description');
        self.alternateImageUrl = ko.observable('Image URL');
        self.tags = ko.observable('Tags');
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
})();