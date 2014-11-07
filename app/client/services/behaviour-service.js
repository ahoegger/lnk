/**
 * Created by aho on 16.09.2014.
 */
var behaviourModule = angular.module('service.behaviour', []);

behaviourModule.factory('behaviour', [
    function () {
         /**
         * This function can be bound to the textarea form elements to automatically resize these element with the text growing.
         * @param data
         * @param event
         */
         var autoResizeTextarea = function(data, event) {
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
        };

        return {
            autoResizeTextarea: autoResizeTextarea
        };
    }]);



