/**
 * Created by Holger on 08.11.2014.
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
        getUser: function(req, res) {
            var halsonResult;
            req.paramhandler_user.password = null;   // remove password for response
            halsonResult = halsonFactory.halsonify('User', req.paramhandler_user);
            logger.debug('Returning user', halsonResult);
            return res.status(200).send(JSON.stringify(halsonResult));
        },
        postUser: function(req, res) {
            // TODO Refactor to use _handleUserUpdating
            var userObject = new UserClass.User();
            var halsonSingleUser;
            userObject.updateFromJsonObject(req.body);            // put posted content into user object
            userObject = datastore.insertUser(userObject);
            userObject.password = null;
            halsonSingleUser = halsonFactory.halsonify('User', userObject);
            return res.status(201).send(JSON.stringify(halsonSingleUser));
        },
        putUser: function(req, res) {
            // TODO Refactor to use _handleUserUpdating
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
        }
    }
};