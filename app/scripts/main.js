'use strict';
lnk.namespace('lnk.globals');

ko.observableArray.fn.logSomething = function() {
    return function() {
        console.log('bldfkjhfdkjsh');
    };
};

lnk.globals.articleViews = ko.observableArray();

jQuery(document).ready( function(){
    // initialize the articles and stuff
    var articles = lnk.services.getArticles(),
        articleViews = lnk.globals.articleViews,
        articleView,
        max = articles.length,
        sortedArticles;
    /*
     * Build the view models for each article coming from the service
     */
    for (var i = 0; i < max; i += 1) {
        articleView = lnk.entities.ArticleViewModel(articles[i]);
        // Custom event handling if sorting changed...
        articleView.votes.subscribe(function(newValue) {
            lnk.helper.logDebug('Got event from changed votes value...');
           articleViews.sortByProperty('votes', true);
        });
        articleViews.push(lnk.entities.ArticleViewModel(articles[i]));
    }
    /*
     * Build sorted articles as knockout computed object to reorder the view models
     * based an the observable votes() property. The computed objecvt must be applied to the bindings
     */
    sortedArticles = ko.computed(function() {
        return articleViews().sort(function (left, right) {
            return left.votes() == right.votes() ? 0 : (left.votes() > right.votes() ? -1 : 1);
        });
    });
    lnk.globals.articleViews = articleViews;
    ko.applyBindings({ articles: sortedArticles }, document.getElementById('top-results'));
    ko.applyBindings({  }, document.getElementById('add'));
});

lnk.namespace('lnk.behaviour');

lnk.behaviour = (function() {
    return {
        /**
         * This function receives a form element and builds the article entity as well as the observable view model
         * @param formElement {Form} The form with the article
         */
        addArticle: function(formElement) {
            var newArticle = lnk.entities.Article (
                null,
                formElement.title.value,
                formElement.url.value,
                formElement.description.value,
                'newSubmitter',
                new Date(),
                0,
                formElement.tags.value,
                0);
            lnk.helper.logDir(newArticle);
            lnk.services.addArticle(newArticle);    // push it to the service
            lnk.globals.articleViews.push(lnk.entities.ArticleViewModel(newArticle));   // Add it to the observed result set
        },
        addComment: function(formElement, thingy) {
            var newComment = lnk.entities.Comment(
                null,
                ko.dataFor(formElement).id,
                formElement.comment.value,
                'newCommenter',
                new Date()
            );
            lnk.helper.logDir(newComment);
            lnk.services.addComment(newComment);
            ko.dataFor(formElement).addComment(newComment);
        },
        autoResize: function(data, event) {
            // Resizing event handler for dynamic sized textarea elements
            // See http://stackoverflow.com/questions/19170083/automatically-resize-text-area-based-on-content (answer from Thaylon)
            var $textAreaElement,
                scrollHeight,
                areaHeight;
            $textAreaElement = $(event.target);
            if (!$textAreaElement.prop('scrollTop')) {
                do {
                    scrollHeight = $textAreaElement.prop('scrollHeight');
                    areaHeight = $textAreaElement.height();
                    $textAreaElement.height(areaHeight - 5);
                }
                while (scrollHeight && (scrollHeight !== $textAreaElement.prop('scrollHeight')));
            }
            $textAreaElement.height($textAreaElement.prop('scrollHeight') + 10);
        }
    };
})();