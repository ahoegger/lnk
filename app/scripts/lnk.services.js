"use strict";
/**
 * Created by holger on 22.06.2014.
 */
var lnk = lnk || {};
lnk.namespace('lnk.services');

/**
 * The factories module provides factories or mixin functions
 */
lnk.services = (function() {

    var cachedArticles = [
        {
            id: 1,
            title: 'Jersey - RESTful Web Services in Java',
            description: 'Developing RESTful Web services that seamlessly support exposing your data in a variety of representation media types and abstract away the low-level details of the client-server communication is not an easy task without a good toolkit. In order to simplify development of RESTful Web services and their clients in Java, a standard and portable JAX-RS API has been designed. Jersey RESTful Web Services framework is open source, production quality, framework for developing RESTful Web Services in Java that provides support for JAX-RS APIs and serves as a JAX-RS (JSR 311 & JSR 339) Reference Implementation.',
            url: 'https://jersey.java.net/',
            imageUrl: 'https://jersey.java.net/images/jersey_logo.png',
            submittedBy: 'hhe',
            submittedOn: new Date('06/14/2014'),
            votes: 0,
            tags: ['Java', 'REST', 'JAX-RS'],
            numberOfComments: 2
        },
        {
            id: 2,
            title: 'FasterXML/jackson',
            description: 'Jackson is a suite of data-processing tools for Java (and JVM platform), including the flagship JSON parsing and generation library, as well as additional modules to process data encoded in Avro, CBOR, CSV, Smile, XML or YAML (and list of supported format is still growing!)',
            url: 'https://github.com/FasterXML/jackson',
            imageUrl: 'http://fasterxml.com/images/fxml_logo.png',
            submittedBy: 'aho',
            submittedOn: new Date(),
            votes: 0,
            tags: ['Java', 'JSON'],
            numberOfComments: 2
        },
        {
            id: 3,
            title: 'Eclipse Scout',
            description: 'Eclipse Scout is a mature and open framework for modern, service oriented business applications. It substantially boosts developer productivity and is simple to learn.',
            url: 'https://www.eclipse.org/scout/',
            imageUrl: 'http://www.bsiag.com/scout/wp-content/themes/bsi_new/images/header1.png',
            submittedBy: 'aho',
            submittedOn: new Date(),
            votes: 2,
            tags: ['Scout', 'Eclipse Scout', 'Eclipse'],
            numberOfComments: 3
        }
    ];

    var cachedComments = [
        {
            id: 1,
            articleId: 1,
            text: 'Comment 1 for article 1',
            submittedOn: new Date(),
            submittedBy: 'aho'

        },
        {
            id: 2,
            articleId: 1,
            text: 'Comment 2 for article 1',
            submittedOn: new Date(),
            submittedBy: 'hhe'
        },
        {
            id: 3,
            articleId: 2,
            text: 'Comment 1 for article 2',
            submittedOn: new Date(),
            submittedBy: 'hhe'
        },
        {
            id: 4,
            articleId: 2,
            text: 'Comment 2 for article 2',
            submittedOn: new Date(),
            submittedBy: 'aho'
        },
        {
            id: 5,
            articleId: 3,
            text: 'Simple: Looking for an an application framework where you really get what you see? Then you might really like to have a look at the Eclipse Scout Screencasts',
            submittedOn: new Date(),
            submittedBy: 'hhe'
        },
        {
            id: 6,
            articleId: 3,
            text: 'Simple: Looking for an an application framework where you really get what you see? Then you might really like to have a look at the Eclipse Scout Screencasts.',
            submittedOn: new Date(),
            submittedBy: 'hhe'
        },
        {
            id: 7,
            articleId: 3,
            text: 'Flexible: Dreaming of an application framework that combines easy learning with powerful adapting? Why don\'t you check out our Eclipse Scout tutorial',
            submittedOn: new Date(),
            submittedBy: 'hhe'
        }
    ];

    var helperFunctions = {},
        serviceFunctions = {};
    helperFunctions.checkLoopProperties = function checkLoopProperties(dataArray, idProperty) {
        if(dataArray === undefined || idProperty === undefined) {
            lnk.helper.logWarn('Searching new ID with incomplete data, dataArray=' + dataArray + ", idProperty=" + idProperty);
            return false;
        }
        return true;
    };

    /**
     * This function generates a new ID for the article
     * @param dataArray {object[]} array to search for an id
     * @param idProperty {String} name of the property, that contains the id value
     * @return {Number} return the new max value or -1 if no value could be found
     */
    helperFunctions.getNewId = function getNewId(dataArray, idProperty) {
        var maxValue = -1;
        if(helperFunctions.checkLoopProperties(dataArray, idProperty)) {
            for (var i = 0, len = dataArray.length; i < len; i += 1) {
                maxValue = (dataArray[i][idProperty] && dataArray[i][idProperty]) > maxValue ? dataArray[i][idProperty] : maxValue;
            }
            maxValue += 1;
            lnk.helper.logDebug('New max value ' + maxValue);
        }
        return maxValue;
    };

    /**
     * This function finds an element with a given id in an array
     * @param dataArray {object[]}
     * @param idProperty [String}
     * @param idValue {Number}
     * @return {number}
     */
    helperFunctions.findPositionById = function findPositionById(dataArray, idProperty, idValue) {
        if(!helperFunctions.checkLoopProperties(dataArray, idProperty)) {
            return;
        }
        for (var i = 0, len = dataArray.length; i < len; i += 1) {
            if(dataArray[i][idProperty] && dataArray[i][idProperty] === idValue) {
                lnk.helper.logDebug('Found item with id ' + idValue + ' at position ' + i);
                return i;
            }
        }
        lnk.helper.logInfo('Found no item with id ' + idValue);
    };

    /**
     * This function loops over the data array and searches each element for a given property and add every matching element
     * to the result set
     * @param dataArray {Array} Array containing the data
     * @param idProperty {String} Name of the property to be matched}
     * @param idValue {*} Value of the property to be exactly matched
     * @return {Array} The matching elements of the original array
     * @private
     */
    helperFunctions.filterCommentsForArticle = function filterCommentsForArticle(dataArray, idProperty, idValue) {
        var resultSet = [];
        if (!helperFunctions.checkLoopProperties(dataArray, idProperty) && idValue) {
            return;
        }

        for (var i = 0, len = dataArray.length; i < len; i += 1) {
            if(dataArray[i][idProperty] && dataArray[i][idProperty] === idValue) {
                lnk.helper.logDebug('Found item with id ' + idValue + ' at position ' + i);
                resultSet.push(dataArray[i]);
            }
        }
        return resultSet;
    };

    serviceFunctions.getArticles = function getArticles() {
        lnk.helper.logDebug('Returning articles ' + cachedArticles);
        return cachedArticles;
    };

    serviceFunctions.addArticle = function addArticle(article) {
        // Do possibly some validation...
        article.id = helperFunctions.getNewId(cachedArticles, 'id');
        cachedArticles.push(article);
        return article;
    };

    serviceFunctions.updateArticle = function updateArticle(newArticle) {
        var position;
        position = helperFunctions.findPositionById(cachedArticles, 'id', newArticle.id);
        if (position !== undefined) {
            cachedArticles[position] = newArticle;
        } else {
            lnk.helper.logWarn('Article not found in cached articles. Article was ' + newArticle);
        }
    };

    serviceFunctions.deleteArticle = function deleteArticle(id) {
        var position;
        position = helperFunctions.findPositionById(cachedArticles, 'id', id);
        if (position !== undefined) {
            cachedArticles.splice([position],1);
        } else {
            lnk.helper.logWarn('Article id ' + id + ' not found in cached articles.');
        }
    };

    serviceFunctions.vote = function vote(id, value) {
        var position = helperFunctions.findPositionById(cachedArticles, 'id', id);
        if (position !== undefined) {
            cachedArticles[position].votes = cachedArticles[position].votes + value;
        } else {
            lnk.helper.logWarn('Article not found in cached articles. ArticleId was ' + id);
        }
    };

    serviceFunctions.getComments = function getComments(articleId) {
        lnk.helper.logDebug('Returning comments for article ' + articleId);
        return helperFunctions.filterCommentsForArticle(cachedComments, 'articleId', articleId);
    };

    serviceFunctions.updateComment = function updateComment(newComment) {
        var position;
        position = helperFunctions.findPositionById(cachedComments, 'id', newComment.id);
        if (position !== undefined) {
            cachedComments[position] = newComment;
        } else {
            lnk.helper.logWarn('Comment not found in cached articles. Comment was ' + newComment);
        }
    };

    serviceFunctions.addComment = function addComment(newComment) {
        // Do possibly some validation...
        newComment.id = helperFunctions.getNewId(cachedComments, 'id');
        cachedComments.push(newComment);
    };

    serviceFunctions.deleteComment = function deleteComment(id) {
        var position;
        position = helperFunctions.findPositionById(cachedComments, 'id', id);
        if (position !== undefined) {
            cachedComments.splice([position],1);
        } else {
            lnk.helper.logWarn('Comment id ' + id + ' not found in cached comments.');
        }
    };

    return {
        /**
         * This method returns an array of articles
         * @return {article[]}
         */
        getArticles: function() {
            return serviceFunctions.getArticles();
        },
        /**
         * This function updates an article in the articleCache
         * @param {article} newArticle
         */
        updateArticle: function(newArticle) {
            serviceFunctions.updateArticle(newArticle);
        },
        /**
         * This method add a new article to the list of articles
         * and assigns it a new id
         * @param newArticle {Article} The article to be added
         * @return {Article} the effective article after being added (i.e. with the new id property)
         */
        addArticle: function(newArticle) {
            serviceFunctions.addArticle(newArticle);
        },
        deleteArticle: function(id) {
            serviceFunctions.deleteArticle(id);
        },
        /**
         * This function add one vote to an article
         * @param id {number} ID of the article
         */
        articleVoteUp: function(id) {
            serviceFunctions.vote(id, 1)
        },
        /**
         * This function removes one vote to an article
         * @param id {number} ID of the article
         */
        articleVoteDown: function(id) {
            serviceFunctions.vote(id, -1)
        },
        /**
         * This function returns the comments for a given articleId
         * @param articleId {Number}
         * @return comment[]
         */
        getComments: function(articleId) {
            return serviceFunctions.getComments(articleId);
        },
        updateComment: function(updatedComment) {
            serviceFunctions.updateComment(updatedComment)
        },
        addComment: function(newComment) {
            serviceFunctions.addComment(newComment)
        },
        deleteComment: function(id) {
            serviceFunctions.deleteComment(id);
        }
    };
})();