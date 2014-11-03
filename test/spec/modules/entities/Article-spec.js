/**
 * Created by Holger on 29.10.2014.
 */
var expect = require('chai').expect;

var path = require('path');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var ArticleClass = require(app_constants.packagedModule('entities', 'Article.js'));

describe('Test article entity', function () {
    describe('Test JSON updates', function() {
        var newArticleObject = {
            "id": 1,
            "title": "Jersey - RESTful Web Services in Java",
            "description": "Developing RESTful blah",
            "url": "https://jersey.java.net/",
            "imageUrl": "https://jersey.java.net/images/jersey_logo.png",
            "submittedBy": "hhe",
            "submittedOn": "2014-06-14T10:12:26Z",
            "votes": 0,
            "tags": ["Java", "REST", "JAX-RS"],
            "numberOfComments": 2
        };
        function assertObject(actual, expected) {
            expect(actual.id).to.be.equal(expected.id);
            expect(actual.title).to.be.equal(expected.title);
            expect(actual.url).to.be.equal(expected.url);
            expect(actual.imageUrl).to.be.equal(expected.imageUrl);
            expect(actual.description).to.be.equal(expected.description);
            expect(actual.submittedBy).to.be.equal(expected.submittedBy);
            expect(actual.submittedOn).to.be.equal(expected.submittedOn);
            expect(actual.tags).to.be.eql(expected.tags);
        };

        function assertObjectUnequal(actual, expected) {
            expect(actual.id).not.to.be.equal(expected.id);
            expect(actual.title).not.to.be.equal(expected.title);
            expect(actual.url).not.to.be.equal(expected.url);
            expect(actual.imageUrl).not.to.be.equal(expected.imageUrl);
            expect(actual.description).not.to.be.equal(expected.description);
            expect(actual.submittedBy).not.to.be.equal(expected.submittedBy);
            expect(actual.submittedOn).not.to.be.equal(expected.submittedOn);
            expect(actual.tags).not.to.be.eql(expected.tags);
        };

        it('Updates all values from JSON', function() {
            // Article(id, title, url, imageUrl, description, submittedBy, submittedOn, tags)
            var article = new ArticleClass.Article(123, 'Article title', 'http://cool.ch', 'http://cool.ch/img.png', 'Unimportant', 'aho', '2014-11-02T14:25:13', ['one', 'tow']);

            var newArticleJson = JSON.stringify(newArticleObject);
            article.updateFromJsonString(newArticleJson);
            assertObject(article, newArticleObject);
        });
        it('Does not update not provided values', function() {
            var untouchedArticle = new ArticleClass.Article(123, 'Article title', 'http://cool.ch', 'http://cool.ch/img.png', 'Unimportant', 'aho', '2014-11-02T14:25:13', ['one', 'tow']);
            var article = new ArticleClass.Article(123, 'Article title', 'http://cool.ch', 'http://cool.ch/img.png', 'Unimportant', 'aho', '2014-11-02T14:25:13', ['one', 'tow']);
            article.updateFromJsonObject({});  // no property that will be used
            assertObject(article, untouchedArticle);
        });
        it('Clones article correctly', function() {
            var article = new ArticleClass.Article(123, 'Article title', 'http://cool.ch', 'http://cool.ch/img.png', 'Unimportant', 'aho', '2014-11-02T14:25:13', ['one', 'tow']);
            var clonedArticle = article.clone();
            clonedArticle.updateFromJsonObject(newArticleObject);
            assertObject(clonedArticle, newArticleObject);
            assertObjectUnequal(clonedArticle, article);
        });
    })
});