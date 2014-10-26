/**
 * Created by Holger on 26.10.2014.
 */
var expect = require('chai').expect;
var httpMocks = require('node-mocks-http');

var path = require('path');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var routerHelper = require(app_constants.packagedModule('routes', 'RouterHelperModule.js'))();

describe('Test not yet implemented handler', function() {
    it('returns a proper response code', function() {
        var responseMock = httpMocks.createResponse();
        routerHelper.notYetImplementedHandler({}, responseMock);
        expect(responseMock.statusCode).to.equal(501);
    });
});

