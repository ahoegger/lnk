/**
 * This class implements the Tag Class
 * @module backend/entities/Tag
 * @author Holger Heymanns
 * @since 24.09.2014
 */

/**
 * This class implements the Tag entity
 * @param id
 * @param tag
 * @constructor
 * @class
 */
function Tag(id, tag) {
    this.id = id;
    this.tag = tag;
}

/**
 * This function returns a clone of the entity
 * @return {Tag}
 */
Tag.prototype.clone = function() {
    return new Tag(this.id, this.tag);
};

/**
 * This function updates the properties of the Tag object with the given properties from the json object. If the property
 * in the json object is missing, the property will not be updated
 * @param jsonObject
 */
Tag.prototype.updateFromJsonObject = function(jsonObject) {
    this.id = jsonObject.id != undefined ? jsonObject.id : this.id;
    this.tag = jsonObject.tag != undefined ? jsonObject.tag : this.tag;
};

/**
 * Tis function updates the entity based on the given JSON string
 * @param {String} jsonString
 */
Tag.prototype.updateFromJsonString = function(jsonString) {
    this.updateFromJsonObject(JSON.parse(jsonString));
};

module.exports = {
    Tag: Tag
};
