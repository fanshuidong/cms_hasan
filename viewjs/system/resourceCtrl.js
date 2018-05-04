/**
 * Created by sun on 2016/8/4.
 */
define(function (require) {
    var app = require('/../js/app');
    require('ui-table');
    require('ztree');
    var toastr =require('toastr');
    app.useModule("ui.table");
    app.controller('resourceCtrl', ['$scope','$http','search',function ($scope, $http,search) {
        $scope.setting = {
            view: {
                // addHoverDom: addHoverDom,
                // removeHoverDom: removeHoverDom,
                selectedMulti: false
            },
            check: {
                enable: true
            },
            data: {
                key:{
                    name:"resourceName"
                },
                simpleData: {
                    enable: true,
                    idKey:"id",
                    pIdKey:"parentId"
                }
            },
            edit: {
                enable: true,
                showRenameBtn: false
            },
            callback: {
                beforeRemove:zTreeBeforeRemove,
                onClick: zTreeOnClick

            }
        };

        //删除栏目节点前的操作
        function zTreeBeforeRemove(treeId, treeNode) {
            if(confirm("确认要删除该栏目以及其子栏目吗？")){
                var ids = [];
                ids.push(treeNode.id);
                if(treeNode.isParent)
                    for(var i = 0 ;i<treeNode.children.length;i++)
                        ids.push(treeNode.children[i].id);
                $http({
                    method: 'POST',
                    url: "manager/resource/delete",
                    data:{ids:ids}
                }).success(function (data) {
                    if(data.code == 0){
                        toastr.success("删除成功");
                        return true;
                    }else{
                        return false;
                    }
                });
            }else{
                return false;
            }
        }

        //获取后台栏目列表
        var resources = [];
        var resourceEntity = search.newEntity();
        search.appendOrder("resource_sort","true",resourceEntity);
        $http({
            method: 'POST',
            url: "manager/resource/list",
            data:resourceEntity
        }).success(function (data) {
            console.log(data);
            if(data.code == 0){
                for(var i = 0;i<data.attach.length;i++){
                    var resource = data.attach[i];
                    if(resource.parentId == 0){
                        resource.isParent = true;
                    }
                    resources.push(resource);
                }
                $(document).ready(function () {
                    $.fn.zTree.init($("#treeDemo"), $scope.setting, resources);
                });
            }
        });
        var selectedNode;
        function zTreeOnClick(event,treeId,treeNode) {
            selectedNode = {
                id:treeNode.id,
                resourceCode:treeNode.resourceCode,
                resourceName:treeNode.resourceName,
                resourceType:treeNode.resourceType,
                resourceUrl:treeNode.resourceUrl,
                parentId:treeNode.parentId==null?0:treeNode.parentId,
                resourceSort:treeNode.resourceSort
            };
            $("#id").val(selectedNode.id);
            $("#resourceName").val(selectedNode.resourceName);
            $("#parentId").val(selectedNode.parentId);
            $("#resourceUrl").val(selectedNode.resourceUrl);
            $("#resourceSort").val(selectedNode.resourceSort);
            $("#resource").show();
        }

        //提交修改
        $scope.resourceModify = function(){
            selectedNode.resourceName = $("#resourceName").val();
            selectedNode.parentId = $("#parentId").val();
            selectedNode.resourceUrl = $("#resourceUrl").val();
            selectedNode.resourceSort = $("#resourceSort").val();
            $http({
                method: 'POST',
                url: "manager/resource/modify",
                data: selectedNode
            }).success(function(data) {
                console.log(data);
                if(data.code==0){
                    toastr.success("提交成功");
                    window.location.reload();
                }
            });
        };
        $scope.resourceAdd = function () {
            $scope.resourceAddModal = !$scope.resourceAddModal
        };
        $scope.add = {};
        $scope.resourceAddSubmit = function () {
            $scope.add.resourceCode = $scope.add.resourceUrl;
            $scope.add.resourceType = 1;
            $http({
                method: 'POST',
                url: "manager/resource/modify",
                data: $scope.add
            }).success(function(data) {
                console.log(data);
                if(data.code==0){
                    toastr.success("提交成功");
                    window.location.reload();
                }
            });
        }
    }]);
});