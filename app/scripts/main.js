'use strict';
lnk.namespace('lnk.globals');

lnk.globals.articleViews = ko.observableArray();

jQuery(document).ready( function(){
    ko.applyBindings({ articles: lnk.viewmodels.getSortedArticleViewModel(lnk.services.getArticles()) }, document.getElementById('top-results'));
    ko.applyBindings( lnk.viewmodels.getAddFormViewModel(), document.getElementById('add'));
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
        /**
         * This function can be boun d the textarea form elements to automatically resize these element with the text growing.
         * @param data
         * @param event
         */
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
        },
        formCheckUrlMimetype: function(data, event) {
            var target = $(event.target),
                xhr = new XMLHttpRequest(),
                $img = $('#add-form-image');
            lnk.helper.logDir(data);
            lnk.helper.logDir(event);
            $img.load = (function(){
                // TODO HHE Implement hiding alternate image URL
                console.log('Error loading image');
            });
            $img.error(function() {
                // TODO HHE Implement showing alternate image URL
                console.log('Error loading image');
            });
            $img.attr('src', 'http://i.imgur.comddd/Bj3TxB7.jpgc');
            $img.attr('src', 'http://google.com');
        }
    };
})();