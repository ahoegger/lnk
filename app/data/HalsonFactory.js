/**
 * Created by Holger on 07.10.2014.
 * This module implements factory methods to build halso entities based on given entitites
 */

var log4js = require('log4js');
var logger = log4js.getLogger('data.HalsonFactory');
var halson = require('halson');

var halsonFunctionObject = {};

/**
 * This function transforms a given entity according to the rules stored with the corresponding of the entityKey
 * @param {String} entityKey
 * @param entityObject
 * @private
 */
function _halsonify(entityKey, entityObject) {
    if(!halsonFunctionObject[entityKey]) {
        throw new Error('Illegal argument error');
    }
    return (halsonFunctionObject[entityKey])(entityObject);

}

/**
 * This function registers a new halsonFunction with the given key for the entity
 * @param {String} entityKey
 * @param halsonFunction
 * @private
 */
function _register(entityKey, halsonFunction) {
    halsonFunctionObject[entityKey] = halsonFunction;
    logger.debug('Registered halsonFunction for entity ' + entityKey)
}

// Function to transform an article into a halson article
_register('Article', function articleHalsonify(entity) {
    var baseString = '/api/article/' + entity.id;
    var resource = new halson(entity);
    resource.addLink('self', baseString);
    resource.addLink('tags', baseString + '/tags');
    resource.addLink('comments', baseString + '/comments');
    resource.addLink('user', baseString + '/user/' + entity.submittedBy);
    resource.addLink('voteUp', baseString + '/voteUp');
    resource.addLink('voteDown', baseString + '/voteDown');
    return resource;
});

// Register function to transform a tag into a halson tag
_register('Tag', function tagHalsonify(entity) {
    var baseString = '/api/tag/' + entity.id;
    var resource = new halson(entity);
    resource.addLink('self', baseString);
    resource.addLink('articles', baseString + '/articles');
    return resource;
});

// Register function to transform a user into a halson user
_register('User', function userHalsonify(entity) {
    var baseString = '/api/user/' + entity.id;
    var resource = new halson(entity);
    resource.addLink('self', baseString);
    resource.addLink('articles', baseString + '/articles');
    return resource;
});

// Register function to transform a comment into a halson comment
_register('Comment', function commentHalsonify(entity) {
    var baseString = '/api/comment/' + entity.id;
    var resource = new halson(entity);
    resource.addLink('self', baseString);
    resource.addLink('user', baseString + '/user/' + entity.submittedBy);
    return resource;
});


module.exports = {
    halsonify: function(entityKey, entityObject) {
        return _halsonify(entityKey, entityObject);
    },
    halsonifyArray: function(entityKey, entityArray) {
        var results = [];
        var singleResource;
        for (var i = 0, len = entityArray.length; i< len; i++) {
            singleResource = _halsonify(entityKey, entityArray[i]);
            results.push(singleResource);
        }
        return results;
    }
};