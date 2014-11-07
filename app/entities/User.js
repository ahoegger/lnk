/**
 * Created by Holger on 08.10.2014.
 * This is the User entity
 */

var bcrypt = require('bcryptjs');

/**
 * Create a new user object
 * @param {Number} id must come from the datasets
 * @param {String} userName user name
 * @param {String} name the name of the user
 * @param {String} firstname the first name of the user
 * @param {String} password (must be encrypted)
 * @param {boolean} active true or false, if the user is active or not
 * @constructor
 */
function User(id, userName, name, firstname, password, active) {
    this.id = id;
    this.userName= userName;
    this.name = name;
    this.firstname = firstname;
    this.password = password;
    this.active = active;
}

User.prototype.encryptPassword = function(password) {
    if (password !== undefined || password !== null) {
        return bcrypt.hashSync(password, 8);
    }
};

/**
 * This function updates the properties of the comment object with the given properties from the json object. If the property
 * in the json object is missing, the property will not be updated
 * @param jsonObject
 */
User.prototype.updateFromJsonObject = function(jsonObject) {
    this.id = jsonObject.id ? jsonObject.id : this.id;
    this.userName = jsonObject.userName ? jsonObject.userName : this.userName;
    this.name = jsonObject.name ? jsonObject.name : this.name;
    this.firstname = jsonObject.firstname ? jsonObject.firstname : this.firstname;
    this.password = jsonObject.password ? bcrypt.hashSync(jsonObject.password, 8) : this.password;
    this.active= jsonObject.active ? jsonObject.active : this.active;
};

User.prototype.updateFromJsonString = function(jsonString) {
    this.updateFromJsonObject(JSON.parse(jsonString));
};

/**
 * This function compares a password with the stored, encrypted password
 * @param {String} password the  password
 * @param {boolean} encrypted If true, the provided password is assumed to be true
 * @return {boolean} true, if the passwords match
 */
User.prototype.isAuthenticated = function(password, encrypted) {
    if (!this.active) {
        return false;
    }
    if (encrypted) {
        return this.password === password;
    }
    return bcrypt.compareSync(password, this.password);
};

User.prototype.clone = function() {
    var user = new User(this.id, this.userName, this.name, this.firstname, '', this.active);
    user.password = this.password; // note: the constructor will encypt an already encrypted password
    return user;
};

module.exports = {
    User: User
};