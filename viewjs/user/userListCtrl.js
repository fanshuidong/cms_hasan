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
    app.controller('userListCtrl', ['$scope','$http','search',function ($scope, $http,search) {
        datepicker($scope);
        $scope.selectOptions = {
            allowClear: false,
            language : 'zh-CN'
        };
        $scope.maxSize=5;
        var userSearchEntity = search.searchEntity;

        $scope.query=function(reset){
            if(reset){
                userSearchEntity = {"page":1,"pageSize":10}
            }
            $http({
                method: 'POST',
                url: "hasan/user/list",
                data:userSearchEntity
            }).success(function(data) {
                console.log(data);
                $scope.userList=data.attach.list;
                $scope.bigTotalItems=data.attach.total;
            });
        };
        $scope.query(true);
        // 切换页码时
        $scope.changePages=function(){
            userSearchEntity.query.page=$scope.page;
            $scope.query();
        };
        //条件查询
        $scope.search=function(){
            userSearchEntity = {"page":1,"pageSize":10};
            if($scope.uid)
                userSearchEntity.uid = $scope.uid;
            $scope.query();
        };
        //全局查询重置
        $scope.reset=function(){
            $scope.uid = "";
            $scope.query(true);
        };

        $scope.userAuth = function (item) {
            $scope.userAuthModal = !$scope.userAuthModal;
            $scope.userAuthInit(item.uid);
            $('#multiselect1').multiselect({
                keepRenderingSort: true,
                afterMoveToRight:function ($left, $right, $options) {
                    $scope.auth($right);
                },
                afterMoveToLeft:function ($left, $right, $options) {
                    $scope.auth($right);
                }
            });
        };

        /***********multiselect 模块开始************/
        var sid="";
        $scope.userAuthInit = function(uid) {
            sid = uid;
            $http({
                method: 'POST',
                url: "hasan/authority/role/list",
                data:{}
            }).success(function (data) {
                $scope.leftList=data.attach.list;
            });
            $http({
                method: 'POST',
                url: "hasan/authority/role/list/user",
                data:{uid:uid}
            }).success(function (data) {
                $scope.rightList=data.attach.list;
                for(var i=0;i<$scope.leftList.length;i++){
                    for(var j=0;j<$scope.rightList.length;j++){
                        if($scope.rightList[j].id == $scope.leftList[i].id){
                            $scope.leftList.splice(i,1);
                            i--;
                            break;
                        }
                    }
                }
            });
        };
        //分配权限
        $scope.auth = function ($right) {
            var tid = [];
            for(var i = 0;i<$right[0].children.length;i++){
                tid.push(Number($right[0].children[i].value));
            }
            $http({
                method: 'POST',
                async:false,
                url: "hasan/authority/auth/user",
                data:{sid:sid,tid:tid}
            }).success(function (data) {
            });
        }
    }]);
});