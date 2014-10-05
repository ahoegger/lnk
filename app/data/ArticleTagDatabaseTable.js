/**
 * Created by Holger on 05.10.2014.
 */
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger('data.TagsDatabaseModule');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var ArticleTagClass = require(app_constants.packagedModule('entities', 'ArticleTag.js'));
var CrudDatabaseFactory = require(app_constants.packagedModule('data', 'CrudDatabaseFactory'));

var ArticleTagTable = CrudDatabaseFactory.factory(ArticleTagClass.ArticleTag, 'id');

module.exports = {
    ArticleTagTable: ArticleTagTable
};