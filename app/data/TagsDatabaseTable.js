/**
 * Created by Holger on 21.09.2014.
 */
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger('data.TagsDatabaseModule');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var tagEntityModule = require(app_constants.packagedModule('data', 'tag_entity'));
var CrudDatabaseFactory = require(app_constants.packagedModule('data', 'CrudDatabaseFactory'));

var TagsDb = CrudDatabaseFactory.factory(tagEntityModule.Tag, 'id');

module.exports = {
    TagsDb: TagsDb
};