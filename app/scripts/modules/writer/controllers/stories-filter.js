'use strict';


angular.module('finqApp.writer.controller')
    .controller('StoriesFilterCtrl', [
        'set',
        'tag',
        'storiesFilter',
        '$translate',
        function (setService, tagService, storiesFilterService,$translate) {
            var that = this,
                currentActiveFilter = storiesFilterService.getLastFilter();

            this.expandStepType = true;
            this.stepTypesPlaceholder = "FILTERS.STEP_TYPES.ANY";
            this.steps = [];
            this.types = [
                {key: 'FILTERS.STEP_TYPES.ANY', value: ''},
                {key: 'FILTERS.STEP_TYPES.PENDING', value: ''},
                {key: 'FILTERS.STEP_TYPES.NO_PENDING', value: ''}
            ];
            this.loaded = true;

            angular.forEach(that.types, function (status) {
                $translate(status.key).then(function (translatedValue) {
                    status.value = translatedValue;
                });
            });


        }]);
