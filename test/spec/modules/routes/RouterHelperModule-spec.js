/**
 * Created by Holger on 26.10.2014.
 */
var expect = require('chai').expect;
var httpMocks = require('node-mocks-http');
var sinon = require('sinon');

var path = require('path');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var routerHelper = require(app_constants.packagedModule('routes', 'RouterHelperModule.js'))();

var dummyRouter = {
    param: function(id, fnct) {
        // noop
    }
};

describe('Test not yet implemented handler', function() {
    it('returns a proper response code', function() {
        var responseMock = httpMocks.createResponse();
        routerHelper.notYetImplementedHandler({}, responseMock);
        expect(responseMock.statusCode).to.equal(501);
    });
});
describe('Test registerParamModule', function() {
    var spy = sinon.spy(dummyRouter, 'param');
    var dummyParamModule1 = {
        paramId: ':articleId',
        paramFunction: function dummy1() {
            // do nothing
        }
    };
    var dummyParamModule2 = {
        paramId: ':userId',
        paramFunction: function dummy2() {
            // do nothing
        }
    };

    function assertParamCallOnSpy(spyCall, paramModule) {
        expect(spyCall.calledWith(paramModule.paramId, paramModule.paramFunction)).to.be.true;
    }

    it('Registers a single param module', function() {
        spy.reset();
        routerHelper.registerParamModule(dummyRouter, [dummyParamModule1]);
        expect(spy.calledOnce).to.be.true;
        assertParamCallOnSpy(spy.firstCall, dummyParamModule1);
    });

    it('Registers multiple param modules', function() {
        spy.reset();
        routerHelper.registerParamModule(dummyRouter, [dummyParamModule1, dummyParamModule2]);
        expect(spy.calledTwice).to.be.true;
        assertParamCallOnSpy(spy.firstCall, dummyParamModule1);
        assertParamCallOnSpy(spy.secondCall, dummyParamModule2);
    });
});

