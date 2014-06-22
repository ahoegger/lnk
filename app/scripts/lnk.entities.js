/**
 * Created by holger on 16.06.2014.
 */

lnk.namespace('lnk.entities');

/**
 * The entities module provides constructors for model entities
 */
lnk.entities = (function() {
    var constructors = {
    /**
     * Constructor for Article bean
     * @param id {Number}
     * @param title {String}
     * @param url {String}
     * @param description {String}
     * @param submittedBy {String}
     * @param submittedOn {Date}
     * @param votes {Number}
     * @constructor
     */
    Article: function Article(id, title, url, description, submittedBy, submittedOn, votes) {
        this.id = id;
        this.title = title;
        this.url = url;
        this.description = description;
        this.submittedBy = submittedBy;
        this.submittedOn = submittedOn;
        this.votes = votes;
    },
    /**
     * Construcotr function of Comment bean
     * @param id {Number}
     * @param articleId {Number}
     * @param text {String}
     * @param submittedBy {String}
     * @param submittedOn {Date}
     * @constructor
     */
    Comment: function(id, articleId, text, submittedBy, submittedOn) {
        this.id = id;
        this.articleId = articleId;
        this.text = text;
        this.submittedBy = submittedBy;
        this.submittedOn = submittedOn;
    }
    };

    return {
        Article: function(id, title, url, description, submittedBy, submittedOn, votes) {
            return new constructors.Article(id, title, url, description, submittedBy, submittedOn, votes);
        },
        Comment: function(id, articleId, text, submittedBy, submittedOn) {
            return new constructors.Comment(id, articleId, text, submittedBy, submittedOn);
        }
    }
})();