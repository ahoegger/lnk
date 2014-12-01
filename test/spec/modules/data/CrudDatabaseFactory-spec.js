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
    var globalTagsDatabase = crudDbFactory.factory('TEST_TAG', TagClass.Tag, 'id', undefined, undefined, {persist: false});
    var tagRawData = ['one', 'two', 'three'];
    var singleTag;

    beforeEach(function () {
        tagsDatabase = crudDbFactory.factory('TEST_TAG_2', TagClass.Tag, 'id', undefined, undefined, {persist: false});
        singleTag = new TagClass.Tag(undefined, 'Hello tag');
    });
    describe('Test insert', function () {
        it('inserts a new entity', function () {
            singleTag = tagsDatabase.insert(singleTag);
            expect(singleTag.id).to.equal(0);
        });
        it('Throws error when inserting exiting element', function () {
            singleTag = tagsDatabase.insert(singleTag);
            expect(function () {
                tagsDatabase.insert(singleTag);
            }).to.throw(/Unique key constraint violated/);
        })
    });
    describe('Test selectById', function () {
        it('Finds item by ID', function () {
            var actual;
            singleTag = tagsDatabase.insert(singleTag);
            actual = tagsDatabase.selectById(singleTag.id);
            expect(actual).to.be.eql(singleTag);
        });
        it('Returns undefined, if tag is not found', function () {
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
            updatedTag = tagsDatabase.selectById(tagAfterInsert.id);
            expect(updatedTag.tag).to.eql(newTagName);
        });
        it('Throws an exception, if element (that must have an ID) is not found for updates', function () {
            var tagAfterInsert;
            var dummyTag = new TagClass.Tag(undefined, 'Hello unupdatable');
            tagsDatabase.insert(oneTag);
            expect(function () {
                tagsDatabase.update(dummyTag);
            }).to.throw(/Entity not found/);
        });
    });
    describe('Test remove function', function () {
        it('Inserts and removes item properly', function () {
            var tagAfterInsert;
            tagAfterInsert = tagsDatabase.insert(singleTag);
            expect(tagsDatabase.selectById(tagAfterInsert.id)).not.to.be.undefined;
            tagsDatabase.remove(tagAfterInsert);
            expect(tagsDatabase.selectById(tagAfterInsert.id)).to.be.undefined;
            // checking, nothing bad happens when removing missing item
            tagsDatabase.remove(tagAfterInsert);
            expect(tagsDatabase.selectById(tagAfterInsert.id)).to.be.undefined;
        });
    });
    describe('Test unique hash', function () {
        var uniquedDatabase;
        var dummyTag1;

        beforeEach(function () {
            uniquedDatabase = crudDbFactory.factory('TEST_TAG_UNIQUE', TagClass.Tag, 'id', ['tag'], ['tag'], {persist: false});
            dummyTag1 = new TagClass.Tag(null, 'Dummy1');
        });

        it('Allows insert of single tag', function () {
            var dummy1afterUpdate = uniquedDatabase.insert(dummyTag1);
        });
        it('Throws unique constraint violation when inserting same tag again', function () {
            var dummy1afterUpdate = uniquedDatabase.insert(dummyTag1);
            expect(function () {
                uniquedDatabase.insert(dummyTag1);
            }).to.throw();
        });
        it('Does not throw unique constraint when inserting removed tag a second time', function () {
            var dummy1afterUpdate = uniquedDatabase.insert(dummyTag1);
            expect(function () {
                uniquedDatabase.insert(dummyTag1);
            }).to.throw();
            uniquedDatabase.remove(dummy1afterUpdate);
            var dummy1afterUpdate = uniquedDatabase.insert(dummyTag1);
        });
        it('Does handle updates properly', function() {
            var dummy1afterUpdate = uniquedDatabase.insert(dummyTag1);
            dummy1afterUpdate.tag = 'updated the stuff';
            dummy1afterUpdate = uniquedDatabase.update(dummy1afterUpdate);
            dummyTag1.id = null;
            uniquedDatabase.insert(dummyTag1);      // must not throw, as the previous insert has been renamed and has a different hash
        });
    });
    describe('Test not null properties', function() {
        var notNullDatabase;
        var dummyTag;
        var dummyTagWithNullProperty;
        beforeEach(function() {
           notNullDatabase = crudDbFactory.factory('TEST_TAG_NOT_NULL', TagClass.Tag, 'id', ['tag'], undefined, {persist: false});
           dummyTag = new TagClass.Tag(null, 'unimportant');
           dummyTagWithNullProperty = new TagClass.Tag(null, null);
        });
        it('Throws exception with null on not null property when inserting', function() {
            expect(function() { notNullDatabase.insert(dummyTagWithNullProperty); }).to.throw(/Illegal argument error: Missing required property tag.*/);
        });
        it('Throws exception with null on not null property when updating', function() {
            var afterInsert = notNullDatabase.insert(dummyTag);
            afterInsert.tag = null;
            expect(function() { notNullDatabase.update(afterInsert); }).to.throw(/Illegal argument error: Missing required property tag.*/);
        });
        it('Throws exception with missing property on not null property when inserting', function() {
            delete dummyTag.tag;
            expect(function() { notNullDatabase.insert(dummyTag); }).to.throw(/Illegal argument error: Missing required property tag.*/);
        });
        it('Throws exception when inserting missing entity', function() {
            expect(function() { notNullDatabase.insert(); }).to.throw(/Illegal argument error/);
        });


    });
});