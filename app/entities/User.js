/**
 * This is the User entity
 * @module backend/entities/User
 * @author Holger Heymanns
 * @since 08.10.2014
 */

var bcrypt = require('bcryptjs');

/**
 * This class implements the user entity
 * @param {Number} id must come from the datasets
 * @param {String} userName user name
 * @param {String} name the name of the user
 * @param {String} firstname the first name of the user
 * @param {String} password (must be encrypted)
 * @param {boolean} active true or false, if the user is active or not
 * @constructor
 * @class
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
    this.id = jsonObject.id != undefined ? jsonObject.id : this.id;
    this.userName = jsonObject.userName != undefined ? jsonObject.userName : this.userName;
    this.name = jsonObject.name != undefined ? jsonObject.name : this.name;
    this.firstname = jsonObject.firstname != undefined ? jsonObject.firstname : this.firstname;
    this.password = jsonObject.password != undefined ? bcrypt.hashSync(jsonObject.password, 8) : this.password;
    this.active= jsonObject.active != undefined ? jsonObject.active : this.active;
};

/**
 * Tis function updates the entity based on the given JSON string
 * @param {String} jsonString
 */
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

/**
 * This function returns a clone of the entity
 * @return {User}
 */
User.prototype.clone = function() {
    var user = new User(this.id, this.userName, this.name, this.firstname, '', this.active);
    user.password = this.password; // note: the constructor will encypt an already encrypted password
    return user;
};

module.exports = {
    User: User
};