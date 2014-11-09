var path = require('path');
var log4js = require('log4js');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var helper = require(app_constants.packagedModule('routes', 'ArticleRouterHelperModule.js'))(datastore);
var jwt = require('express-jwt');
var UserClass = require(app_constants.packagedModule('entities', 'User.js'));
var logger = log4js.getLogger('routes.UserAuthenticationModule');
var secret = {
    secretToken: 'tjhdfkjaghfdkjsaghkjsdfabgdfg'
};

module.exports = function(datastore) {

    return {
        login: function(req, res) {
            var user;
            var token;
            var userName = req.body.username || '';
            var password = req.body.password || '';
            var userQuery = function(entity) {
                return entity.userName = userName;
            };
            var resultSet;

            if (userName == '' || password == '') {
                return res.send(401);
            }

            resultSet = datastore.selectUser(userQuery);
            if (resultSet-length !== 1) {
                return res.send(401);
            }

            user = resultSet[0];
            if (user.isAuthenticated(password, true)) {
                // TODO verify if logic really works
                token = jwt.sign(user, secret.secretToken, { expiresInMinutes: 60 });
                return res.json({token:token});

            }

        }
    };
};