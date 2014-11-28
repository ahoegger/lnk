/**
 * This entity class is for comments
 * @module backend/entities/Comment
 * @author Holger Heymanns
 * @since 08.10.2014
 */

/**
 * This class implements the comment entity
 * @param id
 * @param articleId
 * @param text
 * @param submittedBy
 * @param submittedOn
 * @constructor
 * @class
 */
function Comment(id, articleId, text, submittedBy, submittedOn) {
    this.id = id;
    this.articleId = articleId;
    this.text = text;
    this.submittedBy = submittedBy;
    this.submittedOn = submittedOn;
}

/**
 * This function updates the properties of the comment object with the given properties from the json object. If the property
 * in the json object is missing, the property will not be updated
 * @param jsonObject
 */
Comment.prototype.updateFromJsonObject = function(jsonObject) {
    this.id = jsonObject.id != undefined ? jsonObject.id : this.id;
    this.articleId = jsonObject.articleId != undefined ? jsonObject.articleId : this.articleId;
    this.text = jsonObject.text != undefined ? jsonObject.text  : this.text;
    this.submittedBy = jsonObject.submittedBy != undefined ? jsonObject.submittedBy : this.submittedBy;
    this.submittedOn = jsonObject.submittedOn != undefined ? jsonObject.submittedOn : this.submittedOn;
};

/**
 * Tis function updates the entity based on the given JSON string
 * @param {String} jsonString
 */
Comment.prototype.updateFromJsonString = function(jsonString) {
    this.updateFromJsonObject(JSON.parse(jsonString));
};

/**
 * This function returns a clone of the entity
 * @return {Comment}
 */
Comment.prototype.clone = function() {
    return new Comment(this.id, this.articleId, this.text, this.submittedBy, this.submittedOn);
};

module.exports = {
    Comment: Comment
};