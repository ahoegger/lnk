'use strict';
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
            lnk.helper.logDir(newArticle);
            lnk.services.addArticle(newArticle);    // push it to the service
            lnk.globals.articleViews.push(lnk.entities.ArticleViewModel(newArticle));   // Add it to the observed result set
        },
        addComment: function(formElement, thingy) {
            // function (id, articleId, text, submittedBy, submittedOn)
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