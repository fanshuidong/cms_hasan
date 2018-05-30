define(function (require) {
   var app = require('/../js/app');
    require('ui-table');
    var toastr =require('toastr');
    require('upload');
    require('bootstrap-fileinput');
    app.useModule("ui.table");
    app.useModule("ngFileUpload");
    app.controller('bannerCtrl',['$scope','$http','search','Upload','enums','Url',function ($scope,$http,search,Upload,enums,Url) {
        var httpUrl = Url.hasan[window.localStorage.getItem("h_apiUrl")];
        var resource_init = true;
        var link_init = true;
        $scope.cfgResource = enums.cfgResource;
        // banner配置信息
        $scope.query = function (reset) {
            if(reset){
                $scope.resourceSearchEntity = {page:1,pageSize:10};
                $scope.resourceSearchEntity.owner = 0;
            }
            $http({
                method:"POST",
                url:"hasan/resource/list",
                data:$scope.resourceSearchEntity
            }).success(function(data){
                console.log(data);
                $scope.resources=data.attach.list;
                $scope.bigTotalItems=data.attach.total;
            });
        };
        $scope.query(true);
        //取消条件查询
        $scope.reset=function(){
            $scope.cfgId="";
            $scope.ownerId="";
            $scope.query(true)
        };
        $scope.search = function () {
            $scope.resourceSearchEntity.cfgIds = [1,1031,1002];
            if($scope.ownerId){
                $scope.resourceSearchEntity.owner = $scope.ownerId;
            }else{
                $scope.resourceSearchEntity.owner =0;
            }
            if($scope.cfgId){
                $scope.resourceSearchEntity.cfgIds = [];
                $scope.resourceSearchEntity.cfgIds.push($scope.cfgId);
                if(!$scope.ownerId && $scope.cfgId==='1002')
                    delete $scope.resourceSearchEntity.owner;
            }
            $scope.query()
        };

        // 切换页码时
        $scope.changePages=function(){
            $scope.resourceSearchEntity.page=$scope.page;
            $scope.query();
        };

        $scope.openMaxPic= function (url) {
            $scope.MaxPicModal = !$scope.MaxPicModal;
            $scope.url=url
        };
        $scope.curCfgResource = {id:1};
        $scope.add = function () {
            $scope.addViewModal = !$scope.addViewModal;
            $scope.fileInput();
        };
        $scope.update = function (item) {
            $scope.resource = {
                id:item.id,
                name:item.name,
                priority :item.priority
            };
            $scope.editViewModal = !$scope.editViewModal;
        };
        $scope.linkEdit = function (item) {
            $scope.resource = {
                id:item.id,
                link:item.link
            };
            $scope.linkViewModal = !$scope.linkViewModal;
            $scope.fileInputLink(item.id);
        };
        $scope.editInfo = function () {
            $http({
                method:"POST",
                url:"hasan/resource/modify",
                data:$scope.resource
            }).success(function(data){
                if(data.code == "code.success"){
                    toastr.success("修改成功");
                    $scope.editViewModal = !$scope.editViewModal;
                    $scope.query();
                }
            });
        };
        $scope.editLink = function () {
            $http({
                method:"POST",
                url:"hasan/resource/modify",
                data:$scope.resource
            }).success(function(data){
                if(data.code == "code.success"){
                    toastr.success("修改成功");
                    $scope.linkViewModal = !$scope.linkViewModal;
                    $scope.query();
                }
            });
        };
        $scope.editLink2 = function () {
            $scope.linkViewModal = !$scope.linkViewModal;
            $scope.query();
        };
        $scope.delete = function (item) {
            if(confirm("确认删除该条记录吗？")){
                $http({
                    method:"POST",
                    url:"hasan/resource/delete",
                    data:{id:item.id}
                }).success(function(data){
                    if(data.code == "code.success"){
                        toastr.success("删除成功");
                        $scope.query();
                    }
                });
            }
        };

        $scope.fileInput = function (){
            $("#resource").fileinput('destroy');
            $("#resource").fileinput({
                language: 'zh', //设置语言
                uploadUrl: httpUrl+'hasan/resource/upload', // you must set a valid URL here else you will get an error
                uploadExtraData:function(previewId, index) {   //额外参数的关键点
                    var name = $("#"+previewId).find(".file-footer-caption").attr("title");
                    if(name){
                        return {
                            name:name.split(".")[0],
                            priority:index,
                            cfgResourceId:$scope.curCfgResource.id
                        }
                    }
                },
                enctype: 'multipart/form-data',// 上传图片的设置
                allowedFileExtensions : ['jpg', 'png','gif'],
                showUpload: false, //是否显示上传按钮
                showRemove:false, // 是否显示移除按钮
                maxFileSize: 0,
                // maxFileCount: 1,
                overwriteInitial: false, //不覆盖已存在的图片
                // layoutTemplates: {
                //     actions: ''
                // },//显示的图片布局模版
                msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！"
            });
            if(resource_init){
                $("#resource").on("fileuploaded", function (event, data, previewId, index) {
                    if(data.response.code == "code.success"){
                        $scope.addViewModal = !$scope.addViewModal;
                        $scope.query();
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
                resource_init = false;
            }
        };

        $scope.fileInputLink = function (owner){
            $("#link").fileinput('destroy');
            $("#link").fileinput({
                language: 'zh', //设置语言
                uploadUrl: httpUrl+'hasan/resource/upload', // you must set a valid URL here else you will get an error
                uploadExtraData:function(previewId, index) {   //额外参数的关键点
                    var name = $("#"+previewId).find(".file-footer-caption").attr("title");
                    if(name){
                        return {
                            name:name.split(".")[0],
                            priority:index,
                            cfgResourceId:100,
                            owner:owner
                        }
                    }
                },
                enctype: 'multipart/form-data',// 上传图片的设置
                allowedFileExtensions : ['jpg', 'png','gif'],
                showUpload: false, //是否显示上传按钮
                showRemove:false, // 是否显示移除按钮
                maxFileSize: 0,
                maxFileCount: 1,
                overwriteInitial: false, //不覆盖已存在的图片
                msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！"
            });
            if(link_init){
                $("#link").on("fileuploaded", function (event, data, previewId, index) {
                    if(data.response.code == "code.success"){
                        toastr.success("上传成功!");
                        $scope.resource.link = data.response.attach.url;
                        $scope.editLink2();
                        //$scope.linkViewModal = !$scope.linkViewModal;
                    }else{
                        toastr.error(data.response.desc);
                        $("#"+previewId).find(".file-upload-indicator").children(".glyphicon").removeClass("glyphicon-ok-sign");
                        $("#"+previewId).find(".file-upload-indicator").children(".glyphicon").removeClass("text-success");
                        $("#"+previewId).find(".file-upload-indicator").children(".glyphicon").addClass("glyphicon-exclamation-sign");
                        $("#"+previewId).find(".file-upload-indicator").children(".glyphicon").addClass("glyphicon-exclamation-sign");
                        $("#"+previewId).find(".file-upload-indicator").children(".glyphicon").addClass("text-danger");
                    }
                });
                link_init = false;
            }
        };

    }])
});