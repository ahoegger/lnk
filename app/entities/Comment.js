/**
 * Created by Holger on 08.10.2014.
 * This entity class is for comments
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
    this.id = jsonObject.id ? jsonObject.id : this.id;
    this.articleId = jsonObject.articleId ? jsonObject.articleId : this.articleId;
    this.text = jsonObject.text ? jsonObject.text  : this.text;
    this.submittedBy = jsonObject.submittedBy ? jsonObject.submittedBy : this.submittedBy;
    this.submittedOn = jsonObject.submittedOn ? jsonObject.submittedOn : this.submittedOn;
};

Comment.prototype.updateFromJsonString = function(jsonString) {
    this.updateFromJsonObject(JSON.parse(jsonString));
};

Comment.prototype.clone = function() {
    return new Comment(this.id, this.articleId, this.text, this.submittedBy, this.submittedOn);
};

module.exports = {
    Comment: Comment
};