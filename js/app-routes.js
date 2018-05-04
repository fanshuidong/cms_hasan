define(function (require) {
    var app = require('./app');
    var $=require("jquery");
    require('angular');
    var toastr=require('toastr');
    var datepicker = require('datepicker');

    app.run(['$state', '$stateParams', '$rootScope','$location','$window','$log','$http',
        function ($state, $stateParams, $rootScope,$location,$window,$log,$http) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.path = $location.path();
        $rootScope.userName = window.localStorage.getItem("userName");
        $rootScope.adminId = window.localStorage.getItem("adminId");
        $rootScope.defaultPageSize = 10;
    }]);
    app.controller('AppController', ['$scope','$rootScope', function($scope,$rootScope) {

    }]);
    app.controller('HeaderController', ['$rootScope', '$scope', '$http','$interval','$timeout','$filter',
        function($rootScope, $scope, $http,$interval,$timeout,$filter) {
            //退出
        //     $scope.logout = function() {
        //         $http({
        //             method: 'POST',
        //             url: "manager/logout",
        //             data:{}
        //         }).success(function(data) {
        //             if(data.code==0)
        //                 window.location.href = "login.html";
        //         }).error(function(data) {});
        //     };
        //     $scope.changePsw = function() {
        //         $scope.changeModal = !$scope.changeModal;
        //         $scope.list = {};
        //         $scope.Verification = {};
        //         $scope.Verification.getCodeTest = '获取短信验证码';
        //         $scope.Verification.isTimeOut = false;
        //         $scope.Verification.time = '';
        //     };
        //
        //     $scope.getCode=function(){
        //         $http({
        //             method: 'POST',
        //             url: "/admin/sysUser/modifyMobileSendMessage",
        //             data:{}
        //         }).success(function(data) {
        //             (data);
        //             if(data.result=='success'){
        //
        //                 $scope.Verification.getCodeTest='重新发送';
        //                 $scope.Verification.time=60;
        //                 $scope.Verification.isTimeOut=true;
        //
        //                 $interval(function () {
        //                     if($scope.Verification.time==0){
        //                         $scope.Verification.isTimeOut=false;
        //                         $scope.Verification.getCodeTest='获取短信验证码';
        //                         $scope.Verification.time='';
        //                     }else{
        //                         $scope.Verification.time--;
        //                     }
        //                 },1000);
        //             }else{
        //                 toastr.error('发送失败');
        //                 $scope.Verification.isTimeOut=false;
        //                 $scope.Verification.getCodeTest='获取短信验证码';
        //                 $scope.Verification.time='';
        //             }
        //
        //         }).error(function(data) {
        //             toastr.error('通讯失败')
        //         });
        //     };
        //
        //     $scope.confirm= function () {
        //         $http({
        //             method: 'POST',
        //             url: "/admin/sysuser/modifyPass",
        //             data:{
        //                 newPassword:$scope.list.newPassword,
        //                 mobileCode:$scope.list.mobileCode,
        //             }
        //         }).success(function(data) {
        //             (data);
        //             if(data.result=='success'){
        //                 toastr.success('修改成功');
        //                 $scope.changeModal = !$scope.changeModal;
        //                 $timeout(function () {
        //                     location.reload();
        //                 },1000);
        //
        //             }else{
        //                 toastr.error(data.messageText);
        //                 $scope.Verification.isTimeOut2=false;
        //                 $scope.Verification.getCodeTest2='获取短信验证码';
        //                 $scope.Verification.time2='';
        //             }
        //
        //         }).error(function(data) {});
        //     };
        }

    ]);

    //主页左侧导航栏ctrl
    app.controller('IndexSidebarController', ['$scope','$http', '$rootScope',function($scope,$http,$rootScope) {
        $scope.uiSref = {};
        $scope.resourceIds = [];
        // $http({
        //     method: 'POST',
        //     url: "manager/admin/resource",
        //     data:{}
        // }).success(function(data) {
        //     for(var i=0;i<data.attach.length;i++){
        //         $scope.resourceIds.push(data.attach[i].resourceSort);
        //         if(data.attach[i].parentId === 0){
        //             for(var j=0;j<data.attach.length;j++){
        //                 if(data.attach[j].parentId === data.attach[i].id){
        //                     $scope.uiSref[data.attach[i].resourceCode]='#/'+data.attach[i].resourceCode +'/'+ data.attach[j].resourceUrl;
        //                     break;
        //                 }
        //             }
        //         }
        //     }
        // });
        // $rootScope.show = function(resourceId) {
        //     if($scope.resourceIds.indexOf(resourceId) != -1) {
        //         return true;
        //     } else {
        //         return false;
        //     }
        // }
    }]);
    app.controller('SidebarController', ['$scope','$http', '$rootScope',function($scope,$http,$rootScope) {
    }]);


    app.controller('FooterController', ['$scope', function($scope) {

    }]);

    app.config(['$stateProvider', '$urlRouterProvider',function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('index');
        $stateProvider
            .state("index", {
            	url: "/index",
            	templateUrl: "view/index.html",
                controllerUrl: "viewjs/indexCtrl.js",
                controller: "indexCtrl"
            })
            //订单管理
            .state("order", {
                url: "/order",
                templateUrl: "view/order/order.html"
            })
            .state("order.list", {
                url: "/list",
                templateUrl: "view/order/orderList.html",
                controllerUrl: 'viewjs/order/orderListCtrl.js',
                controller: "orderListCtrl"
            })

            //商品管理
            .state("goods", {
                url: "/goods",
                templateUrl: "view/goods/goods.html"
            })
            .state("goods.list", {
                url: "/list",
                templateUrl: "view/goods/goodsList.html",
                controllerUrl: 'viewjs/goods/goodsListCtrl.js',
                controller: "goodsListCtrl"
            })
            //用户管理
            .state("user", {
                url: "/user",
                templateUrl: "view/user/user.html"
            })
            .state("user.list", {
                url: "/list",
                templateUrl: "view/user/userList.html",
                controllerUrl: 'viewjs/list/userListCtrl.js',
                controller: "userListCtrl"
            })
            .state("user.role", {
                url: "/role",
                templateUrl: "view/user/role.html",
                controllerUrl: 'viewjs/user/roleCtrl.js',
                controller: "roleCtrl"
            })
            .state("user.member", {
                url: "/role",
                templateUrl: "view/user/member.html",
                controllerUrl: 'viewjs/user/memberCtrl.js',
                controller: "memberCtrl"
            })
            //消息管理
            .state("message", {
                url: "/message",
                templateUrl: "view/message/message.html"
            })
            .state("message.push", {
                url: "/push",
                templateUrl: "view/message/push.html",
                controllerUrl: 'viewjs/message/pushCtrl.js',
                controller: "pushCtrl"
            })
            //系统配置
            .state("system", {
                url: "/system",
                templateUrl: "view/system/system.html"
            })
            .state("system.resource", {
                url: "/resource",
                templateUrl: "view/system/resource.html",
                controllerUrl: 'viewjs/system/resourceCtrl.js',
                controller: "resourceCtrl"
            })
    }]);

    app.service("Url",function(){
        this.hasan = {
            zxlUrl:"http://172.16.20.92:8080/",
            fsdUrl:"http://172.16.20.93:8089/",
            online:"http://183.131.205.202/"
        };
    });
    //定义枚举实体
    app.service('enums',function () {
    });
    //日期转化服务
    app.service("DateUtil",function () {
        this.yyyy$MM$dd				= "yyyy/MM/dd";
        this.yyyyMMdd				= "yyyyMMdd";
        this.yyyy_MM_dd				= "yyyy-MM-dd";
        this.yyyyMMMddHHmmss		= "yyyyMMddHHmmss";
        this.YYYY_MM_DD_HH_MM_SS	= "yyyy-MM-dd HH:mm:ss";
        this.HHmmss					= "HHmmss";
        this.HH_mm_ss				= "HH:mm:ss";
        this.getFormateDate = function (date,format) {
            this.year=date.getFullYear();
            this.month=(date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1);
            this.date=date.getDate()<10?"0"+date.getDate():date.getDate();
            this.hour=date.getHours()<10?"0"+date.getHours():date.getHours();
            this.minute=date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();
            this.second=date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds();
            switch (format){
                case this.yyyyMMdd:
                    return this.year+""+this.month+""+this.date;
                default:
                    return this.year+"-"+this.month+"-"+this.date+"   "+this.hour+":"+this.minute+":"+this.second;
            }
        };
    });

    //查询服务
    app.service("search",function(){
        /**************************新版查询***************************/
        this.initSearchEntity=function () {
            return {page:1,pageSize:10};
        };
        this.pushSearchField = function (entity,key,value) {
            entity[key] = value;
            return entity;
        };
        /**************************旧版查询***************************/
        //比较符
        this.comparison = {
            "lt":1,
            "lte":2,
            "gt":4,
            "gte":8,
            "eq":16,
            "neq":32,
            "like":64,
            "in":128,
            "nin":256
        };
        this.searchEntity ={
            "page":1,
            "pageSize":10,
            "lock":false,
            "cols":[],
            "groupBys":[],
            "orderBys":[],
            "conditions":[]
        };
        this.newEntity = function () {
            return {
                "page":1,
                "pageSize":10,
                "lock":false,
                "cols":[],
                "groupBys":[],
                "orderBys":[],
                "conditions":[]
            };
        };
        this.appendSelects = function(col,entity){
            var temp = entity?entity:this.searchEntity;
            temp.cols.push(col)
        };
        this.appendOrder = function(col,order,entity){
            var temp = entity?entity:this.searchEntity;
            temp.orderBys.push({
                "key":col,
                "value":order
            })
        };
        this.appendGroup = function(group,entity){
            var temp = entity?entity:this.searchEntity;
            temp.groupBys.push(group);
        };

        this.addCondition = function(col,comparison,value,entity){
            var temp = entity?entity:this.searchEntity;
            temp.conditions.push({
                "col":col,
                "value":value,
                "comparison":comparison
            });
        };

        this.appendEquals= function(col,value,like,entity){
            if(like)
                this.addCondition(col,this.comparison.like,value,entity);
            else
                this.addCondition(col,this.comparison.eq,value,entity);
        };

        this.appendNotEquals= function(col,value,entity){
            this.addCondition(col,this.comparison.neq,value,entity);
        };

        this.appendRange = function(Include,rInclude,min,max,col,entity){
            if(max)
                this.addCondition(col,this.comparison.lte,max,entity);
            if(min)
                this.addCondition(col,this.comparison.gte,min,entity);
        };
        this.appendIns = function(key,set,entity){
            this.addCondition(key,this.comparison.in,set,entity);
        };

        this.appendNotIns = function(key,set,entity){
            this.addCondition(key,this.comparison.nin,set,entity);
        };

        this.addLimit = function(limit,entity){
            var temp = entity?entity:this.searchEntity;
            temp.limit = limit;
        };

        this.reset = function (entity) {
            if(entity){
                entity = {
                    "page":1,
                    "pageSize":10,
                    "lock":false,
                    "cols":[],
                    "groupBys":[],
                    "orderBys":[],
                    "conditions":[]
                };
            }else{
                this.searchEntity ={
                    "page":1,
                    "pageSize":10,
                    "lock":false,
                    "cols":[],
                    "groupBys":[],
                    "orderBys":[],
                    "conditions":[]
                };
            }
        };

        this.selectAll = function (entity) {
            var temp = entity?entity:this.searchEntity;
            temp.page = 1;
            temp.pageSize = 1000000;
            return temp;
        }
    });

    require('./directive');
    require('./config');
    require('./filter');

});
