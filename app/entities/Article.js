/**
 * This class implements the Article class
 * Created by Holger on 24.09.2014.
 */

/**
 * This function constructs a new Article
 * @param {String} id
 * @param {String} title
 * @param {URL} url
 * @param {URL} imageUrl
 * @param {String} description
 * @param {String} submittedBy
 * @param {Date} submittedOn
 * @param {String[]} tags
 * @constructor
 */
function Article(id, title, url, imageUrl, description, submittedBy, submittedOn, tags) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.imageUrl = imageUrl;
    this.description = description;
    this.submittedBy = submittedBy;
    this.submittedOn = submittedOn;
    this.tags = tags;
}

/**
 * This function updates the properties of the article object with the given properties from the json object. If the property
 * in the json object is missing, the property will not be updated
 * @param jsonObject
 */
Article.prototype.updateFromJsonObject = function(jsonObject) {
    this.id = jsonObject.id ? jsonObject.id : this.id;
    this.title = jsonObject.title ? jsonObject.title : this.title;
    this.url = jsonObject.url ? jsonObject.url : this.url;
    this.imageUrl = jsonObject.imageUrl ? jsonObject.imageUrl : this.imageUrl;
    this.description = jsonObject.description ? jsonObject.description : this.description;
    this.submittedBy = jsonObject.submittedBy ? jsonObject.submittedBy : this.submittedBy;
    this.submittedOn = jsonObject.submittedOn ? jsonObject.submittedOn : this.submittedOn;
    this.tags = jsonObject.tags ? jsonObject.tags : this.tags;
};

Article.prototype.updateFromJsonString = function(jsonString) {
    this.updateFromJsonObject(JSON.parse(jsonString));
};

Article.prototype.clone = function() {
    return new Article(this.id, this.title, this.url, this.imageUrl, this.description, this.submittedBy, this.submittedOn, this.tags);
};

module.exports = {
    Article: Article
};