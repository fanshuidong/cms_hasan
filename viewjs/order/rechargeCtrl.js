/**
 * Created by sun on 2016/8/4.
 */
define(function (require) {
    var app = require('/../js/app');
    require('ui-table');
    var toastr =require('toastr');
    app.useModule("ui.table");
    var datepicker = require('datepicker');
    app.controller('rechargeCtrl', ['$scope','$http','search','enums',function ($scope, $http,search,enums) {
        datepicker($scope);
        $scope.os = enums.os;
        $scope.goodsType = enums.goodsType;
        $scope.rechargeState = enums.rechargeState;
        $scope.selectOptions = {
            allowClear: false,
            language : 'zh-CN'
        };
        $scope.maxSize=5;
        $scope.query=function(reset){
            if(reset){
                $scope.orderSearchEntity = {"page":1,"pageSize":10}
            }
            $http({
                method: 'POST',
                url: "hasan/account/recharges",
                data:$scope.orderSearchEntity
            }).success(function(data) {
                console.log(data);
                $scope.orderList=data.attach.list;
                $scope.bigTotalItems=data.attach.total;
            });
        };
        $scope.query(true);

        // 切换页码时
        $scope.changePages=function(){
            $scope.orderSearchEntity.page=$scope.page;
            $scope.query();
        };
        //条件查询
        $scope.search=function(){
            if($scope.timeStart)
                $scope.orderSearchEntity.timeStart = Date.parse($scope.timeStart)/1000;
            else{
                delete  $scope.orderSearchEntity.timeStart
            }
            if($scope.timeStop)
                $scope.orderSearchEntity.timeStop = Date.parse($scope.timeStop)/1000;
            else{
                delete  $scope.orderSearchEntity.timeStop
            }
            $scope.query();
        };
        //全局查询重置
        $scope.reset=function(){
            $scope.timeStart="";
            $scope.timeStop="";
            $scope.query(true);
        };
    }]);
});