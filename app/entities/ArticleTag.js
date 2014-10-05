/**
 * Created by Holger on 04.10.2014.
 */


function ArticleTag(id, articleId, tagId) {
    this.id = id;
    this.articleId = articleId;
    this.tagId = tagId;
}

ArticleTag.prototype.clone = function() {
    return new ArticleTag(this.id, this.articleId, this.tagId);
};

module.exports = {
    ArticleTag: ArticleTag
};