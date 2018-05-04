/**
 * Created by sun on 2016/8/4.
 */
define(function (require) {
    var app = require('/../js/app');
    var $ = require('jquery');
    require('ui-table');
    require('bootstrap-fileinput');
    require('upload');
    app.useModule("ngFileUpload");
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
        var goodsEntity = search.newEntity();

        $scope.query=function(reset){
            if(reset){
                search.reset(goodsEntity);
            }
            $http({
                method: 'POST',
                url: "hasan/resource/list",
                data:goodsEntity
            }).success(function(data) {
                console.log(data);
                $scope.cfgBankList=data.attach;
            });
        };
        $scope.query(true);

        // 切换页码时
        $scope.changePages=function(){
            goodsEntity.query.page=$scope.page;
            $scope.query();
        };
        //条件查询
        $scope.search=function(){
            search.reset(goodsEntity);
            if($scope.name)
                search.appendEquals("name",$scope.name,true,goodsEntity);
            search.appendRange(false,false,Date.parse($scope.beginTime)/1000,Date.parse($scope.endTime)/1000,"created",goodsEntity);
            $scope.query();
        };
        //全局查询重置
        $scope.reset=function(){
            $scope.query(true);
        };

        //创建
        $scope.add=function(){
            $scope.isAdd = true;
            $scope.goods={};
            $scope.goodsModal = !$scope.goodsModal ;
        };
        $scope.update = function (shortName) {
            $scope.isAdd = false;
            search.reset(goodsEntity);
            $http({
                method: 'POST',
                url: "manager/config/bank/list",
                data:bankEntity
            }).success(function(data) {
                $scope.bank=data.attach[0];
                $scope.img = $scope.bank.icon;
                $scope.fileInput();
                $scope.bankModal = !$scope.bankModal ;
            });
        };

        $scope.fileChange = function (file) {
            $scope.files = file.files;
            $scope.$apply(); //传播Model的变化。
        };

        $scope.submit = function () {
            for(var i in $scope.banks){
                if($scope.banks[i].value == $scope.bank.code)
                    $scope.bank.name = $scope.banks[i].text;
            }
            if($scope.isAdd){
                if($scope.files){
                    $scope.bank.icon = $scope.files[0];
                    Upload.upload({
                        url:"resource/upload/manager/bank/add",
                        data:$scope.bank
                    }).success(function(data){
                        if(data.code==0){
                            toastr.success("添加成功！");
                            $scope.bankModal = !$scope.bankModal;
                            $scope.query(true);
                        }
                    })
                }else{
                    toastr.error("图片不能为空！");
                }
            }else{
                if($scope.files) {
                    $scope.bank.icon = $scope.files[0];
                }else{
                    $scope.bank.icon = undefined;
                }
                Upload.upload({
                    url:"resource/upload/manager/bank/add",
                    data:$scope.bank
                }).success(function(data){
                    if(data.code==0){
                        toastr.success("更新成功！");
                        $scope.bankModal = !$scope.bankModal;
                        $scope.query(true);
                    }
                })
            }
        };

        $scope.delete = function (shortName) {
            if(confirm("确认要删除吗？")) {
                $http({
                    method: 'POST',
                    url: "manager/config/bank/delete",
                    data: {id: shortName}
                }).success(function (data) {
                    if (data.code == 0) {
                        toastr.success("删除成功！");
                        $scope.query(true);
                    }
                });
            }
        };

        $scope.fileInput = function (){
            $("#icon").fileinput('destroy');
            $("#icon").fileinput({
                language: 'zh', //设置语言
                uploadUrl: '这里目前不需要', // you must set a valid URL here else you will get an error
                allowedFileExtensions : ['jpg', 'png','gif'],
                showUpload: false, //是否显示上传按钮
                maxFileSize: 2000,
                maxFileCount: 5,
                layoutTemplates: {
                    actions: ''
                },//显示的图片布局模版
                msgFilesTooMany: "选择上传的文件数量 超过允许的最大数值！",
                initialPreviewAsData: true,
                initialPreviewFileType: 'image',
                initialPreview: [$scope.img]
            });
        }
    }]);
});