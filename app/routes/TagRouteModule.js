/**
 * This module provides the route functions fot the {@link module:backend/router/TagRouter}
 * @module backend/routes/TagRouterModule
 * @author Holger Heymanns
 * @since 27.11.2014

 */
var path = require('path');
var log4js = require('log4js');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));

var halsonFactory = require(app_constants.packagedModule('data', 'HalsonFactory.js'));
var logger = log4js.getLogger('routes.UserRouteModule');

module.exports = function(datastore) {
    this.datastore = datastore;


    return {
        getTags: function(req, res) {
            var resultSet;
            var halsonResultSet;
            resultSet = datastore.selectTags(function() {
                return true;
            });
            if(resultSet != undefined && resultSet.length === 0) {
                res.status(200).send();     // empty resultset
            }
            halsonResultSet =  halsonFactory.halsonifyArray('Tag', resultSet);
            res.status(200).json(halsonResultSet);
        },
        getTag: function(req, res) {
            var halsonResult;
            halsonResult = halsonFactory.halsonify('Tag', req.tag);
            logger.debug('Returning tag', halsonResult);
            return res.status(200).send(JSON.stringify(halsonResult));
        },
        getTagArticles: function(req, res) {
            var resultSet;
            var halsonResultSet;
            resultSet = datastore.selectArticlesForTag(
                req.tag.id,
                {
                    includeTags: true,
                    includeComments: false,
                    includeVoteCount: true,
                    includeUser: true,
                    voteUserId: req.user ? req.user.id : undefined
                });
            if(resultSet != undefined && resultSet.length === 0) {
                res.status(200).send();     // empty resultset
            }
            halsonResultSet =  halsonFactory.halsonifyArray('Article', resultSet);
            res.status(200).json(halsonResultSet);
        }
    }
};