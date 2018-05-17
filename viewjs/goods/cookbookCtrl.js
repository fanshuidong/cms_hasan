/**
 * Created by sun on 2016/8/4.
 */
define(function (require) {
    var app = require('/../js/app');
    var $ = require('jquery');
    require('ui-table');
    app.useModule("ui.table");
    var datepicker = require('datepicker');
    var toastr =require('toastr');
    var bootbox =require('bootbox');
    require('bootstrap-fileinput-zh');
    app.controller('cookbookCtrl', ['$scope','$http','search','enums','Url',function ($scope, $http,search,enums,Url) {
        var httpUrl = Url.hasan[window.localStorage.getItem("h_apiUrl")];
        $scope.cuisineType = enums.cuisineType;
        //获取菜谱图片上传类型
        $http({
            method: 'POST',
            url:"hasan/resource/configs",
            data:{ids:enums.cookbookResource}
        }).success(function(data) {
            $scope.cfgCookbookResource=data.attach;
        });
        //获取商品列表
        $http({
            method: 'POST',
            url: "hasan/goods/list",
            data:{}
        }).success(function(data) {
            $scope.goodsList=data.attach.list;
        });
        //获取菜谱图片上传类型
        $http({
            method: 'POST',
            url:"hasan/resource/configs",
            data:{ids:enums.cookbookResource}
        }).success(function(data) {
            $scope.cfgCookbookResource=data.attach;
        });
        datepicker($scope);
        $scope.maxSize=5;

        $scope.query=function(reset){
            if(reset){
                $scope.cookbookSearchEntity = {"page":1,"pageSize":10}
            }
            $http({
                method: 'POST',
                url: "hasan/cookbook/list",
                data:$scope.cookbookSearchEntity
            }).success(function(data) {
                console.log(data);
                $scope.cookbookList=data.attach.list;
                $scope.bigTotalItems=data.attach.total;
            });
        };
        $scope.query(true);

        // 切换页码时
        $scope.changePages=function(){
            $scope.cookbookSearchEntity.page=$scope.page;
            $scope.query();
        };
        //条件查询
        $scope.search=function(){
            // search.appendRange(false,false,Date.parse($scope.beginTime)/1000,Date.parse($scope.endTime)/1000,"created",goodsSearchEntity);
            $scope.query();
        };
        //全局查询重置
        $scope.reset=function(){
            $scope.query(true);
        };
        //创建
        $scope.add=function(){
            $scope.isAdd = true;
            $("#cookbookInfo").show();
            $("#uploadPic").hide();
            $("#cookbook").click();
            // $scope.text = {"goods":[1,2],"cuisineGroups":[{"name":"主料","cuisines":[{"name":"螃蟹","dosage":"1斤"}]},{"name":"辅料","cuisines":[{"name":"大蒜","dosage":"1瓣"},{"name":"洋葱","dosage":"1颗"}]}]};
            $scope.cookbook = {"goods":[],"cuisineGroups":[]};
            //$scope.cuisineGroup = {name:"",cuisines:[]};//菜肴
            //$scope.cuisine = {};
            $scope.cookbookResource=[];
            $scope.cookbookModal = !$scope.cookbookModal;
        };
        //更新
        $scope.update = function (item) {
            $scope.isAdd = false;
            $("#cookbookInfo").show();
            $("#uploadPic").show();
            $scope.cookbook = {
                id:item.id,name:item.name,goods:JSON.parse(item.text).goods,cuisineGroups:JSON.parse(item.text).cuisineGroups
            };
            $scope.cookbookModal = !$scope.cookbookModal;
            $http({
                method: 'POST',
                url:"hasan/resource/list",
                data:{cfgIds:enums.cookbookResource,owner:$scope.cookbook.id}
            }).success(function(data) {
                $scope.cookbookResource=data.attach.list;
                $scope.initFileInput();
            });
        };

        $scope.submit = function () {
            if(confirm("确认提交吗？")) {
                $http({
                    method: 'POST',
                    url: $scope.isAdd?"hasan/cookbook/add":"hasan/cookbook/modify",
                    data:$scope.cookbook
                }).success(function(data) {
                    if (data.code == "code.success") {
                        toastr.success("提交成功！");
                        $scope.cookbook.id = data.attach;
                        $scope.query();
                        if($scope.isAdd){
                            $("#cookbookInfo").hide();
                            $("#uploadPic").show();
                            $("#picTab").click();
                            $scope.initFileInput();
                        }
                    }
                });
            }
        };

        $scope.delete = function (id) {
            if(confirm("确认要删除吗？")) {
                $http({
                    method: 'POST',
                    url: "hasan/cookbook/delete",
                    data: {id: id}
                }).success(function (data) {
                    if (data.code == "code.success") {
                        toastr.success("删除成功！");
                        $scope.query(true);
                    }
                });
            }
        };

        //添加食材分类
        $scope.addCuisineType = function () {
            $scope.cookbook.cuisineGroups.push({name:"",cuisines:[{name:"",dosage:""}]});
        };
        //删除食材分类
        $scope.deleteCuisineType = function (i) {
            $scope.cookbook.cuisineGroups.splice(i,1);
        };
        //添加食材
        $scope.addCuisine = function (i) {
            $scope.cookbook.cuisineGroups[i].cuisines.push({name:"",dosage:""});
        };
        //删除食材
        $scope.deleteCuisine = function (i,j) {
            $scope.cookbook.cuisineGroups[i].cuisines.splice(j,1)
        };

        //初始化图片上传插件
        $scope.initFileInput = function () {
            for(var i= 0 ; i<$scope.cfgCookbookResource.length; i++){
                var initialPreviewConfig = [];
                var initialPreview = [];
                if($scope.cookbookResource){//编辑有初始化图片
                    for(var index in $scope.cookbookResource){
                        if($scope.cookbookResource[index].cfgId == $scope.cfgCookbookResource[i].id){
                            initialPreviewConfig.push({
                                caption:$scope.cookbookResource[index].name,
                                key:httpUrl+'hasan/resource/delete/form',
                                extra:{id:$scope.cookbookResource[index].id}

                            });
                            initialPreview.push($scope.cookbookResource[index].url);
                        }
                    }
                }
                $scope.fileInput($scope.cfgCookbookResource[i].id,$scope.cfgCookbookResource[i].maxinum,$scope.cfgCookbookResource[i].cacheSize*1024
                                 ,initialPreview,initialPreviewConfig);
            }
        };
        $scope.fileInput = function (id,maxinum,size,initialPreview,initialPreviewConfig){
            $("#"+id).fileinput('destroy');
            $("#"+id).fileinput({
                language: 'zh', //设置语言
                uploadUrl: httpUrl+'hasan/resource/upload', // you must set a valid URL here else you will get an error
                uploadExtraData:function(previewId, index) {   //额外参数的关键点
                    var name = $("#"+previewId).find(".file-footer-caption").attr("title");
                    if(name){
                        return {
                            name:name.split(".")[0],
                            priority:index,
                            cfgResourceId:id,
                            owner:$scope.cookbook.id
                        }
                    }
                },
                enctype: 'multipart/form-data',// 上传图片的设置
                allowedFileExtensions : ['jpg', 'png','gif'],
                showUpload: false, //是否显示上传按钮
                showRemove:false, // 是否显示移除按钮
                maxFileSize: size,
                maxFileCount: maxinum,
                overwriteInitial: false, //不覆盖已存在的图片
                // layoutTemplates: {
                //     actions: ''
                // },//显示的图片布局模版
                msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
                initialPreviewAsData: true,
                initialPreviewFileType: 'image',
                initialPreview: initialPreview,
                initialPreviewConfig: initialPreviewConfig
            });
            $("#"+id).on("fileuploaded", function (event, data, previewId, index) {
                console.log(data);
                if(data.response.code == "code.success"){
                    toastr.success("上传成功！");
                    $("#"+previewId).find(".kv-file-remove").click(function(){
                        $http({
                            method: 'POST',
                            url: "hasan/resource/delete",
                            data: {id: data.response.attach.id}
                        }).success(function (data) {
                            if (data.code == "code.success") {
                                toastr.success("删除成功！");
                            }
                        });
                    });
                }else{
                    toastr.error(data.response.desc);
                    // $(".file-error-message").show();
                    // $(".file-error-message").text(data.response.desc);
                    $("#"+previewId).find(".file-upload-indicator").children(".glyphicon").removeClass("glyphicon-ok-sign");
                    $("#"+previewId).find(".file-upload-indicator").children(".glyphicon").removeClass("text-success");
                    $("#"+previewId).find(".file-upload-indicator").children(".glyphicon").addClass("glyphicon-exclamation-sign");
                    $("#"+previewId).find(".file-upload-indicator").children(".glyphicon").addClass("glyphicon-exclamation-sign");
                    $("#"+previewId).find(".file-upload-indicator").children(".glyphicon").addClass("text-danger");
                }
            });
        };
    }]);
});