/**
 * Created by Holger on 08.10.2014.
 * This class ist the entity that associates a vote with an article and a user
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
 * @param jsonObject
 */
ArticleUserVote.prototype.updateFromJsonObject = function(jsonObject) {
    this.id = jsonObject.id ? jsonObject.id : this.id;
    this.articleId = jsonObject.articleId ? jsonObject.articleId : this.articleId;
    this.userId = jsonObject.userId ? jsonObject.userId : this.userId;
    this.vote = jsonObject.vote ? jsonObject.vote : this.vote;
};

ArticleUserVote.prototype.updateFromJsonString = function(jsonString) {
    this.updateFromJsonObject(JSON.parse(jsonString));
};

ArticleUserVote.prototype.clone = function() {
    return new ArticleUserVote(this.id, this.articleId, this.userId, this.vote);
};

module.exports = {
    ArticleUserVote: ArticleUserVote
};