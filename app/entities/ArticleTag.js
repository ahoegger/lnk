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
 * This function clones the entity
 * @return {ArticleTag}
 */
ArticleTag.prototype.clone = function() {
    return new ArticleTag(this.id, this.articleId, this.tagId);
};

module.exports = {
    ArticleTag: ArticleTag
};