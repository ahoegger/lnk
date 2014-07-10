'use strict';
lnk.namespace('lnk.globals');
lnk.namespace('lnk.behaviour');

lnk.globals.articleViews = ko.observableArray();

jQuery(document).ready( function(){
    var observableData = ko.observableArray() // lnk.viewmodels.buildObservableArticleViews(lnk.services.getArticles());
    lnk.behaviour.setObservableDataSource(observableData);
    ko.applyBindings({ articles: lnk.viewmodels.getSortedArticleViewModel(observableData) }, document.getElementById('top-results'));
    ko.applyBindings( lnk.viewmodels.getAddFormViewModel(observableData), document.getElementById('add'));
    // ko.applyBindings( lnk.viewmodels.getAddFormViewModel(observableData), document.getElementById('search'));
    ko.applyBindings( observableData, document.getElementById('search'));
});

lnk.behaviour = (function() {
    var observableDataReference;
    console.log('ObservableDataReference:' + observableDataReference);
    return {
        setObservableDataSource: function(observableData) {
            observableDataReference = observableData;
        },
        /**
         * This function executes the search on the service with the given search string
         * @param formElement
         */
        search: function(formElement) {
            var serviceDataViewModels;
            lnk.helper.logDebug(formElement);
            lnk.helper.logDir(observableDataReference());
            // observableDataReference = lnk.viewmodels.buildObservableArticleViews(lnk.services.getArticles());
            observableDataReference.removeAll();
            serviceDataViewModels = lnk.viewmodels.buildObservableArticleViews(lnk.services.getArticles());
            _.each(serviceDataViewModels(), function(element) {
                observableDataReference.push(element);
            });
            // observableDataReference.valueHasMutated();
            lnk.helper.logDir(observableDataReference);
        },
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
        addComment: function(formElement) {
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
         * This function can be bound to the textarea form elements to automatically resize these element with the text growing.
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
        }
    };
})();