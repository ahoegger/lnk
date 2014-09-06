/**
 * Created by holger on 05.09.2014.
 */
var Datastore = require('nedb');
var path = require('path');     // node.js module for handling paths

var db = {};   // object with all DBs
var dbRootPath = path.resolve(process.cwd(), './data');

db.articles = new Datastore(path.join(dbRootPath, 'articles'));
db.users = new Datastore(path.join(dbRootPath, 'users'));
db.articles.loadDatabase();
db.users.loadDatabase();

module.exports = db;