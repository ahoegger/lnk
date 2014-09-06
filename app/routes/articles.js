/**
 * Created by holger on 05.09.2014.
 */
var express = require('express');
var datastore = require('../infrastructure/datastore');
var router = express.Router();
var path = require('path');     // node.js module für pfadhandling
// current path of node.js root = process.cwd()  //cwd() = current working directory
var rootPath = path.resolve(process.cwd());

// This is a controller!
/* GET product data */
router
    .get('/articles', function(req, res, next) {
        // json daten kann man verschieden direkt schicken:
        // res.send('respond with a basic data resource');      // literaler string, z.B. auch ein json String
        // res.json({foo: 'bar'});  // javascript object wird direkt convertiert
        var dataPath = path.join(rootPath, './app/data', 'articles.json');
        var doc = {name: 'holger',
                   roles: ['admin', 'user']};
        datastore.users.insert(doc, function(err, newDoc) {
            console.log('Error: ' + err);
            console.log('NewDoc:');
            console.dir(newDoc);
        });
        // TODO Implement database logic
        res.sendFile(dataPath);   // filereferenz
    })
    .post('/article', function(req, res, next) {
        console.log(req.body);
        // TODO Implement logic
        next();
    });

module.exports = router;
