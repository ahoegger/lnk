/**
 * This module provides functionality for user authentication used in the {@link module:backend/routes/AuthenticationRouter}
 * @module backend/routes/AuthenticationRouteModule
 * @author Holger Heymanns
 * @since 12.10.2014
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
                return res.status(401).send('Missing user name or password. Not authorized.');
            }

            resultSet = datastore.selectUser(userQuery);
            if (resultSet.length !== 1) {
                return res.status(401).send('Login failed!');
            }

            user = resultSet[0];
            if (user.isAuthenticated(password, false)) {
                token = jwt.sign(user, secret.secretToken, { expiresInMinutes: 60 });
                return res.status(200).json({token:token, user: user});
            } else {
                return res.status(401).send('Authentication required!');
            }

        }
    };
};