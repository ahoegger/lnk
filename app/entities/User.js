/**
 * Created by Holger on 08.10.2014.
 * This is the User entity
 */

var bcrypt = require('bcryptjs');

/**
 * Create a new user object
 * @param {Number} id must come from the datasets
 * @param {String} userName user name
 * @param {String} password plaintext password, will be transfotrmed in to a encrytped password
 * @param {boolean} active true or false, if the user is active or not
 * @constructor
 */
function User(id, userName, password, active) {
    this.id = id;
    this.userName= userName;
    this.password = bcrypt.hashSync(password, 8);
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
    this.password = jsonObject.password ? bcrypt.hashSync(jsonObject.password, 8) : this.password;
    this.active= jsonObject.active ? jsonObject.active : this.active;
};

User.prototype.updateFromJsonString = function(jsonString) {
    this.updateFromJsonObject(JSON.parse(jsonString));
};

User.prototype.isAuthenticated = function(password) {
    return bcrypt.compareSync(password, this.password);
};

User.prototype.clone = function() {
    var user = new User(this.id, this.userName, '', this.active);
    user.password = this.password; // note: the consctructor will encypt an already encrypted password
    return user;
};

module.exports = {
    User: User
};