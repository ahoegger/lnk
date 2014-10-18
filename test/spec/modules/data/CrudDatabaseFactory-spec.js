/**
 * Created by Holger on 05.10.2014.
 */
var expect = require('chai').expect;

var path = require('path');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var crudDbFactory = require(app_constants.packagedModule('data', 'CrudDatabaseFactory.js'));
var TagClass = require(app_constants.packagedModule('entities', 'Tag.js'));

describe('Test CrudDatabaseFactory', function() {
    var tagsDatabase;
    var globalTagsDatabase = crudDbFactory.factory(TagClass.Tag, 'id');
    var singleTag = new TagClass.Tag(undefined, 'Hello tag');
    var tagRawData = ['one', 'two', 'three'];

    beforeEach(function () {
        tagsDatabase = crudDbFactory.factory(TagClass.Tag, 'id');
    });
    describe('Test insert', function () {
        it('inserts a new entity', function () {
            singleTag = tagsDatabase.insert(singleTag);
            expect(singleTag.id).to.equal(0);
        });
    });
    describe('Test filter function', function() {
        var adHocTag;
        var storedTags = [];
        for(var i = 0, len = tagRawData.length; i < len; i++) {
            adHocTag = new TagClass.Tag(undefined, tagRawData[i]);
            storedTags.push(globalTagsDatabase.insert(adHocTag));
        }
        it('inserted the tags properly', function() {
           var allData = globalTagsDatabase.select(function(element){
               return true;
           });
           expect(allData.length).to.equal(storedTags.length);
           expect(allData).to.eql(storedTags);
        });
        it('Applies the filter properly at beginning', function() {
            var actual = globalTagsDatabase.select(function(element){
                return element.tag === 'one';
            });
            expect(actual[0]).to.eql(storedTags[0]);
        });
        it('Applies the filter properly in between', function() {
            var actual = globalTagsDatabase.select(function(element){
                return element.tag === 'two' || element.tag === 'three';
            });
            expect(actual[0]).to.eql(storedTags[1]);
            expect(actual[1]).to.eql(storedTags[2]);
        });

    });
});