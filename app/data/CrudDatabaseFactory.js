/**
 * Created by Holger on 05.10.2014.
 */

var log4js = require('log4js');
var logger = log4js.getLogger('data.CrudDatabaseFactory');

/**
 * Constructor for a simulated table
 * @param {Function} entityConstructor Constructor function for the entities stored in the table
 * @param {String} idProperty Property-Name for the ID property
 * @param {String[]} notNullProperties Array of Strings containing the properties, that may not be null
 * @param {String[]} uniqueProperties Array of Strings containing the properties, that must be unique before inserting or updating
 * @constructor
 */
CrudDatabase = function(entityConstructor,
                        idProperty,
                        notNullProperties,
                        uniqueProperties) {
    var dataArray = [];
    this.notNullProperties = notNullProperties;
    this.uniqueProperties = uniqueProperties;
    this.entityConstructor = entityConstructor;
    this.idProperty = idProperty;
    this.getData = function() {
        return dataArray;
    };
    this.uniqueHashHolder = {};
};

// PRIVATE FUNCTIONS for CrudDatabase prototype
/**
 * This function creates a hash based on the properties of the entity that must be unique
 */
CrudDatabase.prototype._createUniqueHash = function(entity) {
    var i;
    var len;
    var hash = undefined;
    if(this.uniqueProperties == undefined || this.uniqueProperties.length === 0) {
        return;
    }
    for (i = 0, len = this.uniqueProperties.length; i < len; i++) {
        if(entity.hasOwnProperty([this.uniqueProperties[i]])) {
            hash = hash + "§!§" + entity[this.uniqueProperties[i]] + "---";
        } else {
            hash = hash + '&dFmissing';
        }
    }
    return hash;
};

/**
 * This function add the hash value to the unique hash holder
 * @param entity
 * @private
 */
CrudDatabase.prototype._addHash = function(entity) {
    this.uniqueHashHolder[this._createUniqueHash(entity)] = null;
};

/**
 * This function removes the hash from the unique hash holder
 * @param entity
 */
CrudDatabase.prototype._removeHash = function(entity) {
    delete this.uniqueHashHolder[this._createUniqueHash(entity)];
};

/**
 * This function validates an entity if it has the required not null properties
 * @private
 */
CrudDatabase.prototype._checkNotNullProperties = function(entity) {
    var i;
    var len;
    var singleProperty;
    if(this.notNullProperties == undefined || this.notNullProperties == null || this.notNullProperties.length == 0) {
        return;
    }
    if(entity == undefined || entity == null) {
        throw new Error('Illegal argument error: Missing entity ' + entity);
    }
    for(i = 0, len = this.notNullProperties.length; i < len; i++) {
        singleProperty = entity[this.notNullProperties[i]];
        if(singleProperty == undefined || singleProperty == null) {
            throw new Error('Illegal argument error: Missing required property ' + this.notNullProperties[i] + " on entity " + entity);
        }
    }
};

/**
 * This function clones the entity, if it supports the function,
 * otherwise, the same entity will simply returned;
 * @param entity
 * @return {*}
 * @private
 */
CrudDatabase.prototype._cloneEntity = function(entity) {
    if(entity.clone) {
        return entity.clone();
    } else {
        return entity;
    }
};

CrudDatabase.prototype._checkLoopProperties = function() {
    if (this.getData() === null || this.getData() === undefined || this.idProperty === null || this.idProperty === undefined) {
        logger.warn('Searching new ID with incomplete data, dataArray=' + this.getData() + ', idProperty=' + this.idProperty);
        return false;
    }
    return true;
};

/**
 * This function finds an element with a given id in an array
 * @param idValue {Number} Value if the id property to be searched
 * @return {number|undefined} Position in the data array
 */
CrudDatabase.prototype._findPositionById = function(idValue) {
    if (!this._checkLoopProperties(this.getData(), this.idProperty)) {
        return;
    }
    for (var i = 0, len = this.getData().length; i < len; i += 1) {
        if (this.getData()[i][this.idProperty] != undefined && this.getData()[i][this.idProperty] === idValue) {
            logger.debug('Found item with id ' + idValue + ' at position ' + i);
            return i;
        }
    }
    logger.debug('Found no item with id ' + idValue);
    return undefined;
};

CrudDatabase.prototype._hasUniqueHash = function() {
    return this.uniqueProperties !== undefined;
};

/**
 * This function returns the position of the element based on the hash value of the non-unique fields
 * If there are no non-unique filed, undefined will be returned.
 * If the entity cannot be found, undefined will be returned.
 * @param entity
 * @return {Number|undefined}
 * @private
 */
