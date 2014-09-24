/**
 * Created by Holger on 20.09.2014.
 * This module contains some helper functions for the in memory database
 */

var log4js = require('log4js');
var logger = log4js.getLogger('data.InMemoryDatabaseHelper');

module.exports = {};

/**
 * This function checks, if properties required are available
 * @param dataArray The array containing data
 * @param idProperty The name of the id property
 * @return {boolean} True, if both proeprties are well defined
 */
var checkLoopProperties = function (dataArray, idProperty) {
    if (dataArray === null || dataArray === undefined || idProperty === null || idProperty === undefined) {
        logger.warn('Searching new ID with incomplete data, dataArray=' + dataArray + ', idProperty=' + idProperty);
        return false;
    }
    return true;
};

module.exports = {
    /**
     * This function generates a new ID for the article
     * @param dataArray {object[]} array to search for an id
     * @param idProperty {String} name of the property, that contains the id value
     * @return {Number} return the new max value or -1 if no value could be found
     */
    getNewId: function (dataArray, idProperty) {
        var maxValue = -1;
        if (checkLoopProperties(dataArray, idProperty)) {
            for (var i = 0, len = dataArray.length; i < len; i += 1) {
                maxValue = (dataArray[i][idProperty] && dataArray[i][idProperty]) > maxValue ? dataArray[i][idProperty] : maxValue;
            }
            maxValue += 1;
            logger.debug('New max value ' + maxValue);
        }
        return maxValue;
    },
    /**
     * This function finds an element with a given id in an array
     * @param dataArray {object[]} Data
     * @param idProperty [String} Name of the property containing the ID value
     * @param idValue {Number} Value if the id property to be searched
     * @return {number} Position in the data array
     */
    findPositionById: function (dataArray, idProperty, idValue) {
        if (!checkLoopProperties(dataArray, idProperty)) {
            return;
        }
        for (var i = 0, len = dataArray.length; i < len; i += 1) {
            if (dataArray[i][idProperty] && dataArray[i][idProperty] === idValue) {
                logger.debug('Found item with id ' + idValue + ' at position ' + i);
                return i;
            }
        }
        logger.info('Found no item with id ' + idValue);
        return undefined;
    },
    /**
     * This function checks, if the given object is an isntanceof the given custructor.
     * If this is not the case, an error will be thrown
     * @param object
     * @param constructor
     */
    checkInstance: function(object, constructor) {
        if (!(object instanceof constructor)) {
            // logger.error('Object ' + object + ' not of type ', contructor);
            throw new Error('Illegal argument error');
        }
    }
}
