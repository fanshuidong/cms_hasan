/**
 * Created by sun on 2016/8/4.
 */
define(function (require) {
    var app = require('/../js/app');
    require('ui-table');
    require('ztree');
    var toastr =require('toastr');
    app.useModule("ui.table");
    app.controller('userListCtrl', ['$scope','$http','search',function ($scope, $http,search) {

    }]);
});