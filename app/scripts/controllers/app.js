'use strict';

/**
 * @ngdoc overview
 * @name finqApp.controller:AppCtrl
 * @description
 * # Application Controller
 *
 * The main controller for the Finq application, which handles the creation and orchestration
 * of the application layout and main controllers.
 */
angular.module('finqApp.controller')
    .controller('AppCtrl', [
        '$state',
        '$scope',
        '$route',
        '$translate',
        'config',
        'page',
        'EVENTS',
        function ($state,$scope,$route,$translate,configProvider,pageFactory,EVENTS) {
            var that = this;
            this.title = 'Finq';
            this.searchQuery = '';

            $state.go('intro.loading');

            $scope.$on(EVENTS.SCOPE.CONFIG_LOADED,function(event, serverConfigData){
                that.title = serverConfigData.title;
            });

            $scope.$on(EVENTS.SCOPE.SECTION_STATE_CHANGED,function(event, moduleInfo){
                // update the page title
                pageFactory.setActiveSection(moduleInfo.module,moduleInfo.section);
                $translate(moduleInfo.section.id+'.TITLE').then(function (translatedValue) {
                    that.title = pageFactory.getPageTitle(configProvider.server().title,translatedValue);
                });
            });

            $scope.$on(EVENTS.SCOPE.SEARCH_UPDATED,function(event, query){
                that.searchQuery = query;
            });
        }
    ]);
