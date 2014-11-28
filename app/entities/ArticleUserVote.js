/**
 * This class ist the entity that associates a vote with an article and a user
 * @module backend/entities/ArticleUserVote
 * @author Holger Heymanns
 * @since 08.10.2014
 */

/**
 * This class is a mapping class for the n:m relationship between the votes and the articles
 * @param id
 * @param articleId
 * @param userId
 * @param vote
 * @constructor
 * @class
 */
function ArticleUserVote(id, articleId, userId, vote) {
    this.id = id;
    this.articleId= articleId;
    this.userId = userId;
    this.vote = vote;
}

/**
 * This function updates the properties of the comment object with the given properties from the json object. If the property
 * in the json object is missing, the property will not be updated
 * @param {Object} jsonObject
 */
ArticleUserVote.prototype.updateFromJsonObject = function(jsonObject) {
    this.id = jsonObject.id != undefined ? jsonObject.id : this.id;
    this.articleId = jsonObject.articleId != undefined  ? jsonObject.articleId : this.articleId;
    this.userId = jsonObject.userId != undefined ? jsonObject.userId : this.userId;
    this.vote = jsonObject.vote != undefined  ? jsonObject.vote : this.vote;
};

/**
 * This function updates the entity with the data provided as a JSON string
 * @param {String} jsonString
 */
ArticleUserVote.prototype.updateFromJsonString = function(jsonString) {
    this.updateFromJsonObject(JSON.parse(jsonString));
};

/**
 * This function clones the entity
 * @return {ArticleUserVote}
 */
ArticleUserVote.prototype.clone = function() {
    return new ArticleUserVote(this.id, this.articleId, this.userId, this.vote);
};

module.exports = {
    ArticleUserVote: ArticleUserVote
};