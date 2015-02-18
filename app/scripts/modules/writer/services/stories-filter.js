'use strict';

angular.module('finqApp.writer.service')
    .service('storiesFilter', [
        '$filter',
        'value',
        'story',
        'storybookSearch',
        '$q',
        function ($filter, valueService, storyService, storybookSearchService, $q) {
            var that = this,
                initialized = false,
                storybookSearchFilter = $filter('storybookSearchFilter'),
                storySearchFilter = $filter('storySearchFilter'),
                unfilteredReports = [],
                initializing = false,
                filteredBooks = [],
                unfilteredBooks = [],
                lastFilter = {
                    statuses: []
                };

            this.isInitialized = function () {
                return initialized;
            };
            this.initialize = function () {
                var deferred = $q.defer();
                storyService.list().then(function (storybooks) {
                    unfilteredBooks = storybooks;
                    storybookSearchService.initialize(storybooks);
                    that.applyFilter();
                    deferred.resolve();
                    initializing = false;
                    initialized = true;
                });
                initializing = true;
                return deferred.promise;
            };

            this.applyFilter = function () {
                if (!initialized && !initializing) {
                    var deferred = $q.defer();
                    that.initialize().then(function () {
                        deferred.resolve(filteredBooks);
                    });
                    return deferred.promise;
                } else {
                    filteredBooks = storybookSearchFilter(angular.copy(unfilteredBooks), valueService.searchQuery);
                    angular.forEach(filteredBooks, function (book) {
                        var stories = storySearchFilter(book.stories, valueService.searchQuery, book.id);
                        book.stories = stories;
                    });
                    return $q.when(filteredBooks);
                }
            };

            this.getFilteredStoriesByBook = function (bookId) {
                var storyList = [];
                for (var i = 0; i < filteredBooks.length; i++) {
                    if (bookId === null) {
                        storyList = storyList.concat(filteredBooks[i].stories);
                    } else if (filteredBooks[i].id === bookId) {
                        return filteredBooks[i].stories;
                    }
                }
                return storyList;
            };

            this.getFilteredScenariosByStory = function (storyId) {
                var j;
                for (var i = 0; i < filteredBooks.length; i++) {
                    for (j = 0; j < filteredBooks[i].stories.length; j++) {
                        if (filteredBooks[i].stories[j].id === storyId) {
                            return filteredBooks[i].stories[j].scenarios;
                        }
                    }
                }
                return [];
            };

            this.getFilteredStorybooks = function () {
                if (!initialized && !initializing) {
                    that.initialize();
                    return [];
                }
                return filteredBooks;
            };


            this.getLastFilter = function () {
                return lastFilter;
            };


        }]);
