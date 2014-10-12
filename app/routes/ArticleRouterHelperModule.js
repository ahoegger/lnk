/**
 * Created by Holger on 12.10.2014.
 * This module contains various helper functions for the article router module
 */

var path = require('path');
var log4js = require('log4js');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var logger = log4js.getLogger('routes.ArticleRouteHelperModule');

var TagClass = require(app_constants.packagedModule('entities', 'Tag.js'));

module.exports = function() {
    return {
        /**
         * This function returns an array of Tag objects from the given JSON object as array
         * @param {Object} jsonObject JSON object, that contains a "tag" property
         * @return {Tag[]}
         */
        createTagsFromJsonBody: function(jsonObject) {
            var tagsSourceArray = jsonObject.tags;
            var tags = [];
            if (jsonObject.tags) {
                for (var i = 0, len = tagsSourceArray.length; i < len; i++) {
                    tags.push(new TagClass.Tag(null, tagsSourceArray[i]));
                }
            }
            return tags;
        }
    }
};
