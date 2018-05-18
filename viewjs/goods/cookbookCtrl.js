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
            url:"hasan/config/resources",
            data:{ids:enums.cookbookResource}
        }).success(function(data) {
            $scope.cfgCookbookResource=data.attach.list;
        });
        //获取菜谱步骤图片上传类型
        $http({
            method: 'POST',
            url:"hasan/config/resources",
            data:{ids:[1020]}
        }).success(function(data) {
            $scope.cfgStepResource=data.attach.list;
        });
        //获取商品列表
        $http({
            method: 'POST',
            url: "hasan/goods/list",
            data:{}
        }).success(function(data) {
            $scope.goodsList=data.attach.list;
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
            $("#editStep").hide();
            $("#cookbook").click();
            // $scope.text = {"goods":[1,2],"cuisineGroups":[{"name":"主料","cuisines":[{"name":"螃蟹","dosage":"1斤"}]},{"name":"辅料","cuisines":[{"name":"大蒜","dosage":"1瓣"},{"name":"洋葱","dosage":"1颗"}]}]};
            $scope.cookbook = {"goods":[],"cuisineGroups":[]};
            //$scope.cuisineGroup = {name:"",cuisines:[]};//菜肴
            //$scope.cuisine = {};
            $scope.cookbookResource=[];
            $scope.steps=[];
            $scope.cookbookModal = !$scope.cookbookModal;
        };
        //更新
        $scope.update = function (item) {
            $scope.isAdd = false;
            $("#cookbookInfo").show();
            $("#uploadPic").show();
            $("#editStep").show();
            $scope.cookbook = {
                id:item.id,name:item.name,goods:JSON.parse(item.text).goods,cuisineGroups:JSON.parse(item.text).cuisineGroups
            };
            $scope.cookbookModal = !$scope.cookbookModal;
            $http({
                method: 'POST',
                url:"hasan/cookbook/detail",
                data:{id:item.id}
            }).success(function(data) {
                console.log(data);
                $scope.cookbookResource=data.attach.images;
                $scope.steps=data.attach.steps;
                $scope.initFileInput($scope.cfgCookbookResource,$scope.cookbookResource,item.id);
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
                        $scope.query();
                        if($scope.isAdd){
                            $scope.cookbook.id = data.attach;
                            $("#cookbookInfo").hide();
                            $("#uploadPic").show();
                            $("#editStep").show();
                            $("#picTab").click();
                            $scope.initFileInput($scope.cfgCookbookResource,null,$scope.cookbook.id);
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

        //添加步骤
        $scope.addStep = function () {
            $scope.steps.push({name:"",content:"",priority:"",cookbookId:$scope.cookbook.id});
        };
        //新增修改步骤基础属性
        $scope.stepInfoEdit = function (i) {
            $http({
                method: 'POST',
                url: $scope.steps[i].id?"hasan/cookbook/step/modify":"hasan/cookbook/step/add",
                data: $scope.steps[i]
            }).success(function (data) {
                if (data.code == "code.success") {
                    toastr.success("提交成功！");
                    if(!$scope.steps[i].id)
                        $scope.steps[i].id = data.attach;
                }
            });
        };
        $scope.stepImagesEdit = function (i) {
            if($scope.steps[i].id){
                $http({
                    method: 'POST',
                    url:"hasan/cookbook/detail",
                    data:{id:$scope.cookbook.id}
                }).success(function(data) {
                    $scope.initFileInput($scope.cfgStepResource,data.attach.steps[i].image,$scope.steps[i].id);
                });
                $scope.stepImagesModal = !$scope.stepImagesModal;
            }else{
                toastr.error("请先提交该步骤基础数据");
            }
        };
        //删除步骤
        $scope.deleteStep = function (i) {
            if($scope.steps[i].id){
                if(confirm("确认要删除吗？")) {
                    $http({
                        method: 'POST',
                        url: "hasan/cookbook/step/delete",
                        data: {id: $scope.steps[i].id}
                    }).success(function (data) {
                        if (data.code == "code.success") {
                            toastr.success("删除成功！");
                            $scope.steps.splice(i,1);
                        }
                    });
                }
            }else{
                $scope.steps.splice(i,1);
            }
        };


        //初始化图片上传插件
        $scope.initFileInput = function (cfgResource,resource,owner) {
            for(var i= 0 ; i<cfgResource.length; i++){
                var initialPreviewConfig = [];
                var initialPreview = [];
                if(resource){//编辑有初始化图片
                    for(var index in resource){
                        if(resource[index].cfgId == cfgResource[i].id){
                            initialPreviewConfig.push({
                                caption:resource[index].name,
                                key:httpUrl+'hasan/resource/delete/form',
                                extra:{id:resource[index].id}

                            });
                            initialPreview.push(resource[index].url);
                        }
                    }
                }
                $scope.fileInput(cfgResource[i].id,cfgResource[i].maxinum,cfgResource[i].cacheSize*1024
                                 ,initialPreview,initialPreviewConfig,owner);
            }
        };
        $scope.fileInput = function (id,maxinum,size,initialPreview,initialPreviewConfig,owner){
            $("#"+id).fileinput('destroy').fileinput({
                language: 'zh', //设置语言
                uploadUrl: httpUrl+'hasan/resource/upload', // you must set a valid URL here else you will get an error
                uploadExtraData:function(previewId, index) {   //额外参数的关键点
                    var name = $("#"+previewId).find(".file-footer-caption").attr("title");
                    if(name){
                        return {
                            name:name.split(".")[0],
                            priority:index,
                            cfgResourceId:id,
                            owner:owner
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
            }).on("fileuploaded", function (event, data, previewId, index) {
                console.log(data);
                if(data.response.code == "code.success"){
                    // toastr.success("上传成功！");
                    $("#"+previewId).find(".kv-file-remove").click(function(){
                        $http({
                            method: 'POST',
                            url: "hasan/resource/delete",
                            data: {id: data.response.attach.id}
                        }).success(function (data) {
                            if (data.code == "code.success") {
                                // toastr.success("删除成功！");
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