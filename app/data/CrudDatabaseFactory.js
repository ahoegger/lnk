/**
 * Created by Holger on 05.10.2014.
 */

var log4js = require('log4js');
var logger = log4js.getLogger('data.CrudDatabaseFactory');


CrudDatabase = function(entityConstructor,
                        idProperty,
                        notNullProperties) {
    var dataArray = [];
    this.notNullProperties = notNullProperties;
    this.entityConstructor = entityConstructor;
    this.idProperty = idProperty;
    this.getData = function() {
        return dataArray;
    };
};

// PRIVATE FUNCTIONS for CrudDatabase prototype
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
 * This function clones the entity, if it suports the function,
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
 * @return {number} Position in the data array
 */
CrudDatabase.prototype._findPositionById = function (idValue) {
    if (!this._checkLoopProperties(this.getData(), this.idProperty)) {
        return undefined;
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


/**
 * This function checks, if the given object is an instanceof the given constructor.
 * If this is not the case, an error will be thrown
 * @param object
 */
CrudDatabase.prototype._checkInstance = function(object) {
    if (!(object instanceof this.entityConstructor)) {
        // logger.error('Object ' + object + ' not of type ', constructor);
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
    this._checkInstance(entity);
    this._checkNotNullProperties(entity);
    if(this._findPositionById(entity[this.idProperty])) {
        throw new Error('Unique key constraint violated');
    }
    // update entity with new id
    if(!entity[this.idProperty]) {
        entity[this.idProperty] = this._getNewId();
    }
    this.getData().push(entity);    // insert NOT the cloned entity to decouple from updates
    return this._cloneEntity(entity);
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
            result.push(value);
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
        this.getData()[pos] = entity;
    } else {
        throw new Error('Entity not found');
    }
    return this._cloneEntity(entity);
};

CrudDatabase.prototype.delete = function(entity) {
    var pos;
    this._checkInstance(entity);
    pos = this._findPositionById(entity[this.idProperty]);
    if (pos != undefined) {
        this.getData().splice(pos, 1);
    }
};


module.exports = {
    factory: function(entityConstructor, idProperty, notNullProperties) {
        return new CrudDatabase(entityConstructor, idProperty, notNullProperties);
    }
};