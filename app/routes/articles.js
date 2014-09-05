/**
 * Created by holger on 05.09.2014.
 */
var express = require('express');
var router = express.Router();
var path = require('path');     // node.js module für pfadhandling
// Pfadhandling
// aktueller pfad des node.js roots = process.cwd()  //cwd() = current working directory
var rootPath = path.resolve(process.cwd());

// This is a controller!
/* GET product data */
router
    .get('/articles', function(req, res) {
        // json daten kann man verschieden direkt schicken:
        // res.send('respond with a basic data resource');      // literaler string, z.B. auch ein json String
        // res.json({foo: 'bar'});  // javascript object wird direkt convertiert
        var dataPath = path.join(rootPath, './app/data', 'articles.json');
        res.sendFile(dataPath);   // filereferenz
    })
;

module.exports = router;
