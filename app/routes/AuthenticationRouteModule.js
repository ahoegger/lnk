var path = require('path');
var log4js = require('log4js');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var helper = require(app_constants.packagedModule('routes', 'ArticleRouterHelperModule.js'))(datastore);
var jwt = require('jsonwebtoken');
var UserClass = require(app_constants.packagedModule('entities', 'User.js'));
var logger = log4js.getLogger('routes.UserAuthenticationModule');
var secret = {
    secretToken: 'ABC'
};

module.exports = function(datastore) {

    return {
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
                return res.json({token:token});
            } else {
                return res.send(401);
            }

        }
    };
};