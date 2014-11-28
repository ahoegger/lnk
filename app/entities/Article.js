/**
 * This module implements the Article class
 * @module backend/entities/Article
 * @author Holger Heymanns
 * @since 24.09.2014
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
 * @param {VoteContainer} votes Entity that contains the number of votes
 * @constructor
 * @class
 */
function Article(id, title, url, imageUrl, description, submittedBy, submittedOn, tags, votes) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.imageUrl = imageUrl;
    this.description = description;
    this.submittedBy = submittedBy;
    this.submittedOn = submittedOn;
    this.tags = tags;
    this.votes = votes;
}

/**
 * This function updates the properties of the article object with the given properties from the json object. If the property
 * in the json object is missing, the property will not be updated
 * @param jsonObject
 */
Article.prototype.updateFromJsonObject = function(jsonObject) {
    this.id = jsonObject.id != undefined ? jsonObject.id : this.id;
    this.title = jsonObject.title != undefined ? jsonObject.title : this.title;
    this.url = jsonObject.url != undefined ? jsonObject.url : this.url;
    this.imageUrl = jsonObject.imageUrl != undefined ? jsonObject.imageUrl : this.imageUrl;
    this.description = jsonObject.description != undefined ? jsonObject.description : this.description;
    this.submittedBy = jsonObject.submittedBy != undefined ? jsonObject.submittedBy : this.submittedBy;
    this.submittedOn = jsonObject.submittedOn != undefined ? jsonObject.submittedOn : this.submittedOn;
    this.tags = jsonObject.tags != undefined ? jsonObject.tags : this.tags;
    this.votes = jsonObject.votes != undefined ? jsonObject.votes : this.votes;
};

Article.prototype.updateFromJsonString = function(jsonString) {
    this.updateFromJsonObject(JSON.parse(jsonString));
};

Article.prototype.clone = function() {
    return new Article(this.id, this.title, this.url, this.imageUrl, this.description, this.submittedBy, this.submittedOn, this.tags, this.votes);
};

module.exports = {
    Article: Article
};