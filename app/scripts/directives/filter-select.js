'use strict';

/**
 * @ngdoc overview
 * @name finqApp.directives:FilterSelect
 * @description
 * # Filter select dropdown
 *
 * A filter dropdown select button with dynamic options linked to models. To use it add the attribute
 * "filter-select" to your DOM tag and provide it with a reference to the controller object that contains
 * the list of values that the user can select. This has to be a list of key value pairs.
 */
angular.module('finqApp.directive')
    .directive('filterSelect', ['$translate', function () {
        return {
            scope: {
                passedOptions: '=filterSelect',
                multiple: '=',
                defkey: '=default',
                placeholder: '=',
                id: '=filterId',
                syncEvent: '@synchronize'
            },
            restrict: 'A',
            templateUrl: 'views/directives/select.html',
            controller: 'FilterSelectCtrl',
            link: function (scope) {
                scope.initialize();

                scope.$watch('passedOptions', function() {
                    scope.initialize();
                });

                if (scope.syncEvent !== undefined) {
                    scope.$on(scope.syncEvent,function(event, keys) {
                        scope.synchronize(keys);
                    });
                }
            }
        };
    }])
    .controller('FilterSelectCtrl', ['$scope', '$timeout', '$translate', 'EVENTS', function($scope,$timeout,$translate,EVENTS) {
        var hideTimer;
        var blockHide = false;

        $scope.show = false;
        $scope.initialize = function() {
            var placeholder;

            $scope.options = angular.copy($scope.passedOptions);

            if ($scope.placeholder !== undefined) {
                placeholder = [{
                    key: null,
                    value: ''
                }];
                $scope.active = angular.copy(placeholder);
                $scope.options = placeholder.concat($scope.options);
                $translate($scope.placeholder).then(function (translatedValue) {
                    $scope.active[0].value = translatedValue;
                    $scope.options[0].value = translatedValue;
                    updateValue();
                });
            }

            if ($scope.defkey !== undefined) {
                var found = false;
                for (var i=0; i<$scope.options.length; i++) {
                    if ($scope.options[i].key === $scope.defkey) {
                        $scope.active = [{
                            key: $scope.options[i].key,
                            value: $scope.options[i].value
                        }];
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    throw new Error('Invalid default filter value for filter '+$scope.id+' the key '+$scope.defkey+' could not be found in the passed options list');
                }
            }

            if ($scope.defkey === undefined && $scope.placeholder === undefined) {
                throw new Error('Missing default value or placeholder for filter '+$scope.id);
            }

            updateValue();
        };
        $scope.synchronize = function(keys) {
            $scope.active = [];
            for (var i=0; i<$scope.options.length; i++) {
                if (keys.indexOf($scope.options[i].key) > -1) {
                    $scope.active.push({
                        key: $scope.options[i].key,
                        value: $scope.options[i].value
                    });
                }
            }
            updateValue();
        };
        $scope.toggle = function() {
            $scope.show = !$scope.show;
            $timeout.cancel(hideTimer);
        };
        $scope.hide = function() {
            hideTimer = $timeout(
                function () {
                    if (blockHide) {
                        blockHide = !blockHide;
                    } else {
                        $scope.show = false;
                    }
                },
                100
            );
        };
        $scope.select = function(key,value) {
            var newKeys,
                realKeys = [];
            blockHide = true;
            if ($scope.multiple) {
                newKeys = multipleToggle(key,value);
            } else {
                newKeys = singleSelect(key,value);
                if (!newKeys) {
                    return;
                }
            }
            for (var i=0; i<newKeys.length; i++) {
                if (newKeys[i] !== null) {
                    realKeys.push(newKeys[i]);
                }
            }
            $scope.$emit(EVENTS.FILTER_SELECT_UPDATED,{
                id: $scope.id,
                keys: realKeys,
                keysFull: newKeys
            });
            updateValue();
        };
        $scope.isActive = function(key) {
            for (var i=0; i<$scope.active.length; i++) {
                if ($scope.active[i].key === key) {
                    return true;
                }
            }
            return false;
        };

        var updateValue = function() {
            var val = [];
            for (var i=0; i<$scope.active.length; i++) {
                val.push($scope.active[i].value);
            }
            $scope.value = val.join(', ');
        };

        var singleSelect = function(key,value) {
            if ($scope.active[0].key === key) {
                return false;
            }
            $scope.active[0].key = key;
            $scope.active[0].value = value;
            return [key];
        };

        var multipleToggle = function(key,value) {
            var keys = [],
                found = false;
            if (key === null) {
                $scope.active = [{
                    key: $scope.options[0].key,
                    value: $scope.options[0].value
                }];
                return [null];
            }
            if ($scope.active.length && $scope.active[0].key === null) {
                $scope.active.splice(0,1);
            }
            for (var i=0; i<$scope.active.length; i++) {
                if ($scope.active[i].key === key) {
                    found = true;
                    $scope.active.splice(i--,1);
                } else {
                    keys.push($scope.active[i].key);
                }
            }
            if (!found) {
                $scope.active.push({
                    key: key,
                    value: value
                });
                keys.push(key);
            }
            if (!keys.length) {
                if ($scope.options[0].key === null) {
                    return multipleToggle(null,$scope.options[0].value);
                } else {
                    return multipleToggle(key,value);
                }
            }
            return keys;
        };
    }]);
