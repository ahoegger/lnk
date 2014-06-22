'use strict'
jQuery(document).ready( function(){
    // initialize the articles and stuff
    var articles = lnk.services.getArticles(),
        articleViews = [],
        max = articles.length;
    for (var i = 0; i < max; i += 1) {
        articleViews.push(lnk.entities.ArticleViewModel(articles[i]));
    }
    ko.applyBindings({ articles: articleViews }, document.getElementById('top-results'));
});