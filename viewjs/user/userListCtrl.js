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
    app.controller('userListCtrl', ['$scope','$http',function ($scope, $http) {
        datepicker($scope);
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
                url: "hasan/user/list",
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

        /*******************客服可分配用列表************************/
        $scope.query2=function(reset){
            if(reset){
                $scope.assistantUserSearchEntity = {"page":1,"pageSize":10,deviceType:2};
            }
            $http({
                method: 'POST',
                url: "hasan/common/allocatable/users",
                data:$scope.assistantUserSearchEntity
            }).success(function(data) {
                console.log(data);
                $scope.userList2=data.attach.list;
                $scope.bigTotalItems2=data.attach.total;
            });
        };
        // 切换页码时
        $scope.changePages2=function(){
            $scope.assistantUserSearchEntity.page=$scope.page2;
            $scope.query2();
        };
        //条件查询
        $scope.search2=function(){
            $scope.query2();
        };
        //全局查询重置
        $scope.reset2=function(){
            $scope.query2(true);
        };
        $scope.assistant = function (uid) {
            $scope.assistantUid = uid;
            $scope.assistantModal = !$scope.assistantModal;
            $http({
                method: 'POST',
                url: "hasan/common/assistant/users",
                data:{assistant:uid,deviceType:2}
            }).success(function(data) {
                console.log(data);
                $scope.assistantUserList=data.attach.list;
                $scope.query2(true);
            });
        };

        $scope.deleteAssistantUser = function (uid) {
            $http({
                method: 'POST',
                url: "hasan/common/assistant/delete",
                data:{id:uid}
            }).success(function(data) {
                console.log(data);
                if(data.code=="code.success"){
                    for(var i in $scope.assistantUserList){
                        if($scope.assistantUserList[i].uid == uid){
                            $scope.assistantUserList.splice(i,1);
                        }
                    }
                    $scope.query2(true);
                }
            });
        };

        //分配用户给客服
        $scope.selectAssistantUser = function (item) {
            $http({
                method: 'POST',
                url: "hasan/common/assistant/allocate",
                data:{assistant:$scope.assistantUid,id:item.uid}
            }).success(function(data) {
                console.log(data);
                if(data.code=="code.success"){
                    $scope.assistantUserList.push(item);
                    $scope.query2(true);
                }
            });
        };

        //用户分配角色
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