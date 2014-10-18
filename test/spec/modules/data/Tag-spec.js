/**
 * Created by Holger on 24.09.2014.
 */

var expect = require('chai').expect;

var path = require('path');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var TagClass = require(app_constants.packagedModule('entities', 'Tag.js'));

describe('Test Tag Class', function() {
    var updatedTagName = 'JSON updated';
    var updatedTagId = 155344;
    var simpleJsonObject = {
        tag: updatedTagName
    };
    var simpleJsonString = JSON.stringify(simpleJsonObject);
    var completeJsonObject = {
        id: updatedTagId,
        tag: updatedTagName
    };
    var completeJsonString = JSON.stringify(completeJsonObject);
    var originalTagName = 'This is my super cool tag';
    var originalId = 123;
    var tag;

    beforeEach(function () {
        tag = new TagClass.Tag(originalId, originalTagName);
    });

    describe('Test the constructor function', function(){
        it('constructs new tag instance', function() {
            expect(tag instanceof TagClass.Tag).to.equal(true);
            expect(tag instanceof Date).to.equal(false);
        });
        it('constructs independent classes', function() {
            var tag1 = new TagClass.Tag(originalId, originalTagName);
            var tag2 = new TagClass.Tag(updatedTagId, updatedTagName);
            expect(tag1.id).not.to.equal(tag2.id);
            expect(tag1.tag).not.to.equal(tag2.tag);
        });
    });
    describe('Test the updating from JSON object', function() {
        it('updates from valid json object', function() {
            expect(tag.tag).to.eql(originalTagName);  // unchanged baseline check
            tag.updateFromJsonObject(simpleJsonObject);
            expect(tag.tag).to.equal(updatedTagName);   // updated
            expect(tag.id).to.equal(originalId);        // unchanged
        });
        it('updates from json string', function() {
            expect(tag.tag).to.equal(originalTagName);  // unchanged baseline check
            tag.updateFromJsonString(simpleJsonString);
            expect(tag.tag).to.equal(updatedTagName);   // updated
            expect(tag.id).to.equal(originalId);        // unchanged
            tag.updateFromJsonString(completeJsonString);
            expect(tag.id).to.equal(updatedTagId);      // updated
            expect(tag.tag).to.equal(updatedTagName);   // updated
        });
    });

});