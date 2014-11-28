/**
 * This module provides a factory to use socket.io in angular controllers
 * @class angular_services.SocketModule
 * @memberOf angular_services
 * @author Holger Heymanns
 * @since 15.09.2014
 */
var socketFactory = angular.module('socket', []);

/**
 * @description Service factory for socket.io services
 * @function SocketService
 * @memberOf angular_services.SocketModule
 */
socketFactory.factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});