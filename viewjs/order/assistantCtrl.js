/**
 * Created by sun on 2016/8/4.
 */
define(function (require) {
    var app = require('/../js/app');
    require('ui-table');
    var toastr =require('toastr');
    app.useModule("ui.table");
    var datepicker = require('datepicker');
    app.controller('assistantCtrl', ['$scope','$http','enums',function ($scope, $http,enums) {
        var uid = window.localStorage.getItem("h_adminId");
        datepicker($scope);
        $scope.orderState = enums.orderState;
        $scope.selectOptions = {
            allowClear: false,
            language : 'zh-CN'
        };
        $scope.maxSize=5;
        $scope.query=function(reset){
            if(reset){
                $scope.orderSearchEntity = {"page":1,"pageSize":10,assistant:uid}
            }
            $http({
                method: 'POST',
                url: "hasan/order/assistant",
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
        //发货
        $scope.deliver = function (id) {
            $http({
                method: 'POST',
                url: "hasan/order/deliver",
                data:{id:id}
            }).success(function(data) {
                if(data.code == 'code.success'){
                    toastr.success("发货成功!");
                    $scope.query();
                }
            });
        }
    }]);
});