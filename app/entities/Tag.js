/**
 * This class implements the Tag Class
 * Created by Holger on 24.09.2014.
 */

/**
 *
 * @param id
 * @param tag
 * @constructor
 */
function Tag(id, tag) {
    this.id = id;
    this.tag = tag;
};

Tag.prototype.updateFromJsonObject = function(jsonObject) {
    this.id = jsonObject.id ? jsonObject.id : this.id;
    this.tag = jsonObject.tag ? jsonObject.tag : this.tag;
};

Tag.prototype.updateFromJsonString = function(jsonString) {
    this.updateFromJsonObject(JSON.parse(jsonString));
};

module.exports = {
    Tag: Tag
};
