/**
 * This module implements factory methods to build halson entities based on given entities. Halson is a defined format how to build HATEOS entities.
 * @module backend/data/HalsonFactory
 * @author Holger Heymanns
 * @since 07.10.2014.
 */

var log4js = require('log4js');
var logger = log4js.getLogger('data.HalsonFactory');
var halson = require('halson');

var halsonFunctionObject = {};

/**
 * This function transforms a given entity according to the rules stored with the corresponding of the entityKey
 * @param {String} entityKey Key of the given entity
 * @param {Object} entityObject Object to be transformed
 * @throws {Error} Illegal argument error if the entityKey is not registered
 * @private
 */
function _halsonify(entityKey, entityObject) {
    if(!halsonFunctionObject[entityKey]) {
        throw new Error('Illegal argument error');
    }
    return (halsonFunctionObject[entityKey])(entityObject);
}

/**
 * This function transforms an array of the given entities
 * @param {String} entityKey
 * @param {Object[]} entityArray Array of the entity objects
 * @return {Object[]}
 * @private
 */
function _halsonifyArray(entityKey, entityArray) {
    var results = [];
    var singleResource;
    for (var i = 0, len = entityArray.length; i< len; i++) {
        singleResource = _halsonify(entityKey, entityArray[i]);
        results.push(singleResource);
    }
    return results;
}

/**
 * This function registers a new halsonFunction with the given key for the entity
 * @param {String} entityKey
 * @param {Function} halsonFunction The function applied when transforming the entity objevct into the halso entity object
 * @private
 */
function _register(entityKey, halsonFunction) {
    halsonFunctionObject[entityKey] = halsonFunction;
    logger.debug('Registered halsonFunction for entity ' + entityKey)
}

// Function to transform an article into a halson article
/**
 * Register function to halsonify an Article class
 */
_register('Article', function articleHalsonify(entity) {
    var halsonTags;
    var halsonComments;
    var halsonVoteContainer;
    var halsonUser;
    var baseString = '/api/article/' + entity.id;
    var resource = new halson(entity);
    resource.addLink('self', baseString);
    // if there are tags present, move them into halson embedded tags,
    if (entity.tags) {
        halsonTags = _halsonifyArray('Tag', entity.tags);
        resource.addEmbed('tags', halsonTags);
        delete resource.tags;
    }
    // if there are comments present, move them into halson embedded tags,
    if (entity.comments) {
        halsonComments = _halsonifyArray('Comment', entity.comments);
        resource.addEmbed('comments', halsonComments);
        delete resource.comments;
    }
    if (entity.votes) {
        halsonVoteContainer = _halsonify('VoteContainer', entity.votes);
        resource.addEmbed('votes', halsonVoteContainer);
        delete entity.votes;
    }
    if (entity.user != undefined) {
        halsonUser = _halsonify('User', entity.user);
        resource.addEmbed('user', halsonUser);
        delete resource.submittedBy;
        delete resource.user;
    }
    resource.addLink('tags', baseString + '/tags');
    resource.addLink('comments', baseString + '/comments');
    resource.addLink('user', baseString + '/user/' + entity.submittedBy);
    return resource;
});

/**
 * Register function to transform a tag into a halson tag
 */
_register('Tag', function tagHalsonify(entity) {
    var baseString = '/api/tag/' + entity.id;
    var resource = new halson(entity);
    resource.addLink('self', baseString);
    resource.addLink('articles', baseString + '/articles');
    return resource;
});

/**
 * Register function to transform a {@link User} into a halson user
 */
_register('User', function userHalsonify(entity) {
    var baseString = '/api/user/' + entity.id;
    var resource = new halson(entity);
    resource.addLink('self', baseString);
    resource.addLink('articles', baseString + '/articles');
    return resource;
});

// Register function to transform a comment into a halson comment
_register('Comment', function commentHalsonify(entity) {
    var halsonUser;
    var baseString = '/api/article/' + entity.articleId + '/comment/' + entity.id;
    var resource = new halson(entity);
    resource.addLink('self', baseString);
    resource.addLink('user', baseString + '/user/' + entity.submittedBy);
    if (entity.user != undefined) {
        halsonUser = _halsonify('User', entity.user);
        resource.addEmbed('user', halsonUser);
        delete resource.submittedBy;
        delete resource.user;
    }
    return resource;
});

// Register function to transform a VoteContainer into a halson VoteContainer
_register('VoteContainer', function voteContainerHalsonify(entity) {
    var baseString = '/api/article/' + entity.articleId;
    var resource = new halson(entity);
    if (entity.userVote == undefined || entity.userVote < 1) {
        resource.addLink('voteUp', baseString + '/voteUp');
    }
    if (entity.userVote == undefined || entity.userVote > -1) {
        resource.addLink('voteDown', baseString + '/voteDown');
    }
    return resource;
});

// --------------------
module.exports = {
    halsonify: function(entityKey, entityObject) {
        return _halsonify(entityKey, entityObject);
    },
    halsonifyArray: function(entity, entityObject) {
        return _halsonifyArray(entity, entityObject);
    }
};