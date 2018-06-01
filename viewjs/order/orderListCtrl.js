/**
 * Created by sun on 2016/8/4.
 */
define(function (require) {
    var app = require('/../js/app');
    require('ui-table');
    var toastr =require('toastr');
    app.useModule("ui.table");
    var datepicker = require('datepicker');
    app.controller('orderListCtrl', ['$scope','$http','search','enums',function ($scope, $http,search,enums) {
        datepicker($scope);
        $scope.orderState = enums.orderState;
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
                url: "hasan/order/list/all",
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
        $scope.deliver  = function (id) {
            $scope.order = {id:id};
            $scope.deliverModal = !$scope.deliverModal;
        };
        //发货
        $scope.deliver_ = function () {
            $http({
                method: 'POST',
                url: "hasan/order/deliver",
                data:$scope.order
            }).success(function(data) {
                if(data.code == 'code.success'){
                    toastr.success("发货成功!");
                    $scope.deliverModal = !$scope.deliverModal;
                    $scope.query();
                }
            });
        }
    }]);
});