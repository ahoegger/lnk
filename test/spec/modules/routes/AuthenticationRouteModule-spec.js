/**
 * Created by Holger on 09.11.2014.
 * Test specification for AuthenticationRouteModule
 */
var expect = require('chai').expect;
var sinon = require('sinon');

var path = require('path');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var dummyDataStore = {
    resultSet: [],
    selectUser: function(ignore) {
        return this.resultSet;
    }
};

var resMock = {
    status: function(dummy){ return this },
    send: function(){ },
    json: function(dummy) { }
};

describe('Test authenticate', function() {
    var testModule = new require(app_constants.packagedModule('routes', 'AuthenticationRouteModule.js'))(dummyDataStore);
    var spySend = sinon.spy(resMock, 'send');
    var spyStatus = sinon.spy(resMock, 'status');

    beforeEach(function () {
        spySend.reset();
    });

    it('Returns 401 when userName is missing ', function() {
        testModule.authenticate({body: {}}, resMock);
        expect(spySend.withArgs(401).calledOnce).to.be.true;
    });
    it('Returns 401 when password is missing ', function() {
        testModule.authenticate({body: {userName: 'faked'}}, resMock);
        expect(spySend.withArgs(401).calledOnce).to.be.true;
    });
    it('Returns 401 when user has not been found', function() {
        dummyDataStore.resultSet = [];
        testModule.authenticate({body: {userName: 'faked', password: 'not relevant'}}, resMock);
        expect(spySend.withArgs(401).calledOnce).to.be.true;
    });
    it('Returns 401 when more than one user has been found', function() {
        dummyDataStore.resultSet = [{userName: 'no'}, {userName: 'no'}];
        testModule.authenticate({body: {userName: 'faked', password: 'not relevant'}}, resMock);
        expect(spySend.withArgs(401).calledOnce).to.be.true;
    });
    it('Returns 401 when user is not authenticated', function() {
        dummyDataStore.resultSet = [{isAuthenticated: function() {return false} }];
        testModule.authenticate({body: {userName: 'faked', password: 'not relevant'}}, resMock);
        expect(spySend.withArgs(401).calledOnce).to.be.true;
    });
    it('Returns a token when user is not authenticated', function() {
        var spyJson = sinon.spy(resMock, 'json');
        dummyDataStore.resultSet = [{isAuthenticated: function() {return true} }];
        testModule.authenticate({body: {userName: 'faked', password: 'not relevant'}}, resMock);
        expect(spyJson.calledOnce).to.be.true;
        expect(spyStatus.withArgs(200).calledOnce).to.be.true;
        expect(spyJson.firstCall.args[0].token).not.to.be.undefined;
    })
});

