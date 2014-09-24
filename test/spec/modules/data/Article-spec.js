/**
 * Created by Holger on 24.09.2014.
 */

var path = require('path');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var ArticleClass = require(app_constants.packagedModule('entities', 'Article.js'));

describe('Test Article Class', function() {
    var updatedTitle = 'JSON updated title';
    var updatedId = 155344;
    var simpleJsonObject = {
        title: updatedTitle
    };
    var simpleJsonString = JSON.stringify(simpleJsonObject);
    var completeJsonObject = {
        id: updatedId,
        title: updatedTitle,
        url: 'http://fkdjhksdj.ch',
        imageUrl: 'http://fkdjhksdj.ch/aaa.jpg',
        description: 'This is a simple dummy and long description',
        submittedBy: 'holger',
        submittedOn: new Date(2013,2,1,1,10),
        tags: []
    };
    var completeJsonString = JSON.stringify(completeJsonObject);
    var originalTitle = 'This is my super cool title';
    var originalId = 123;
    var article;

    beforeEach(function () {
        article = new ArticleClass.Article(originalId, originalTitle);
    });

    describe('Test the constructor function', function(){
        it('constructs new article instance', function() {
            expect(article instanceof ArticleClass.Article).toBe(true);
            expect(article instanceof Date).toBe(false);
        });
        it('constructs independent classes', function() {
            var article1 = new ArticleClass.Article(originalId, originalTitle);
            var article2 = new ArticleClass.Article(updatedId, updatedTitle);
            expect(article1.id).not.toBe(article2.id);
            expect(article1.title).not.toBe(article2.title);
        });
        it('updates all properties from a JSON string', function() {
            article.updateFromJsonString(completeJsonString);
            expect(article.id).toBe(completeJsonObject.id);
            expect(article.title).toBe(completeJsonObject.title);
            expect(article.url).toBe(completeJsonObject.url);
            expect(article.imageUrl).toBe(completeJsonObject.imageUrl);
            expect(article.description).toBe(completeJsonObject.description);
            expect(article.submittedBy).toBe(completeJsonObject.submittedBy);
            expect(article.submittedOn.value).toBe(completeJsonObject.submittedOn.value);
            expect(article.tags).toEqual(completeJsonObject.tags);
        })
    });
});