/**
 * Created by Holger on 08.10.2014.
 * This is the User entity
 */

function User(id, userName, active) {
    this.id = id;
    this.userName= userName;
    this.active = active;
}

/**
 * This function updates the properties of the comment object with the given properties from the json object. If the property
 * in the json object is missing, the property will not be updated
 * @param jsonObject
 */
User.prototype.updateFromJsonObject = function(jsonObject) {
    this.id = jsonObject.id ? jsonObject.id : this.id;
    this.userName = jsonObject.userName ? jsonObject.userName : this.userName;
    this.active= jsonObject.active ? jsonObject.active : this.active;
};

User.prototype.updateFromJsonString = function(jsonString) {
    this.updateFromJsonObject(JSON.parse(jsonString));
};

User.prototype.clone = function() {
    return new User(this.id, this.userName, this.active);
};

module.exports = {
    User: User
};