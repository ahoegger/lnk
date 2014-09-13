/**
 * Created by holger on 05.09.2014.
 */
var Datastore = require('nedb');
var path = require('path');     // node.js module for handling paths
var db = {};   // object with all DBs
var dbRootPath = path.resolve(process.cwd(), './data');

/**
 * Constructor for basic CRUD operations for various datastores
 * @param datastore
 * @return {{insert: _insert, update: _update}}
 * @constructor
 */
var DAO = function(datastore) {
    var self = this;
    self.datastore = datastore;

    /**
     * This function inserts a new document
     * @param {Object} object Object to be inserted
     * @param {Function} errorCallback Callback function in case of error
     * @param {Function} successCallback Callback function in case of success
     * @private
     */
    var _insert = function (object, errorCallback, successCallback) {
        self.datastore.insert(object,
            function(err, newDoc) {
                if(err) {
                    console.log('Error' + err);
                    errorCallback(err);
                    return;
                }
                successCallback(newDoc)
            });
    };

    var _readId = function(id) {

    };

    var _readQuery = function(query, errorCallback, successCallback) {
        self.datastore.find(
            query,
            function(err, docs) {
                if (err) {
                    console.dir(err);
                    errorCallback(err);
                    return;
                }
                console.log('success query');
                console.dir(docs);
                successCallback(docs);
            }
        )
    };

    var _update = function (object) {

    };

    var _deleteId = function(id) {

    };

    var _deleteQuery = function(query) {

    };

    return {
        insert: _insert,
        selectWithId: _readId,
        select: _readQuery,
        update: _update
    }
};

// TODO JavaDoc
var TagsDAO = function(dao) {
    var self = this;
    self.dao = dao;

    var _selectArticleTags = function (filterFunction, errorCallback, successCallback) {
        self.dao.select(
            {
                // no query is the limit
            },
            function (err) {
                console.log('This is an error:');
                console.dir(err);
                errorCallback(err);
            },
            function (docs) {
                var tagSet = new Set();
                var tempTags;
                var docsLength = docs.length;
                var tagsLength;
                var i = 0;
                var j = 0;
                // TODO implement filter function
                for (; i < docsLength; i++) {
                    if (docs[i].tags) {
                        tempTags = docs[i].tags;
                        tagsLength = tempTags.length;
                        for (j = 0; j < tagsLength; j++) {
                            tagSet.add(tempTags[j]);
                        }
                    }
                }
                console.log('This is the set with the tags:');
                console.dir(tagSet);
                successCallback(tagSet);
            }
        );
    };

    return {
        selectTags: _selectArticleTags
    }
};

// Create and load the databases
db.articles = new Datastore(path.join(dbRootPath, 'articles'));
db.users = new Datastore(path.join(dbRootPath, 'users'));
db.articles.loadDatabase();
db.users.loadDatabase();

db.dao = {
    articles: new DAO(db.articles),
    tags: new TagsDAO(new DAO(db.articles)),    // TODO actually, do not create a second article DAO
    users: new DAO(db.users)
};
module.exports = db;