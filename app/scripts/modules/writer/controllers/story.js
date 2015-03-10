'use strict';

/**
 * @ngdoc overview
 * @name finqApp.writer.controller:StoryCtrl
 * @description
 * # Story editor controller
 *
 * The story editor controller allows the user to edit or create a new story.
 */
angular.module('finqApp.writer.controller')
    .controller('StoryCtrl',
    function ($scope, selectedItem, $routeParams, story, sidebar, $rootScope) {
        var that = this;
        this.selectedItem = {
            setSelectedItem: selectedItem.setSelectedItem,
            isItemSelected: selectedItem.isItemSelected
        };
        this.editStoryTitle = false;
        this.loaded = true;
        this.createNew = true;

        this.id = null;
        this.title = null;
        this.scenarios = [];
        this.prologue = [];
        this.epilogue = [];
        this.sets = [];
        this.tags = [];

        this.toggleVisible = sidebar.toggleVisible;

        var foundStory = story.findStoryById(parseInt($routeParams.storyId));
        if (foundStory === null) {
            // TODO alert the user to no story found
        } else {
            this.id = foundStory.id;
            this.title = foundStory.title;
            this.sets = foundStory.sets;
            this.tags = foundStory.tags;
            this.scenarios = foundStory.scenarios;
            this.epilogue = foundStory.epilogue;
            this.prologue = foundStory.prologue;
        }

        sidebar.setDirective({
            'scenario-variables-view': this.scenarios
        });


    }
);
