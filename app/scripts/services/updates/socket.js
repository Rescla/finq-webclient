'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:socket
 * @description
 * # Socket communication service
 *
 * Communicate with the backend through a websocket abstraction and handle connection and
 * disconnection events. This abstraction puts the websocket in the digest cycle of angular.
 */
angular.module('finqApp.service')
    .service('socket', [
        '$rootScope',
        'config',
        'websocket',
        'feedback',
        'FEEDBACK',
        'EVENTS',
        function ($rootScope, configProvider, websocket, feedbackService, FEEDBACK, EVENTS) {
            var that = this,
                connected = false,
                connecting = false,
                reconnect = false,
                queuedEmits = [],
                persistentEmits = [];

            this.isConnected = function () {
                return connecting || connected || reconnect;
            };

            this.connect = function () {
                websocket.connect(configProvider.client().socket.endpoint, {
                    reconnectAttempts: configProvider.client().socket.reconnectAttempts,
                    reconnectDelay: configProvider.client().socket.reconnectDelay,
                    reconnectDelayMax: configProvider.client().socket.reconnectDelayMax,
                    timeout: configProvider.client().socket.timeout,
                    mocked: configProvider.client().socket.mocked,
                    mockConnectionDelay: configProvider.client().socket.mockConnectionDelay
                });
                connecting = true;
                websocket.on(EVENTS.SOCKET.MAIN.CONNECTED, function () {
                    connected = true;
                    connecting = false;
                    angular.forEach(queuedEmits, function (emitRequest) {
                        that.emit(emitRequest.event, emitRequest.data);
                    });
                    queuedEmits = [];
                });
                websocket.on(EVENTS.SOCKET.MAIN.DISCONNECTED, function () {
                    connected = false;
                });
                websocket.on(EVENTS.SOCKET.MAIN.ERROR, function (error) {
                    console.error('Server socket connection has caused an error', error);
                    if (connecting) {
                        feedbackService.error(FEEDBACK.ERROR.SOCKET.UNABLE_TO_CONNECT);
                    }
                });
                websocket.on(EVENTS.SOCKET.MAIN.RECONNECTING, function (event, count) {
                    reconnect = true;
                    if (count === 1) {
                        console.debug('Connection to the server lost, attempting to reconnect');
                        feedbackService.notice(FEEDBACK.NOTICE.SOCKET.RECONNECTING);
                    }
                    console.debug('Reconnection attempt ' + count);
                    if (count === configProvider.client().socket.reconnectAlertCnt) {
                        feedbackService.alert(FEEDBACK.ALERT.SOCKET.RECONNECTION_TROUBLE);
                    }
                });
                websocket.on(EVENTS.SOCKET.MAIN.RECONNECTED, function () {
                    connected = true;
                    reconnect = false;
                    feedbackService.notice(FEEDBACK.NOTICE.SOCKET.RECONNECTED);
                    angular.forEach(persistentEmits, function (emitRequest) {
                        that.emit(emitRequest.event, emitRequest.data);
                    });
                });
                websocket.on(EVENTS.SOCKET.MAIN.RECONNECT_FAILED, function () {
                    reconnect = false;
                    feedbackService.error(FEEDBACK.ERROR.SOCKET.UNABLE_TO_RECONNECT);
                });
            };

            this.on = function (eventName, callback) {
                websocket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(websocket, args);
                    });
                });
            };

            this.once = function (eventName, callback) {
                websocket.once(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(websocket, args);
                    });
                });
            };

            this.off = function (eventName) {
                websocket.off(eventName);
            };

            this.emit = function (eventName, data, resubmitOnReconnect) {
                if (!that.isConnected()) {
                    queuedEmits.push({
                        event: eventName,
                        data: data
                    });
                } else {
                    if (resubmitOnReconnect) {
                        persistentEmits.push({
                            event: eventName,
                            data: data
                        });
                    }
                    websocket.emit(eventName, data);
                }
            };

        }]);
