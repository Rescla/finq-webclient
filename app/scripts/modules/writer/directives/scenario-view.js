'use strict';
/**
 * Created by marc.fokkert on 2-3-2015.
 */
angular.module('finqApp.writer.directive')
    .directive('scenarioView', function () {
        return {
            scope: {
                scenarios: '='
            },
            //replace: true,
            restrict: 'A',
            templateUrl: 'views/modules/writer/directives/scenario-view.html',
            controller: 'ScenarioViewCtrl'
        };
    })
    .controller('ScenarioViewCtrl', function ($scope, selectedItem, arrayOperations) {
        $scope.scenarioView = {
            deleteItem: deleteItem,
            isStepIncomplete: isStepIncomplete
        };

        $scope.selectedItem = {
            setSelectedItem: selectedItem.setSelectedItem,
            isItemSelected: selectedItem.isItemSelected
        };

        function deleteItem(collection, index, deletedItem) {
            arrayOperations.removeItem(collection, index);
            if (selectedItem.isItemSelected(deletedItem)){
                selectedItem.clearSelectedItem();
            }
        }

        function isStepIncomplete(step) {
            return step.isIncomplete();
        }

    });
