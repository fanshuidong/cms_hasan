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
    require('bootstrap-fileinput-zh');
    app.controller('goodsListCtrl', ['$scope','$http','search','enums',function ($scope, $http,search,enums) {
        //获取菜谱列表
        $http({
            method: 'POST',
            url:"hasan/cookbook/list",
            data:{page:1,pageSize:1000}
        }).success(function(data) {
            $scope.cookbooks=data.attach.list;
        });
        //获取商品图片上传类型
        $http({
            method: 'POST',
            url:"hasan/resource/configs",
            data:{ids:enums.goodsResource}
        }).success(function(data) {
            $scope.cfgGoodsResource=data.attach;
        });
        datepicker($scope);
        $scope.selectOptions = {
            allowClear: false,
            language : 'zh-CN'
        };
        $scope.maxSize=5;
        var goodsSearchEntity = search.searchEntity;

        $scope.query=function(reset){
            if(reset){
                goodsSearchEntity = {"page":1,"pageSize":10}
            }
            $http({
                method: 'POST',
                url: "hasan/goods/list",
                data:goodsSearchEntity
            }).success(function(data) {
                console.log(data);
                $scope.goodsList=data.attach.list;
                $scope.bigTotalItems=data.attach.total;
            });
        };
        $scope.query(true);

        // 切换页码时
        $scope.changePages=function(){
            goodsSearchEntity.query.page=$scope.page;
            $scope.query();
        };
        //条件查询
        $scope.search=function(){
            goodsSearchEntity = {"page":1,"pageSize":10};
            if($scope.name)
                goodsSearchEntity.name = $scope.name;
            // search.appendRange(false,false,Date.parse($scope.beginTime)/1000,Date.parse($scope.endTime)/1000,"created",goodsSearchEntity);
            $scope.query();
        };
        //全局查询重置
        $scope.reset=function(){
            $scope.name = "";
            $scope.query(true);
        };

        //创建
        $scope.goods={};
        $scope.add=function(){
            $("#goodsInfo").show();
            $("#uploadPic").hide();
            $("#goods").click();
            $scope.isAdd = true;
            $scope.goodsResource=[];
            $scope.addGoodsModal = !$scope.addGoodsModal;
        };
        $scope.update = function (item) {
            $scope.isAdd = false;
            $("#goodsInfo").show();
            $("#uploadPic").show();
            $scope.goods = item;
            $scope.addGoodsModal = !$scope.addGoodsModal;
            $http({
                method: 'POST',
                url:"hasan/resource/list",
                data:{cfgIds:enums.goodsResource,owner:$scope.goods.id}
            }).success(function(data) {
                $scope.goodsResource=data.attach.list;
                $scope.initFileInput();
            });
        };

        //上下架
        $scope.offShelves = function (item) {
            item.state = item.state=='SALE'?'OFF_SHELVES':'SALE';
            $http({
                method: 'POST',
                url: "hasan/goods/modify",
                data:item
            }).success(function(data) {
                if (data.code == "code.success") {
                    toastr.success("提交成功！");
                    $scope.query();
                }
            });
        };

        $scope.submit = function () {
            $http({
                method: 'POST',
                url: $scope.isAdd?"hasan/goods/add":"hasan/goods/modify",
                data:$scope.goods
            }).success(function(data) {
                if (data.code == "code.success") {
                    toastr.success("提交成功！");
                    $scope.goods.id = data.attach;
                    $scope.query();
                    if($scope.isAdd){
                        $("#goodsInfo").hide();
                        $("#uploadPic").show();
                        $("#picTab").click();
                        $scope.initFileInput();
                    }
                }
            });
        };

        $scope.delete = function (id) {
            if(confirm("确认要删除吗？")) {
                $http({
                    method: 'POST',
                    url: "hasan/goods/delete",
                    data: {id: id}
                }).success(function (data) {
                    if (data.code == "code.success") {
                        toastr.success("删除成功！");
                        $scope.query(true);
                    }
                });
            }
        };
        //初始化图片上传插件
        $scope.initFileInput = function () {
            for(var i= 0 ; i<$scope.cfgGoodsResource.length; i++){
                var initialPreviewConfig = [];
                var initialPreview = [];
                if($scope.goodsResource){//编辑有初始化图片
                    for(var index in $scope.goodsResource){
                        if($scope.goodsResource[index].cfgId == $scope.cfgGoodsResource[i].id){
                            initialPreviewConfig.push({
                                caption:$scope.goodsResource[index].name,
                                key:'http://172.16.20.93:8089/hasan/resource/deleteByAjax',
                                extra:{id:$scope.goodsResource[index].id}

                            });
                            initialPreview.push($scope.goodsResource[index].url);
                        }
                    }
                }
                $scope.fileInput($scope.cfgGoodsResource[i].id,$scope.cfgGoodsResource[i].maxinum,$scope.cfgGoodsResource[i].cacheSize*1024
                                 ,initialPreview,initialPreviewConfig);
            }
        };
        $scope.fileInput = function (id,maxinum,size,initialPreview,initialPreviewConfig){
            $("#"+id).fileinput('destroy');
            $("#"+id).fileinput({
                language: 'zh', //设置语言
                uploadUrl: 'http://172.16.20.93:8089/hasan/resource/upload', // you must set a valid URL here else you will get an error
                uploadExtraData:function(previewId, index) {   //额外参数的关键点
                    var name = $("#"+previewId).find(".file-footer-caption").attr("title");
                    if(name){
                        return {
                            name:name.split(".")[0],
                            priority:index,
                            cfgResourceId:id,
                            owner:$scope.goods.id
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