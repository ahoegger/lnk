/**
 * This module proovides functionality for user authentication
 * @module backend/routes/AuthenticationRouteModule
 * @type {exports}
 */
var path = require('path');
var log4js = require('log4js');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var helper;
var jwt = require('jsonwebtoken');
var logger = log4js.getLogger('routes.UserAuthenticationModule');
var secret = {
    secretToken: 'ABC'
};

module.exports = function(datastore) {

    require(app_constants.packagedModule('routes', 'ArticleRouterHelperModule.js'))(datastore);

    return {
        /**
         * This function authenticates a user based on the credentials provided
         * @param {Request} req Body must containe userName and unencrypted password
         * @param {Response} res
         * @return {*} Sends the token and the plain suer objects as a json response
         */
        authenticate: function(req, res) {
            var user;
            var token;
            var userName = req.body.userName || '';
            var password = req.body.password || '';
            var userQuery = function(entity) {
                return entity.userName === userName && entity.active != false;
            };
            var resultSet;

            if (userName == '' || password == '') {
                return res.send(401);
            }

            resultSet = datastore.selectUser(userQuery);
            if (resultSet.length !== 1) {
                return res.send(401);
            }

            user = resultSet[0];
            if (user.isAuthenticated(password, false)) {
                // TODO verify if logic really works
                // jwt({ secret: secret.secretToken, userProperty: 'auth'});
                token = jwt.sign(user, secret.secretToken, { expiresInMinutes: 60 });
                return res.json({token:token, user: user});
            } else {
                return res.send(401);
            }

        }
    };
};