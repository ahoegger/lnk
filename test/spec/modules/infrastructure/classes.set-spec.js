/**
 * Created by Holger on 14.09.2014.
 */
var path = require('path');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var classesModule = require(app_constants.packagedModule('infrastructure', 'classes'));

describe('Test the StringSet class', function() {
   it('will have a constructor', function() {
       var myStringSet = new classesModule.StringSet();
       expect(myStringSet instanceof classesModule.StringSet).toBe(true);
   });
    it('allows to add a string element and to contain it', function() {
        var myStringSet = new classesModule.StringSet();
        var propertyName = 'hello';
        myStringSet.add(propertyName);
        expect(myStringSet.contains(propertyName)).toBe(true);
    });
    it('handles removing and adding of properties properly', function() {
        var myStringSet = new classesModule.StringSet();
        var propertyName = 'hello';
        expect(myStringSet.contains(propertyName)).toBe(false);
        myStringSet.add(propertyName);
        expect(myStringSet.contains(propertyName)).toBe(true);
        myStringSet.remove(propertyName);
        expect(myStringSet.contains(propertyName)).toBe(false);
    });
    it('handles multipe additions correctly', function() {
        var myStringSet = new classesModule.StringSet();
        var propertyName1 = 'hello';
        var propertyName2 = 'world';
        myStringSet.add(propertyName1);
        myStringSet.add(propertyName2);
        expect(myStringSet.contains(propertyName1)).toBe(true);
        expect(myStringSet.contains(propertyName2)).toBe(true);
        myStringSet.add(propertyName1);
        expect(myStringSet.contains(propertyName1)).toBe(true);
        myStringSet.remove(propertyName1);
        expect(myStringSet.contains(propertyName1)).toBe(false);
        expect(myStringSet.contains(propertyName2)).toBe(true);
    });
    it('handles scope properly', function() {
        var myStringSet1 = new classesModule.StringSet();
        var myStringSet2 = new classesModule.StringSet();
        var propertyName = 'hello';
        myStringSet1.add(propertyName);
        expect(myStringSet1.contains(propertyName)).toBe(true);
        expect(myStringSet2.contains(propertyName)).toBe(false);
    });

});