/**
 * This module defines the functionality used in the {@link module:backend/routes/UserRouter}
 * @module backend/routes/UserRouterModule
 * @author Holger Heymanns
 * @since 08.11.2014
 */
var path = require('path');
var log4js = require('log4js');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));

var UserClass = require(app_constants.packagedModule('entities', 'User.js'));

var halsonFactory = require(app_constants.packagedModule('data', 'HalsonFactory.js'));
var logger = log4js.getLogger('routes.UserRouteModule');

module.exports = function(datastore) {
    this.datastore = datastore;

    function _handleUserUpdating(requestUserObject, databaseAction) {
        var userObject = new UserClass.User();
        var halsonSingleUser;
        userObject.updateFromJsonObject(requestUserObject);            // put putted content into user object
        userObject = databaseAction(userObject);
        userObject.password = null;
        halsonSingleUser = halsonFactory.halsonify('User', userObject);
        return halsonSingleUser;
    }

    return {
        /**
         * This function retrieves a collection of users based on the search criteria
         * @param req
         * @param res
         */
        getUsers: function(req, res) {
            var resultSet;
            var queryUserName = (req.query != undefined && req.query.username != undefined) ? req.query.username : undefined;
            var halsonResult;
            resultSet = datastore.selectUser(function(entity) {
                return entity.userName === queryUserName;
            });
            if(resultSet === undefined || resultSet.length === 0) {
                return res.status(200).send();      // Status =200 with an empty resultset
            }
            halsonResult = halsonFactory.halsonifyArray('User', resultSet);
            return res.status(200).json(halsonResult);
        },
        getUser: function(req, res) {
            var halsonResult;
            req.paramhandler_user.password = null;   // remove password for response
            halsonResult = halsonFactory.halsonify('User', req.paramhandler_user);
            logger.debug('Returning user', halsonResult);
            return res.status(200).send(JSON.stringify(halsonResult));
        },
        // create new user
        postUser: function(req, res) {
            var userObject = new UserClass.User();
            var halsonSingleUser;
            // first check, if the user name is already registered
            if (datastore.selectUser(function(entity) {
                return entity.userName === req.body.userName;
            }).length > 0) {
                return res.status(409).send('Username ' + req.body.userName + ' already registered.');
            }
            userObject.updateFromJsonObject(req.body);            // put posted content into user object
            userObject.active = true;
            userObject = datastore.insertUser(userObject);
            userObject.password = null;
            halsonSingleUser = halsonFactory.halsonify('User', userObject);
            return res.status(201).send(JSON.stringify(halsonSingleUser));
        },
        putUser: function(req, res) {
            var userObject = new UserClass.User();
            var halsonSingleUser;
            userObject.updateFromJsonObject(req.body);            // put putted content into user object
            userObject = datastore.updateUser(userObject);
            userObject.password = null;
            halsonSingleUser = halsonFactory.halsonify('User', userObject);
            return res.status(200).send(JSON.stringify(halsonSingleUser));
        },
        deleteUser: function(req, res) {
            var userObject = _handleUserUpdating(req.paramhandler_user, function(user) {
                user.active = false;
                user = datastore.updateUser(user);
                return user;
            });
            return res.status(204).send();      // 204, as no entity is being returned
        },
        getUserArticles: function(req, res) {
            var resultSet;
            var halsonResultSet;
            var query = function(entity) {
                return entity.submittedBy === req.paramhandler_user.userName;
            };
            resultSet = datastore.selectArticles(query, {
                includeTags: true,
                includeComments: false,
                includeVoteCount: true,
                includeUser: true,
                voteUserId: req.user ? req.user.id : undefined
            });
            halsonResultSet = halsonFactory.halsonifyArray('Article', resultSet);
            return res.status(200).send(JSON.stringify(halsonResultSet));
        }
    }
};