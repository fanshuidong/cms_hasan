/**
 * Created by sun on 2016/8/4.
 */
define(function (require) {
    var app = require('/../js/app');
    require('ui-table');
    var datepicker = require('datepicker');
    var toastr =require('toastr');
    app.useModule("ui.table");
    require('multiselect');
    app.controller('assistantUserCtrl', ['$scope','$http',function ($scope, $http) {
        datepicker($scope);
        var uid = window.localStorage.getItem("h_adminId");
        $scope.maxSize=5;
        $scope.userSearchEntity = {"page":1,"pageSize":10,"deviceType":2};
        $scope.query=function(reset){
            $scope.userSearchEntity.assistant = uid;
            if(reset){
                $scope.userSearchEntity = {"page":1,"pageSize":10,"deviceType":2};
            }
            $http({
                method: 'POST',
                url: "hasan/common/assistant/users",
                data:$scope.userSearchEntity
            }).success(function(data) {
                console.log(data);
                $scope.userList=data.attach.list;
                $scope.bigTotalItems=data.attach.total;
            });
        };
        $scope.query(true);
        // 切换页码时
        $scope.changePages=function(){
            $scope.userSearchEntity.query.page=$scope.page;
            $scope.query();
        };
        //条件查询
        $scope.search=function(){
            $scope.query();
        };
        //全局查询重置
        $scope.reset=function(){
            $scope.query(true);
        };
    }]);
});