CrudDatabase.prototype._findPositionByHash = function(entity) {
    var currentEntity;
    var entityHash = this._createUniqueHash(entity);
    if (!this._hasUniqueHash()) {
        return undefined;
    }
    for (var i = 0, len = this.getData().length; i < len; i += 1) {
        currentEntity = this.getData()[i];
        if (this._createUniqueHash(currentEntity) === entityHash) {
            logger.debug('Found item with hash ' + entityHash + ' at position ' + i);
            return i;
        }
    }
    logger.debug('Found no item with hash ' + entityHash);
    return undefined;
};

/**
 * This function checks, if the given object is an instanceof the given constructor.
 * If this is not the case, an error will be thrown
 * @param object
 */
CrudDatabase.prototype._checkInstance = function(object) {
    if (!(object instanceof this.entityConstructor)) {
        throw new Error('Illegal argument error');
    }
};

/**
 * This function generates a new ID for the article
 * @return {Number} return the new max value or -1 if no value could be found
 */
CrudDatabase.prototype._getNewId = function() {
    var maxValue = -1;
    if (this._checkLoopProperties(this.getData(), this.idProperty)) {
        for (var i = 0, len = this.getData().length; i < len; i += 1) {
            maxValue = (this.getData()[i][this.idProperty] && this.getData()[i][this.idProperty]) > maxValue ? this.getData()[i][this.idProperty] : maxValue;
        }
        maxValue += 1;
        logger.debug('New max value ' + maxValue);
    }
    return maxValue;
};

// PUBLIC FUNCTIONS for CrudDatabase
CrudDatabase.prototype.insert = function(entity) {
    var clonedEntity;
    this._checkInstance(entity);
    this._checkNotNullProperties(entity);
    if(this._findPositionById(entity[this.idProperty]) !== undefined) {
        throw new Error('Unique key constraint violated');
    }
    if(this._findPositionByHash(entity) !== undefined) {
        throw new Error('Unique key constraint violated');
    }
    // update entity with new id
    clonedEntity = this._cloneEntity(entity);
    if(!clonedEntity[this.idProperty]) {
        clonedEntity[this.idProperty] = this._getNewId();
    }
    this._addHash(entity);
    this.getData().push(clonedEntity);    // insert the cloned entity to decouple from updates
    return this._cloneEntity(clonedEntity);  // return another clone to prevent updating the object in the database table
};

CrudDatabase.prototype.selectById = function(id) {
    var pos;
    pos = this._findPositionById(id);
    if(pos != undefined) {
        return this._cloneEntity(this.getData()[pos]);
    }
    return undefined;
};

/**
 * This function selects iterates over the data and returns all elements matching the filter function.
 * The filterFunction receives three arguments:
 * - the value of the element
 * - the index of the element
 * - the Array object being traversed
 * For inspiration see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FArray%2Ffilter
 * @param {function} filterFunction
 * @return {*}
 */
CrudDatabase.prototype.select = function(filterFunction) {
    var result = [];
    var t = Object(this);
    var value;
    for (var i = 0, len = this.getData().length; i < len; i++) {
        value = this.getData()[i];
        if (filterFunction.call(undefined, value, i, t)) {
            result.push(this._cloneEntity(value));
        }
    }
    return result;
};

/**
 * This function updates (replaces) a given entity with a new one. The entity must be present in the data array
 * and the idProperty of the entity must be available
 * @param entity
 * @return {*}
 */
CrudDatabase.prototype.update = function(entity) {
    var pos;
    this._checkInstance(entity);
    this._checkNotNullProperties(entity);
    pos = this._findPositionById(entity[this.idProperty]);
    if (pos != undefined) {
        this._removeHash(this.getData()[pos]);
        this.getData()[pos] = entity;
        this._addHash(entity);
    } else {
        throw new Error('Entity not found');
    }
    return this._cloneEntity(entity);
};

/**
 * This function removes the given element from the database. It must be found via it's ID property
 * @param entity
 */
CrudDatabase.prototype.remove = function(entity) {
    var pos;
    this._checkInstance(entity);
    pos = this._findPositionById(entity[this.idProperty]);
    if (pos != undefined) {
        this._removeHash(this.getData()[pos]);
        this.getData().splice(pos, 1);
    }
};


module.exports = {
    factory: function(entityConstructor, idProperty, notNullProperties, uniqueProperties) {
        return new CrudDatabase(entityConstructor, idProperty, notNullProperties, uniqueProperties);
    }
};