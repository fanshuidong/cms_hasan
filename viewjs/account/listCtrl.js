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
    app.controller('listCtrl', ['$scope','$http','enums',function ($scope, $http,enums) {
        datepicker($scope);
        $scope.accountType = enums.accountType;
        $scope.selectOptions = {
            allowClear: false,
            language : 'zh-CN'
        };
        $scope.maxSize=5;
        $scope.userSearchEntity = {"page":1,"pageSize":10};
        $scope.query=function(reset){
            if(reset){
                $scope.userSearchEntity = {"page":1,"pageSize":10}
            }
            $http({
                method: 'POST',
                url: "hasan/account/list",
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
            $scope.userSearchEntity.page=$scope.page;
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

        $scope.openAdjustModal = function (item) {
            $scope.adjust={
                owner:item.owner,
                type:enums.getEntity("accountType",item.type).value,
                ownerType:enums.getEntity("ownerType",item.ownerType).value
            };
            $scope.adjustModal = !$scope.adjustModal;
        };

        $scope.validate = function () {
            if($scope.adjust.amount && !Number($scope.adjust.amount)){
                $scope.amountError = "请输入正确的金额";
            }else{
                $scope.amountError="";
            }
        };

        $scope.adjust_ = function () {
            if(!Number($scope.adjust.amount)){
                toastr.error("请输入正确的金额");
                return;
            }
            $http({
                method: 'POST',
                url: "hasan/account/adjust",
                data:$scope.adjust
            }).success(function(data) {
                if(data.code==='code.success'){
                    toastr.success("提交成功！");
                    $scope.adjustModal = !$scope.adjustModal;
                    $scope.query();
                }
            });
        }
    }]);
});