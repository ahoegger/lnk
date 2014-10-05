/**
 * Created by Holger on 21.09.2014.
 * This module implements the mapping functionality between an article and it's tags
 */
var log4js = require('log4js');
var logger = log4js.getLogger('data.TagArticleMapDatabaseModule');

/**
 * This simple mapper class contains two ids
 * @param id1
 * @param id2
 * @constructor
 */
function IdMapper(id1, id2) {
    this.id1 = id1;
    this.id2 = id2;
}

/**
 * This function return true, if the current object's id properties are equal to those of the other object
 * @param {IdMapper} other
 * @return {boolean}
 */
IdMapper.prototype.matches = function(other) {
    return other instanceof IdMapper && this.id1 === other.id1 && this.id2 === other.id2;
};

/**
 * This function returns true, if in the given map is a IdMapper that matches
 * @param map
 * @param idMapper
 * @return {boolean}
 */
function isInMap(map, idMapper) {
    for (var i = 0, len = map.length; i < len; i++) {
        if (idMapper.matches()) {
            return true;
        }
    }
    return false;
}
var map = [];

function _insertEntry(tag, article) {
    var newIdMap = IdMapper(tag.id, article.id);
    if (!isInMap(map, newIdMap)) {
        map.push(newIdMap);
    }
}

module.exports = {
    addTagForArticle: function(tag, article) {
        _insertEntry(tag, article);
    },
    getTagsForArticle: function(article) {
        // TODO Implement
    }

};