/**
 * Created by holger on 06.09.2014.
 * This file contains the functions needed for the article entity
 */

var articleFunctions = {};

/**
 * This function constructs a new Article
 * @param id
 * @param title
 * @param url
 * @param imageUrl
 * @param description
 * @param submittedBy
 * @param submittedOn
 * @constructor
 */
var Article = function Article(id, title, url, imageUrl, description, submittedBy, submittedOn) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.imageUrl = imageUrl;
    this.description = description;
    this.submittedBy = submittedBy;
    this.submittedOn = submittedOn;
};

/**
 * This function returns an Article from a given JSON string. Properties not needed a simply omitted
 * @param jsonObject
 * @return Article
 */
var articleFromJson = function(jsonObject) {
    return new Article(
        jsonObject.id || null,
        jsonObject.title,
        jsonObject.url,
        jsonObject.imageUrl,
        jsonObject.description,
        jsonObject.submittedBy,
        jsonObject.submittedOn || new Date()
    )
};

var articleFromJsonString = function(jsonData) {
    return articleFromJson(JSON.parse(jsonData))
};

// map the relevant public functions to the returned object
articleFunctions.new = Article;
articleFunctions.fromJson = articleFromJson;
articleFunctions.fromJsonString = articleFromJsonString;

module.exports= articleFunctions;
