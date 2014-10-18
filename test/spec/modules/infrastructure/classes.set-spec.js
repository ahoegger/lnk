/**
 * Created by Holger on 14.09.2014.
 */
var expect = require('chai').expect;

var path = require('path');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var classesModule = require(app_constants.packagedModule('infrastructure', 'classes'));

describe('Test the StringSet class', function() {
   it('will have a constructor', function() {
       var myStringSet = new classesModule.StringSet();
       expect(myStringSet instanceof classesModule.StringSet).to.equal(true);
   });
    it('allows to add a string element and to contain it', function() {
        var myStringSet = new classesModule.StringSet();
        var propertyName = 'hello';
        myStringSet.add(propertyName);
        expect(myStringSet.contains(propertyName)).to.equal(true);
    });
    it('handles removing and adding of properties properly', function() {
        var myStringSet = new classesModule.StringSet();
        var propertyName = 'hello';
        expect(myStringSet.contains(propertyName)).to.equal(false);
        myStringSet.add(propertyName);
        expect(myStringSet.contains(propertyName)).to.equal(true);
        myStringSet.remove(propertyName);
        expect(myStringSet.contains(propertyName)).to.equal(false);
    });
    it('handles multipe additions correctly', function() {
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
    it('handles scope properly', function() {
        var myStringSet1 = new classesModule.StringSet();
        var myStringSet2 = new classesModule.StringSet();
        var propertyName = 'hello';
        myStringSet1.add(propertyName);
        expect(myStringSet1.contains(propertyName)).to.equal(true);
        expect(myStringSet2.contains(propertyName)).to.equal(false);
    });
    it('does not accept non string elements', function() {
        var myStringSet = new classesModule.StringSet();
        expect(function() { myStringSet.add(123); }).to.throw(/Missing required element name/);
    });
});