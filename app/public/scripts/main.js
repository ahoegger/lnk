'use strict';
var lnk = lnk || {};
lnk.namespace('lnk.behaviour');
lnk.namespace('lnk.globals');
lnk.globals.articleViews = ko.observableArray();

jQuery(document).ready( function() {
    var observableData = ko.observableArray();
    lnk.behaviour.setObservableDataSource(observableData);
    ko.applyBindings({ articles: lnk.viewmodels.getSortedArticleViewModel(observableData) }, document.getElementById('top-results'));
    ko.applyBindings( lnk.viewmodels.buildAddFormViewModel(observableData, $('#lnk-submit')), document.getElementById('add'));
    ko.applyBindings( observableData, document.getElementById('search'));
});

lnk.behaviour = (function($, ko, SERVICE, HELPER) {
    var observableDataReference = null;
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
            HELPER.logDebug(formElement);
            HELPER.logDir(observableDataReference());
            // observableDataReference = lnk.viewmodels.buildObservableArticleViews(SERVICE.getArticles());
            observableDataReference.removeAll();
            serviceDataViewModels = lnk.viewmodels.buildObservableArticleViews(SERVICE.getArticles());
            $.each(serviceDataViewModels(), function(index, value) {
                observableDataReference.push(value);
            });
            // observableDataReference.valueHasMutated();
            HELPER.logDir(observableDataReference);
        },
        addComment: function(formElement) {
            var newComment;
            if (formElement.comment.value != '') {
                newComment = lnk.entities.Comment(
                    null,
                    ko.dataFor(formElement).id,
                    formElement.comment.value,
                    'newCommenter',
                    new Date()
                );

                HELPER.logDir(newComment);
                SERVICE.addComment(newComment);     // push comment to the service
                ko.dataFor(formElement).addComment(newComment);
                formElement.comment.value = '';     // reset for after submitting comment
                $.notify.defaults({
                    style: 'bootstrap',
                    className: 'success',
                    showAnimation: 'fadeIn',
                    hideAnimation: 'fadeOut'
                });
                $(formElement).notify(
                    'Successfully added comment',
                    {
                        position: 'bottom right'
                    }
                );
            }
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
})(jQuery, ko, lnk.services, lnk.helper);