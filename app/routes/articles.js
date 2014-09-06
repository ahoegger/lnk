/**
 * Created by holger on 05.09.2014.
 */
var express = require('express');
var articleModule = require('../data/article');
var datastore = require('../infrastructure/datastore');
var router = express.Router();
var path = require('path');     // node.js module für pfadhandling
// current path of node.js root = process.cwd()  //cwd() = current working directory
var rootPath = path.resolve(process.cwd());

function parseBodyToArticle(json) {
    return articleModule.fromJson(json);
}

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
        console.dir(parseBodyToArticle(req.body));
        datastore.articles.insert((parseBodyToArticle(req.body)),
            function(err, newDoc) {
               if(err) {
                   console.log('Error' + err);
                   res.status(503).send('Unable to store data')
                   next();
               }
               res.status(201).send(JSON.stringify(newDoc));
            });
        next();
    });

module.exports = router;
