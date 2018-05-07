/**
 * Created by sun on 2016/8/4.
 */
define(function (require) {
    var app = require('/../js/app');
    var $ = require('jquery');
    require('ui-table');
    require('bootstrap-fileinput-zh');
    require('bootstrap-fileinput');
    // require('upload');
    // app.useModule("ngFileUpload");
    app.useModule("ui.table");
    var datepicker = require('datepicker');
    var toastr =require('toastr');
    app.controller('goodsListCtrl', ['$scope','$http','search',function ($scope, $http,search) {
        datepicker($scope);
        $scope.selectOptions = {
            allowClear: false,
            language : 'zh-CN'
        };
        $scope.maxSize=5;
        var goodsSearchEntity = search.searchEntity;

        $scope.query=function(reset){
            if(reset){
                search.reset(goodsSearchEntity);
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
            search.reset(goodsSearchEntity);
            if($scope.name)
                search.appendEquals("name",$scope.name,true,goodsSearchEntity);
            // search.appendRange(false,false,Date.parse($scope.beginTime)/1000,Date.parse($scope.endTime)/1000,"created",goodsSearchEntity);
            $scope.query();
        };
        //全局查询重置
        $scope.reset=function(){
            $scope.query(true);
        };

        //创建
        $scope.goods={};
        $scope.add=function(){
            $scope.isAdd = true;
            $scope.addGoodsModal = !$scope.addGoodsModal;
        };
        $scope.update = function (item) {
            $scope.isAdd = false;
            $scope.goods = item;
            $scope.goodsModal = !$scope.goodsModal;
        };

        $scope.submit = function () {
            $http({
                method: 'POST',
                url: $scope.isAdd?"hasan/goods/add":"hasan/goods/modify",
                data:$scope.goods
            }).success(function(data) {
                if (data.code == "code.success") {
                    toastr.success("提交成功！");
                    $scope.query();
                    $("#goodsInfo").hide();
                    $("#uploadPic").show();
                    $("#picTab").click();
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
            $scope.fileInput("icon");
        };
        $scope.fileInput = function (id){
            $("#"+id).fileinput('destroy');
            $("#"+id).fileinput({
                language: 'zh', //设置语言
                uploadUrl: 'http://172.16.20.93:8089/hasan/resource/upload', // you must set a valid URL here else you will get an error
                // uploadExtraData:function(previewId, index) {   //额外参数的关键点
                //     var name = $("#"+previewId).find(".file-footer-caption").attr("title").split('.')[0];
                //     return {
                //         name:name,
                //         cfgResourceId:1
                //     }
                // },
                uploadExtraData:{name:"test",cfgResourceId:2},
                enctype: 'multipart/form-data',// 上传图片的设置
                allowedFileExtensions : ['jpg', 'png','gif'],
                showUpload: false, //是否显示上传按钮
                showRemove:false, // 是否显示移除按钮
                maxFileSize: 2000,
                maxFileCount: 5,
                // layoutTemplates: {
                //     actions: ''
                // },//显示的图片布局模版
                msgFilesTooMany: "选择上传的文件数量 超过允许的最大数值！",
                initialPreviewAsData: true,
                initialPreviewFileType: 'image',
                initialPreview: [$scope.img],
                initialPreviewConfig: [{
                    url: '',// 预展示图片的删除调取路径
                    extra: {id: 100} //调用删除路径所传参数
                }]
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
                    $(".file-error-message").show();
                    $(".file-error-message").text(data.response.desc);
                    $("#"+previewId).find(".file-upload-indicator").children(".glyphicon").removeClass("glyphicon-ok-sign");
                    $("#"+previewId).find(".file-upload-indicator").children(".glyphicon").removeClass("text-success");
                    $("#"+previewId).find(".file-upload-indicator").children(".glyphicon").addClass("glyphicon-exclamation-sign");
                    $("#"+previewId).find(".file-upload-indicator").children(".glyphicon").addClass("glyphicon-exclamation-sign");
                    $("#"+previewId).find(".file-upload-indicator").children(".glyphicon").addClass("text-danger");
                }
            });
        };
        $scope.fileChange = function (file) {
            $scope.files = file.files;
            $scope.$apply(); //传播Model的变化。
        };
        
        $scope.uploadResource = function () {
            var form = new FormData();
            form.append("resource",$('#icon').files[0]);
            form.append("name", $('#rName').val());
            form.append("priority", $('#rPriority').val());
            $http({
                method:'POST',
                url:"hasan/resource/upload",
                data: form,
                headers: {'Content-Type':undefined}
            }).success(function (data) {
                if(data.code==0){
                    toastr.success("上传成功！");
                }
            });
        }

    }]);
});