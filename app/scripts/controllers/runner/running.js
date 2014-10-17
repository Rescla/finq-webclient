'use strict';

/**
 * @ngdoc overview
 * @name finqApp.controller:RunningCtrl
 * @description
 * # Running scenarios Controller
 *
 * The available controller allows a user to execute tests. It provides lists of available tests that can
 * be run, and provides the user with the ability to execute a particular test. Such a test can
 * either be run in the background or in debug mode.
 */
angular.module('finqApp.controller')
    .controller('RunningCtrl', [
        '$scope',
        '$timeout',
        '$translate',
        'module',
        'EVENTS',
        'MODULES',
        'config',
        'runner',
        'environment',
        'utils',
        function ($scope,$timeout,$translate,moduleService,EVENTS,MODULES,configProvider,runnerService,environmentService,utils) {
        var that = this;

        this.selectedItem = null;
        this.maxSelectItems = configProvider.client().pagination.maxSelectDropdownItems;
        this.filter = {
            env: {id: 'env', keys: []}
        };

        $scope.$on(EVENTS.SCOPE.FILTER_SELECT_UPDATED,function(event,filterInfo) {
            that.filter[filterInfo.id].keys = filterInfo.keys;
        });

        $scope.runs = runnerService.getRunningSessions;

        moduleService.setCurrentSection(MODULES.RUNNER.sections.RUNNING);

        var updateRunProgress = function() {
            var runs = runnerService.getRunningSessions();
            if (runs.length) {
                var currentTime = new Date();
                angular.forEach(runs, function(run) {
                    var timeDelta = parseInt((currentTime.getTime() - run.startedOn.getTime()) / 1000);

                    var pluralized = utils.pluralize('RUNNER.RUNNING.RUN.START_TIME', [
                        {actionValue: 1, target: 'SECONDS'},
                        {actionValue: 60, target: 'MINUTES'},
                        {actionValue: 3600, target: 'HOURS'}
                    ], timeDelta);

                    $translate(pluralized.template,{delta: pluralized.value, id: run.id}).then(function (translatedValue) {
                        run.startTimeMsg = translatedValue;
                    });
                    $translate('RUNNER.RUNNING.RUN.STARTED_BY',{name: run.startedBy.first}).then(function (translatedValue) {
                        run.startedByMsg = translatedValue;
                    });
                    $translate('RUNNER.RUNNING.RUN.RUNNING_ON',{environment: environmentService.getNameById(run.environment)}).then(function (translatedValue) {
                        run.startedOnMsg = translatedValue;
                    });

                    run.progressPercentage = 20;
                });
            }
            $timeout(updateRunProgress, configProvider.client().run.updateInterval);
        };

        updateRunProgress();

    }]);
