/**
 * Created by Holger on 17.09.2014.
 * This entity describes a Tag
 */

var tagFunctions = {};

var Tag = function(id, tag) {
    this.id = id;
    this.tag = tag;
};

var tagFromJsonObject = function(jsonObject) {
    return new Tag(jsonObject.id, jsonObject.tag);
};

var tagFromJsonString = function(jsonString) {
    return tagFromJsonObject(JSON.parse(jsonString))
};

var tagsFromJsonObject = function(jsonObject) {
    var tags = [];
    var counter = 0;
    for (;counter < jsonObject.length; counter++) {
        tags.push(tagFromJsonObject(jsonObject[counter]));
    }
    return tags;
};

tagFunctions.new = Tag;
tagFunctions.fromJson = tagFromJsonObject;
tagFunctions.fromJsonString = tagFromJsonString;
tagFunctions.fromJsonObjects = tagsFromJsonObject;

module.exports = tagFunctions;