/**
 * Created by marc.fokkert on 5-2-2015.
 */
angular.module('finqApp.writer.controller')
    .controller('StoriesCtrl', StoriesController);

/* @ngInject */
function StoriesController($scope, moduleService, MODULES, configProvider, valueService, storiesFilterService, EVENTS){
    var that = this;
    moduleService.setCurrentSection(MODULES.WRITER.sections.STORIES);

    this.selectedItem = null;
    this.maxScenarios = configProvider.client().available.pagination.client.scenariosPerPage;
    this.maxSelectItems = configProvider.client().selectDropdown.pagination.itemsPerPage;
    this.currentPage = 0;
    this.hasMorePages = valueService.hasMorePages;

    $scope.storybooks = storiesFilterService.getFilteredStorybooks;
    $scope.initialized = storiesFilterService.isInitialized;

    //$scope.$on(EVENTS.SCOPE.FILTER_SELECT_UPDATED, function (event, filterInfo) {
    //    that.filter[filterInfo.id].ids = filterInfo.keys;
    //    storiesFilterService.applyFilter(that.filter.set.ids, that.filter.tag.ids);
    //});

    this.expander = new StoryExpandCollapse('#story-list');
    this.expander.setup();

}
