/**
 * Created by marc.fokkert on 10-2-2015.
 */
angular.module('finqApp.writer.controller')
    .controller('StoryCtrl', [
        '$scope',
        '$translate',
        'module',
        'MODULES',
        'config',
        function($scope, $translate, moduleService, MODULES, configProvider){
            var that = this;
            this.name = "";
            this.scenario1show = true;
            this.scenario1 = "Asdf";

            $translate("WRITER.STORY.FILTER.NEW_STORY_PLACEHOLDER").then(function(translatedValue){
                that.name = translatedValue;
            });




        }]);
