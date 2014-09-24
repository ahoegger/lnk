var path = require('path');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var dbHelper = require(app_constants.packagedModule('data', 'InMemoryDatabaseHelper'));
var TagClass = require(app_constants.packagedModule('entities', 'Tag.js'));

describe('Test InMemoryDatabaseHelper', function() {
    var dataArray;

    beforeEach(function () {
        dataArray = [
            {
                id: 1,
                value: 'unimportant'
            },
            {
                id: 2,
                value: 'dont need it'
            }
        ];
    });
    describe('Test getNewId', function () {
        it('finds a new id', function () {
            expect(dbHelper.getNewId(dataArray, 'id')).toBe(3);
            dataArray.push({id: 17, value: 'go away'});
            expect(dbHelper.getNewId(dataArray, 'id')).toBe(18);
            dataArray.push({id: 4, value: 'go away'});
            expect(dbHelper.getNewId(dataArray, 'id')).toBe(18);
        });
        it('returns -1 if properties ar wrong', function () {
            expect(dbHelper.getNewId(null, 'id')).toBe(-1);
            expect(dbHelper.getNewId(undefined, 'id')).toBe(-1);
            expect(dbHelper.getNewId(dataArray, null)).toBe(-1);
            expect(dbHelper.getNewId(dataArray, undefined)).toBe(-1);
        })
    });
    describe('Test findPositionById', function() {
        var cases = [{id: 1, expected: 0}, {id: 2, expected: 1}, {id: 4, expected: undefined}];
        var counter;
        var caseLength = cases.length;
        var testCase;
        function assertPosition(testCase) {
            it('finds position for id ' + testCase.id + ' to be ' + testCase.expected, function() {
                expect(dbHelper.findPositionById(dataArray, 'id', testCase.id)).toBe(testCase.expected);
            });
        }
        for(counter = 0; counter < cases.length; counter++) {
            assertPosition(cases[counter]);
        }
    });
    describe('Test findPositionById with wrong properties', function() {
        var cases = [{id: null, expected: undefined}, {id: undefined, expected: undefined}];
        var counter;
        var caseLength = cases.length;
        var testCase;
        function assertPosition(testCase) {
            it('Finds wrong position for id ' + testCase.id + ' to be ' + testCase.expected, function() {
                expect(dbHelper.findPositionById(dataArray, 'id', testCase.id)).toBe(testCase.expected);
            });
        }
        for(counter = 0; counter < cases.length; counter++) {
            assertPosition(cases[counter]);
        }
    });
    describe('Test checkInstance', function(){
        var tag = new TagClass.Tag(55, 'Hello tag');
        function DummyConstructor(thingy) {
            this.aaa = thingy;
        }
        var wrongObject = new DummyConstructor();
        it('Should run without error', function() {
            expect(function() {dbHelper.checkInstance(tag, TagClass.Tag);}).not.toThrow();
        });
        it('Should throw error', function() {
            expect(function () {
                dbHelper.checkInstance(wrongObject, TagClass.Tag);
            }).toThrow(new Error('Illegal argument error'));
        });
    });
});