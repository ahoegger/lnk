/**
 * Created by Holger on 05.10.2014.
 */
var expect = require('chai').expect;

var path = require('path');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var crudDbFactory = require(app_constants.packagedModule('data', 'CrudDatabaseFactory.js'));
var TagClass = require(app_constants.packagedModule('entities', 'Tag.js'));

describe('Test CrudDatabaseFactory', function () {
    var tagsDatabase;
    var globalTagsDatabase = crudDbFactory.factory(TagClass.Tag, 'id');
    var tagRawData = ['one', 'two', 'three'];
    var singleTag;

    beforeEach(function () {
        tagsDatabase = crudDbFactory.factory(TagClass.Tag, 'id');
        singleTag = new TagClass.Tag(undefined, 'Hello tag');
    });
    describe('Test insert', function () {
        it('inserts a new entity', function () {
            singleTag = tagsDatabase.insert(singleTag);
            expect(singleTag.id).to.equal(0);
        });
        it('Throws error when inserting exiting element', function() {
            singleTag = tagsDatabase.insert(singleTag);
            expect(function() {tagsDatabase.insert(singleTag); }).to.throw(/Unique key constraint violated/);
        })
    });
    describe('Test selectById', function() {
        it('Finds item by ID', function() {
            var actual;
            singleTag = tagsDatabase.insert(singleTag);
            actual = tagsDatabase.selectById(singleTag.id);
            expect(actual).to.be.eql(singleTag);
        });
        it('Returns undefined, if tag is not found', function() {
            var actual = tagsDatabase.selectById(46587435);
            expect(actual).to.be.undefined;
        })
    });
    describe('Test filter function', function () {
        var adHocTag;
        var storedTags = [];
        for (var i = 0, len = tagRawData.length; i < len; i++) {
            adHocTag = new TagClass.Tag(undefined, tagRawData[i]);
            storedTags.push(globalTagsDatabase.insert(adHocTag));
        }
        it('inserted the tags properly', function () {
            var allData = globalTagsDatabase.select(function (element) {
                return true;
            });
            expect(allData.length).to.equal(storedTags.length);
            expect(allData).to.eql(storedTags);
        });
        it('Applies the filter properly at beginning', function () {
            var actual = globalTagsDatabase.select(function (element) {
                return element.tag === 'one';
            });
            expect(actual[0]).to.eql(storedTags[0]);
        });
        it('Applies the filter properly in between', function () {
            var actual = globalTagsDatabase.select(function (element) {
                return element.tag === 'two' || element.tag === 'three';
            });
            expect(actual[0]).to.eql(storedTags[1]);
            expect(actual[1]).to.eql(storedTags[2]);
        });

    });
    describe('Test update function', function () {
        var oneTag = new TagClass.Tag(undefined, 'Hello one');
        it('Updates entity', function () {
            var newTagName = 'This has been updated';
            var tagAfterInsert;
            var updatedTag;
            tagAfterInsert = tagsDatabase.insert(oneTag);
            expect(tagAfterInsert.id).not.to.be.undefined;
            tagAfterInsert.tag = newTagName;
            tagsDatabase.update(tagAfterInsert);
            updatedTag = tagsDatabase.selectById(oneTag.id);
            expect(updatedTag.tag).to.eql(newTagName);
        });
        it('Throws an exception, if element (that must have an ID) is not found for updates', function () {
            var tagAfterInsert;
            var dummyTag = new TagClass.Tag(undefined, 'Hello unupdatable');
            tagAfterInsert = tagsDatabase.insert(oneTag);
            expect(function() { tagsDatabase.update(dummyTag); }).to.throw(/Entity not found/);
        });
    });
    describe('Test remove function', function() {
        it('Inserts and removes item properly', function() {
            var tagAfterInsert;
            tagAfterInsert = tagsDatabase.insert(singleTag);
            expect(tagsDatabase.selectById(tagAfterInsert.id)).not.to.be.undefined;
            tagsDatabase.remove(tagAfterInsert);
            expect(tagsDatabase.selectById(tagAfterInsert.id)).to.be.undefined;
            // checking, nothing bad happens when removing missing item
            tagsDatabase.remove(tagAfterInsert);
            expect(tagsDatabase.selectById(tagAfterInsert.id)).to.be.undefined;
        })
    });
});