/**
 * Created by sun on 2016/8/4.
 */
define(function (require) {
    var app = require('/../js/app');
    require('ui-table');
    app.useModule("ui.table");
    var toastr =require('toastr');
    var datepicker = require('datepicker');
    app.controller('dateCtrl', ['$scope','$http',function ($scope, $http) {
        datepicker($scope);
        $scope.query = function (reset) {
            if(reset){
                $scope.dateSearchEntity = {page:1,pageSize:10};
            }
            $http({
                method: 'POST',
                url: "hasan/scheduler/list",
                data:$scope.dateSearchEntity
            }).success(function (data) {
                console.log(data);
                $scope.orderParams=data.attach.list;
                $scope.bigTotalItems=data.attach.total;
            })
        };
        $scope.query(true);

        // 切换页码时
        $scope.changePages=function(){
            $scope.dateSearchEntity.page=$scope.page;
            $scope.query();
        };
        //条件查询
        $scope.search=function(){
            $scope.query();
        };
        //创建
        $scope.add=function(){
            $scope.isEdit = false;
            $scope.addModal = !$scope.addModal;
        };
        //修改
        $scope.editApi=function(item){
            $scope.isEdit = true;
            $scope.apiModal = !$scope.apiModal;
            $scope.api = item;
            $scope.api.login = String($scope.api.login);
            $scope.api.serial = String($scope.api.serial);
        };

        //添加编辑
        $scope.submitApi=function(){
            if($scope.isEdit){
                $scope.url="hasan/authority/api/modify";
            }else{
                $scope.url="hasan/authority/api/add";
            }
            $http({
                method: 'POST',
                url: $scope.url,
                data:$scope.api
            }).success(function (data) {
                if(data.code=='code.success'){
                    console.log(data);
                    toastr.success('提交成功');
                    $scope.apiModal = !$scope.apiModal;
                    $scope.query();
                }
            });
        };
        //删除
        $scope.delete=function (id) {
            if (confirm("确认要删除吗")) {
                $http({
                    method: 'POST',
                    url: "hasan/authority/api/delete",
                    data:{id:id}
                }).success(function (data) {
                    if(data.code=='code.success'){
                        toastr.success("删除成功！");
                        $scope.query();
                    }
                });
            }else {
                return;
            }
        }
    }]);
});