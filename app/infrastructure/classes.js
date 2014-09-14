/**
 * Created by Holger on 14.09.2014.
 * This module exports functionality to mimic classes and providing mixins and stiff
 */
'use strict';

var classes = {};

var lnkErrorConstructor = function LnkError(number, message) {
    this.number = number;
    this.message = message;
    this.stack = Error().stack;

    LnkError.prototype.getNumber = function() {
        return this.number;
    };

    LnkError.prototype.getMessage = function() {
        return this.message;
    };

    LnkError.prototype = Object.create(Error.prototype);
    LnkError.prototype.name = "LnkError";
};


/**
 * Creates an object to mimic a "string set"
 * @constructor
 */
var setConstructor = function StringSet() {
    this.holder = Object.create(null);

    var elementIsOk = function(element) {
        return (element && (typeof element == 'string' || element instanceof String) && element.length > 0);
    };

    var handleElementNok = function() {
        // throw new Error('Missing required element name');
        throw new lnkErrorConstructor(0, 'Missing required element name');
    };

    // public and prototype functions

    /**
     * Adds an element to the set
     * @param {String} element Element to be added
     */
    StringSet.prototype.add = function(element) {
        if (elementIsOk(element)) {
            this.holder[element] = null;
        } else {
            handleElementNok();
        }
    };

    /**
     * Clears all elements from the StringSet
     */
    StringSet.prototype.clear = function() {
        this.holder = Object.create(null);
    };

    /**
     * Return true, if the given element is in the StringSet
     * @param {String} element
     * @return {boolean} true, if the element is in the set
     */
    StringSet.prototype.contains = function(element) {
        if (elementIsOk(element)) {
            return this.holder[element] !== undefined;
        } else {
            handleElementNok();
        }
    };

    /**
     * Removes the given element
     * @param {String} element
     */
    StringSet.prototype.remove = function(element) {
        if (elementIsOk(element)) {
            delete this.holder[element];
        } else {
            handleElementNok();
        }
    };

    /**
     * Transforms the Set into a "simple" array
     */
    StringSet.prototype.toArray = function() {
        var tags = [];
        for (var key in this.holder) {
            tags.push(key);
        }
    }
};

classes.StringSet = setConstructor;
classes.LnkError = lnkErrorConstructor;

module.exports = classes;