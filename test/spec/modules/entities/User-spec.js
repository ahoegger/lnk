/**
 * Created by Holger on 29.10.2014.
 */
var expect = require('chai').expect;

var path = require('path');
var app_constants = require(path.join(path.resolve(process.cwd()), 'app_constants'));
var UserClass = require(app_constants.packagedModule('entities', 'User.js'));

describe('Test user entity', function () {
    describe('Test password functionality', function () {
        var testPassword = 'secret password';
        var testEncryptedPassword = UserClass.User.prototype.encryptPassword(testPassword);

        var user = new UserClass.User(null, 'holger', 'heymanns', 'holger', testEncryptedPassword, true);

        function assertPassword(user) {
            expect(user.isAuthenticated(testPassword)).to.be.true;
            expect(user.isAuthenticated(testEncryptedPassword, true)).to.be.true;
            expect(user.isAuthenticated('wrong password')).to.be.false;
            expect(user.isAuthenticated(user.encryptPassword('wrong password'), true)).to.be.false;
        }

        it('validates the unencrypted password', function () {
            assertPassword(user);
        });
        it('validated the password of a cloned user', function () {
            assertPassword(user.clone());
        });
    });
    describe('Test JSON updates', function() {
        it('Updates all values from JSON', function() {
            var user = new UserClass.User(123, 'andy', 'xyz', 'jjsh', 'top secret',false);
            var newUserObject = {
                id: 444,
                userName: 'Hoegger',
                name: 'blubber',
                firstname: 'andy',
                password: 'even more secret',
                active: true
            };
            var newUserJson = JSON.stringify(newUserObject);
            user.updateFromJsonString(newUserJson);
            expect(user.id).to.be.equal(newUserObject.id);
            expect(user.userName).to.be.equal(newUserObject.userName);
            expect(user.name).to.be.equal(newUserObject.name);
            expect(user.firstname).to.be.equal(newUserObject.firstname);
            expect(user.active).to.be.equal(newUserObject.active);
            expect(user.isAuthenticated(newUserObject.password)).to.be.true;
        });
        it('Does not update not provided values', function() {
            var originalPassword = 'top secret';
            var originalEncryptedPassword = UserClass.User.prototype.encryptPassword(originalPassword);
            var user = new UserClass.User(123, 'andy', 'Hoegger', 'Andy', originalEncryptedPassword, true);
            user.updateFromJsonObject({});  // no property that will be used
            expect(user.id).to.be.equal(user.id);
            expect(user.userName).to.be.equal(user.userName);
            expect(user.name).to.be.equal(user.name);
            expect(user.firstname).to.be.equal(user.firstname);
            expect(user.active).to.be.equal(user.active);
            expect(user.isAuthenticated(originalPassword)).to.be.true;
        })
    })
});