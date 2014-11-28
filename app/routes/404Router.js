/**
 * This module defines the routes for not defined routes. I.e. it will yield a 404
 * @module backend/routes/404Router
 * @author Holger Heymanns
 * @since 25.06.2014
 */
var express = require('express');
var path = require('path');
var log4js = require('log4js');
var url = require('url');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));

var router = express.Router();

var logger = log4js.getLogger('routes.404Router');

router
    .all('*', function(req, res) {
        logger.info('Returning 404 after request');
        res.redirect('/404.html');
    })
;

module.exports = router;
