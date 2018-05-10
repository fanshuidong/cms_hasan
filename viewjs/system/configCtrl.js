/**
 * Created by sun on 2016/9/9.
 */

define(function (require) {
    var app = require('/../js/app');
    require('ui-table');
    app.useModule("ui.table");
    var toastr =require('toastr');
    app.controller('configCtrl', ['$scope','$http','$rootScope',function ($scope, $http,$rootScope) {
        $scope.info ={};
        for (var key in $rootScope.GlobalConfig) {
            $scope.info[key] = $rootScope.GlobalConfig[key];
        }
        $(".info").change(function () {
            var value = $.trim($(this).val());
            var key = $(this).attr("id");
            $http({
                method: 'POST',
                url:"hasan/common/configs/update",
                data:{
                    key:key,
                    value:value
                }
            }).success(function(data) {
                if(data.code=="code.success"){
                    toastr.success("修改成功");
                    $rootScope.GlobalConfig = $scope.info;
                }
            })
        });
    }]);


});