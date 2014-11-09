/**
 * Created by Holger on 08.11.2014.
 * This module handles the user param :userId
 */

var path = require('path');
var log4js = require('log4js');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));

var logger = log4js.getLogger('routes.ArticleParamModule');

function _paramFunction(req, res, next, userId) {
    var resultSet;
    var singleUser;
    var queryFunction = function (entity) {
        return entity.id === parseInt(userId) && entity.active === true;
    };
    resultSet = this.datastore.selectUser(queryFunction);
    if (!resultSet || resultSet.length === 0) {
        // not found
        res.status(404);
        logger.info('User with id '+ userId + " in path parameter not found");
        return next(new Error('User not found'));
    }
    if (resultSet.length > 1) {
        res.status(500);
        logger.warn('More than one user with id '+ userId + " in path parameter found");
        return next(new Error('Internal server error'));
    }
    singleUser = resultSet[0];
    req.user = singleUser;
    logger.debug('Added following user to request: ' + req.user);
    next();
}

module.exports = function(datastore) {
    this.datastore = datastore;

    /**
     * The return value is an array of objects each with a paramId property and a paramFunction
     */
    return [
        {
            paramId: ":userId",
            paramFunction: _paramFunction
        }
    ]
};