'use strict'
lnk.namespace('lnk.globals');

lnk.globals.articleViews = ko.observableArray();

jQuery(document).ready( function(){
    // initialize the articles and stuff
    var articles = lnk.services.getArticles(),
        articleViews = lnk.globals.articleViews,
        max = articles.length;
    for (var i = 0; i < max; i += 1) {
        articleViews.push(lnk.entities.ArticleViewModel(articles[i]));
    }
    lnk.globals.articleViews = articleViews;
    ko.applyBindings({ articles: articleViews }, document.getElementById('top-results'));
    ko.applyBindings({  }, document.getElementById('add'));
});

lnk.namespace('lnk.behaviour');

lnk.behaviour = (function() {
    return {
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
            lnk.helper.logDir(formElement);
            lnk.helper.logDebug(formElement.url);
            lnk.services.addArticle(newArticle);    // push it to the service
            lnk.globals.articleViews.push(lnk.entities.ArticleViewModel(newArticle));   // Add add it to the observed result set
        }
    }
})();