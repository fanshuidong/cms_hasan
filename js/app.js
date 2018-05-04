define(function (require, exports, module) {
    var angular = require('angular');
    var asyncLoader = require('angular-async-loader');

    require('angular-ui-router');
    require('ui-bootstrap');
    require('sanitize');
    require('angular-select2');


    var app = angular.module('app', ['ui.router','ui.bootstrap','ngSanitize','ui.select2']);

    asyncLoader.configure(app);

    module.exports = app;
});