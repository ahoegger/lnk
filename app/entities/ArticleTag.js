/**
 * This module provides the entity ArticleTag
 * @module backend/entities/ArticleTag
 * @author Holger Heymanns
 * @since 04.10.2014
 */

/**
 * This class is a mapping class for the n_m relationship of an articles and a tag
 * @param id
 * @param articleId
 * @param tagId
 * @constructor
 * @class
 */
function ArticleTag(id, articleId, tagId) {
    this.id = id;
    this.articleId = articleId;
    this.tagId = tagId;
}

/**
 * This function updates the properties of the ArticleTag object with the given properties from the json object. If the property
 * in the json object is missing, the property will not be updated
 * @param jsonObject
 */
ArticleTag.prototype.updateFromJsonObject = function(jsonObject) {
    this.id = jsonObject.id != undefined ? jsonObject.id : this.id;
    this.articleId = jsonObject.articleId != undefined ? jsonObject.articleId : this.articleId;
    this.tagId = jsonObject.tagId != undefined ? jsonObject.tagId : this.tagId;
};

ArticleTag.prototype.updateFromJsonString = function(jsonString) {
    this.updateFromJsonObject(JSON.parse(jsonString));
};


/**
 * This function clones the entity
 * @return {ArticleTag}
 */
ArticleTag.prototype.clone = function() {
    return new ArticleTag(this.id, this.articleId, this.tagId);
};

module.exports = {
    ArticleTag: ArticleTag
};