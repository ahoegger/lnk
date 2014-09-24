/**
 * Created by Holger on 21.09.2014.
 */
var path = require('path');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var ArticleClass = require(app_constants.packagedModule('entities', 'Article.js'));
var moduleUnderTest = require(app_constants.packagedModule('data', 'ArticlesDatabaseModule'));

describe('Test ArticlesDatabaseModule', function() {
    var article;

    beforeEach(function () {
        article = new ArticleClass.Article(
            null,
            'Article title',
            'http://thingy.com',
            null,
            'dummy description',
            'holger',
            new Date(),
            ['hello', 'world']
        );
    });
    describe('Test getNewId', function () {
        it('inserts a new article', function () {
            newId = moduleUnderTest.insertArticle(article).id;
            expect(newId).not.toBe(null);
        });
        it('finds a newly inserted article', function() {
            newId = moduleUnderTest.insertArticle(article).id;
            expect(moduleUnderTest.selectArticle(newId)).not.toBe(null);
        })
    });
    describe('Test cloning object when inserting', function () {
        it('clones inserted article', function () {
            var returnedArticle;
            returnedArticle = moduleUnderTest.insertArticle(article);
            expect(returnedArticle.id).not.toBe(null);
            expect(returnedArticle.title).toBe(article.title);
            expect(returnedArticle.url).toBe(article.url);
            returnedArticle.title = 'Cloned updated';
            article.url = 'http://original.org';
            expect(returnedArticle.url).not.toBe(article.url);
            expect(returnedArticle.title).not.toBe(article.title);
        });
    });
});