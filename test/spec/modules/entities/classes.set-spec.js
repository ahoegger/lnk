/**
 * Created by Holger on 14.09.2014.
 */
var expect = require('chai').expect;

var path = require('path');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var classesModule = require(app_constants.packagedModule('entities', 'classes.js'));

describe('Test the StringSet class', function () {
    describe('Test basic functionality', function () {
        it('will have a constructor', function () {
            var myStringSet = new classesModule.StringSet();
            expect(myStringSet instanceof classesModule.StringSet).to.equal(true);
        });
        it('clears clear', function() {
            var myStringSet = new classesModule.StringSet();
            var oneProp = 'one';
            var twoProp = 'two';
            myStringSet.add(oneProp);
            myStringSet.add(twoProp);
            myStringSet.clear();
            expect(myStringSet.contains(oneProp)).to.be.false;
            expect(myStringSet.contains(twoProp)).to.be.false;
        });
    });
    describe('Test business logic', function () {
        it('allows to add a string element and to contain it', function () {
            var myStringSet = new classesModule.StringSet();
            var propertyName = 'hello';
            myStringSet.add(propertyName);
            expect(myStringSet.contains(propertyName)).to.equal(true);
        });
        it('handles removing and adding of properties properly', function () {
            var myStringSet = new classesModule.StringSet();
            var propertyName = 'hello';
            expect(myStringSet.contains(propertyName)).to.equal(false);
            myStringSet.add(propertyName);
            expect(myStringSet.contains(propertyName)).to.equal(true);
            myStringSet.remove(propertyName);
            expect(myStringSet.contains(propertyName)).to.equal(false);
        });
        it('handles multipe additions correctly', function () {
            var myStringSet = new classesModule.StringSet();
            var propertyName1 = 'hello';
            var propertyName2 = 'world';
            myStringSet.add(propertyName1);
            myStringSet.add(propertyName2);
            expect(myStringSet.contains(propertyName1)).to.equal(true);
            expect(myStringSet.contains(propertyName2)).to.equal(true);
            myStringSet.add(propertyName1);
            expect(myStringSet.contains(propertyName1)).to.equal(true);
            myStringSet.remove(propertyName1);
            expect(myStringSet.contains(propertyName1)).to.equal(false);
            expect(myStringSet.contains(propertyName2)).to.equal(true);
        });
        it('handles scope properly', function () {
            var myStringSet1 = new classesModule.StringSet();
            var myStringSet2 = new classesModule.StringSet();
            var propertyName = 'hello';
            myStringSet1.add(propertyName);
            expect(myStringSet1.contains(propertyName)).to.equal(true);
            expect(myStringSet2.contains(propertyName)).to.equal(false);
        });
        it('produces a proper array', function() {
            var myStringSet = new classesModule.StringSet();
            var propertyName1 = 'hello';
            var propertyName2 = 'world';
            var arrayContent;
            myStringSet.add(propertyName1);
            myStringSet.add(propertyName2);
            arrayContent = myStringSet.toArray();
            expect(arrayContent.length).to.equal(2);
            expect(arrayContent[0]).to.be.eql(propertyName1);
            expect(arrayContent[1]).to.be.eql(propertyName2);
        });
    });
    describe('Test unexpected behaviour', function () {
        it('does not accept non string elements', function () {
            var myStringSet = new classesModule.StringSet();
            expect(function () {
                myStringSet.add(123);
            }).to.throw(/Missing required element name/);
        });
    });
    describe('Test Error Class', function() {
        var errorNumber = 123;
        var errorMessage = 'Hello error';
        var lnkError = new classesModule.LnkError(errorNumber, errorMessage);
        expect(lnkError.getNumber()).to.be.eql(errorNumber);
        expect(lnkError.getMessage()).to.be.eql(errorMessage);
    })

});