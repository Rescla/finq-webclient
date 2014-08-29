// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-08-13 using
// generator-karma 0.8.3

module.exports = function() {
  'use strict';

  return {
    autoWatch: true,
    singleRun: false,
    colors: true,
    basePath: '../',
    frameworks: ['jasmine'],
    browsers: ['PhantomJS'],
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-translate/angular-translate.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'app/scripts/*.js',
      'app/scripts/modules/*.js',
      'app/scripts/**/*.js',
    ],

  };
};