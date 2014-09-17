'use strict';

/**
 * @ngdoc function
 * @name finqApp.filter:storyBookSetFilter
 * @description
 * # Storybook set filter
 *
 * Allows the filtering of story books by supplying the a certain set. Only books with stories that are linked
 * to the supplied set will remain.
 */
angular.module('finqApp.filter')
    .filter('storybookSetFilter', function() {
        return function(books, setsToInclude) {
            var filteredBooks = [];
            if (!setsToInclude.length) {
                return books;
            }
            angular.forEach(books, function(book) {
                var include = false;
                angular.forEach(book.stories, function(story) {
                    angular.forEach(story.sets, function(set) {
                        if (setsToInclude.indexOf(set) > -1) {
                            include = true;
                        }
                    });
                });
                if (include) {
                    filteredBooks.push(book);
                }
            });

            return filteredBooks;
        };
    });
