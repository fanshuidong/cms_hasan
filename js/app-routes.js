define(function (require) {
    var app = require('./app');
    var $=require("jquery");
    require('angular');
    var toastr=require('toastr');
    var datepicker = require('datepicker');

    app.run(['$state', '$stateParams', '$rootScope','$location','$window','$log','$http','enums',
        function ($state, $stateParams, $rootScope,$location,$window,$log,$http,enums) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.path = $location.path();
        $rootScope.userName = window.localStorage.getItem("h_userName");
        $rootScope.adminId = window.localStorage.getItem("h_adminId");
        $rootScope.defaultPageSize = 10;
    }]);
    app.controller('AppController', ['$scope','$rootScope', '$http','enums',function($scope,$rootScope,$http,enums) {
        //获取后台系统配置
        $http({
            method: 'POST',
            url:"hasan/common/configs",
            data:{}
        }).success(function(data) {
            $rootScope.GlobalConfig=data.attach;
        });
        //获取后台图片资源配置
        $http({
            method: 'POST',
            url:"hasan/config/resources",
            data:{}
        }).success(function(data) {
            enums.cfgResource = data.attach.list;
            enums.enumConfig.cfgResource = enums.cfgResource;
        });
    }]);
    app.controller('HeaderController', ['$rootScope', '$scope', '$http','$interval','$timeout','$filter',
        function($rootScope, $scope, $http,$interval,$timeout,$filter) {
            //退出
            $scope.logout = function() {
                $http({
                    method: 'POST',
                    url: "hasan/common/logout",
                    data:{}
                }).success(function(data) {
                    if(data.code=="code.success")
                        window.location.href = "login.html";
                }).error(function(data) {});
            };
            $scope.changePsw = function() {
                $scope.changeModal = !$scope.changeModal;
                $scope.list = {};
            };

            $scope.confirm= function () {
                if($scope.list.newPwd != $scope.list.newPassword){
                    toastr.error('两次密码输入不匹配');
                    return;
                }
                $http({
                    method: 'POST',
                    url: "hasan/common/pwd/modify",
                    data:{
                        pwd:$scope.list.newPwd,
                        opwd:$scope.list.oldPwd
                    }
                }).success(function(data) {
                    if(data.code=="code.success"){
                        toastr.success('修改成功');
                        $scope.changeModal = !$scope.changeModal;
                        $timeout(function () {
                            location.reload();
                        },1000);
                    }
                });
            };
        }

    ]);

    //主页左侧导航栏ctrl
    app.controller('IndexSidebarController', ['$scope','$http', '$rootScope','$location',function($scope,$http,$rootScope,$location) {
        $scope.parentResourceList = [];
        $rootScope.resourceMapping = {};
        $http({
            method: 'POST',
            url: "hasan/authority/modular/list/user",
            data:{}
        }).success(function(data) {
            for(var i=0;i<data.attach.length;i++){
                if(data.attach[i].parent === 0){
                    $scope.childrenResourceList = [];
                    for(var j=0;j<data.attach.length;j++){
                        if(data.attach[j].parent === data.attach[i].id){
                            if(!data.attach[i].href){
                                data.attach[i].href = '#/'+data.attach[i].url +'/'+ data.attach[j].url;
                            }
                            if($location.path()==""){
                                var path='/'+data.attach[i].url +'/'+ data.attach[j].url;
                                $location.path(path);
                            }
                            $scope.childrenResourceList.push(data.attach[j]);
                        }
                    }
                    if($scope.childrenResourceList.length>0)
                        $scope.parentResourceList.push(data.attach[i]);
                    $rootScope.resourceMapping["/"+data.attach[i].url] =$scope.childrenResourceList;
                }
            }
            $rootScope.path = $location.path();
        });
        $scope.setPath = function (url) {
            $rootScope.path = url;
        }
    }]);
    app.controller('SidebarController', ['$scope','$http', '$rootScope','$location',function($scope,$http,$rootScope,$location) {
        //获取子模块列表
        $scope.key = $location.path().substring(0,$location.path().lastIndexOf('/'));
        $scope.setPath = function (url) {
            $rootScope.path = $scope.key+"/"+url;
        }
    }]);


    app.controller('FooterController', ['$scope', function($scope) {

    }]);

    app.config(['$stateProvider', '$urlRouterProvider',function ($stateProvider, $urlRouterProvider) {
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
                templateUrl: "view/include/module.html"
            })
            .state("order.list", {
                url: "/list",
                templateUrl: "view/order/orderList.html",
                controllerUrl: 'viewjs/order/orderListCtrl.js',
                controller: "orderListCtrl"
            })
            .state("order.assistant", {
                url: "/assistant",
                templateUrl: "view/order/assistant.html",
                controllerUrl: 'viewjs/order/assistantCtrl.js',
                controller: "assistantCtrl"
            })

            //商品管理
            .state("goods", {
                url: "/goods",
                templateUrl: "view/include/module.html"
            })
            .state("goods.list", {
                url: "/list",
                templateUrl: "view/goods/goodsList.html",
                controllerUrl: 'viewjs/goods/goodsListCtrl.js',
                controller: "goodsListCtrl"
            })
            .state("goods.cookbook", {
                url: "/cookbook",
                templateUrl: "view/goods/cookbook.html",
                controllerUrl: 'viewjs/goods/cookbookCtrl.js',
                controller: "cookbookCtrl"
            })
            //用户管理
            .state("user", {
                url: "/user",
                templateUrl: "view/include/module.html"
            })
            .state("user.list", {
                url: "/list",
                templateUrl: "view/user/userList.html",
                controllerUrl: 'viewjs/user/userListCtrl.js',
                controller: "userListCtrl"
            })
            .state("user.assistantUser", {
                url: "/assistantUser",
                templateUrl: "view/user/assistantUser.html",
                controllerUrl: 'viewjs/user/assistantUserCtrl.js',
                controller: "assistantUserCtrl"
            })
            //消息管理
            .state("message", {
                url: "/message",
                templateUrl: "view/include/module.html"
            })
            .state("message.push", {
                url: "/push",
                templateUrl: "view/message/push.html",
                controllerUrl: 'viewjs/message/pushCtrl.js',
                controller: "pushCtrl"
            })
            //图片管理
            .state("picture", {
                url: "/picture",
                templateUrl: "view/include/module.html"
            })
            .state("picture.banner", {
                url: "/banner",
                templateUrl: "view/picture/banner.html",
                controllerUrl: 'viewjs/picture/bannerCtrl.js',
                controller: "bannerCtrl"
            })
            //系统配置
            .state("system", {
                url: "/system",
                templateUrl: "view/include/module.html"
            })
            .state("system.role", {
                url: "/role",
                templateUrl: "view/system/role.html",
                controllerUrl: 'viewjs/system/roleCtrl.js',
                controller: "roleCtrl"
            })
            .state("system.resource", {
                url: "/resource",
                templateUrl: "view/system/resource.html",
                controllerUrl: 'viewjs/system/resourceCtrl.js',
                controller: "resourceCtrl"
            })
            .state("system.api", {
                url: "/api",
                templateUrl: "view/system/api.html",
                controllerUrl: 'viewjs/system/apiCtrl.js',
                controller: "apiCtrl"
            })
            .state("system.config", {
                url: "/config",
                templateUrl: "view/system/config.html",
                controllerUrl: 'viewjs/system/configCtrl.js',
                controller: "configCtrl"
            })
            .state("system.member", {
                url: "/member",
                templateUrl: "view/system/member.html",
                controllerUrl: 'viewjs/system/memberCtrl.js',
                controller: "memberCtrl"
            })
            .state("system.districts", {
                url: "/districts",
                templateUrl: "view/system/districts.html",
                controllerUrl: 'viewjs/system/districtsCtrl.js',
                controller: "districtsCtrl"
            })
            .state("system.date", {
                url: "/date",
                templateUrl: "view/system/date.html",
                controllerUrl: 'viewjs/system/dateCtrl.js',
                controller: "dateCtrl"
            })
            .state("system.cfgResource", {
                url: "/cfgResource",
                templateUrl: "view/system/cfgResource.html",
                controllerUrl: 'viewjs/system/cfgResourceCtrl.js',
                controller: "cfgResourceCtrl"
            })
    }]);

    app.service("Url",function(){
        this.hasan = {
            zxlUrl:"http://172.16.20.42:8080/",
            fsdUrl:"http://localhost:8089/",
            online:"http://121.196.193.96/"
        };
    });
    //定义枚举实体
    app.service('enums',function () {
        this.goodsResource = [1000,1001,1002];
        this.cookbookResource = [1010,1011];

        this.cfgResource = [
        ];

        this.goodsState = [
            {value:"SALE",text:"出售中",mark:1,color:"green"},
            {value:"OFF_SHELVES",text:"下架",mark:2,color:"red"}
        ];
        this.schedulerType = [
            {value:"PACKAGE",text:"打包",mark:1},
            {value:"DELIVERY",text:"配送",mark:2}
        ];
        this.memberState = [
            {value:true,text:"出售中",mark:1,color:"green"},
            {value:false,text:"下架",mark:2,color:"red"}
        ];
        this.os = [
            {value:"IOS",text:"苹果",mark:1},
            {value:"ANDROID",text:"安卓",mark:2},
            {value:"WINPHONE",text:"winphone",mark:3},
            {value:"WINDOWS",text:"windos系统",mark:4},
            {value:"LINUX",text:"linux系统",mark:5}
        ];
        this.client = [
            {value:"BROWSER",text:"浏览器",mark:1},
            {value:"ORIGINAL",text:"原生(自定义)",mark:2}
        ];
        this.deviceType = [
            {value:"PC",text:"个人电脑",mark:1},
            {value:"MOBILE",text:"手机",mark:2},
            {value:"TABLET",text:"平板",mark:4}
        ];
        this.orderState = [
            {value:"INIT",text:"待支付",mark:1},
            {value:"PAYING",text:"支付中",mark:2},
            {value:"PAID",text:"待发货",mark:3},
            {value:"DELIVERED",text:"待收货",mark:4},
            {value:"RECEIVED",text:"待评价",mark:5},
            {value:"FINISH",text:"已完结",mark:6}
        ];
        this.timeUnit = [
            {value:"SECOND",text:"秒",mark:1},
            {value:"MINUTE",text:"分",mark:2},
            {value:"HOUR",text:"小时",mark:3},
            {value:"DAY",text:"天",mark:4},
            {value:"WEEK",text:"周",mark:5},
            {value:"MONTH",text:"月",mark:6},
            {value:"SEASON",text:"季度",mark:7},
            {value:"YEAR",text:"年",mark:8}
        ];
        this.enumConfig = {
            goodsState:this.goodsState,
            memberState:this.memberState,
            schedulerType:this.schedulerType,
            os:this.os,
            client:this.client,
            deviceType:this.deviceType,
            orderState:this.orderState,
            timeUnit:this.timeUnit,
            cfgResource:this.cfgResource
        };
        this.cuisineType = [
            {value:"主料",text:"主料",mark:1},
            {value:"辅料",text:"辅料",mark:2}
        ];

        this.getEntity = function (key,value) {
            var entity = this.enumConfig[key];
            for(var i =0 ;i<entity.length;i++){
                if(entity[i].value == value || entity[i].mark == value)
                    return entity[i];
            }
        }
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
            var temp = entity?entity:this.searchEntity;
            temp = {
                "page":1,
                "pageSize":10,
                "lock":false,
                "cols":[],
                "groupBys":[],
                "orderBys":[],
                "conditions":[]
            };
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
