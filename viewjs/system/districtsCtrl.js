/**
 * Created by sun on 2016/8/4.
 */
define(function (require) {
    var app = require('/../js/app');
    require('ui-table');
    require('ztree');
    require('multiselect');
    var toastr =require('toastr');
    app.useModule("ui.table");
    app.controller('districtsCtrl', ['$scope','$http',function ($scope, $http) {
        $scope.setting = {
            view: {
                selectedMulti: false
            },
            check: {
                enable: true,
                chkStyle: "checkbox",
                chkboxType: { "Y": "p", "N": "s" }
            },
            data: {
                key:{
                    name:"name"
                },
                simpleData: {
                    enable: true,
                    idKey:"code",
                    pIdKey:"parent"
                }
            },
            edit: {
                enable: true,
                showRenameBtn: false
            },
            callback: {
                onCheck: zTreeOnCheck
            }
        };

        //获取是所有行政区划
        $http({
            method: 'POST',
            url: "hasan/geo/districts/all",
            data:{}
        }).success(function (data) {
            console.log(data);
            if(data.code == 'code.success'){
                $.fn.zTree.init($("#treeDemo"), $scope.setting, data.attach);
                $http({
                    method: 'POST',
                    url: "hasan/geo/districts",
                    data:{}
                }).success(function (data) {
                    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                    for(var i=0;i<data.attach.length;i++){
                        if(treeObj.getNodeByParam("code",data.attach[i].code))
                            treeObj.checkNode(treeObj.getNodeByParam("code",data.attach[i].code),true);
                    }
                });
            }
        });

        // $scope.updateDistricts = function () {
        //     var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        //     var nodes = treeObj.getCheckedNodes(true);
        //     var codes = [];
        //     for(var i = 0 ; i< nodes.length ;i++)
        //         codes.push(nodes[i].code)
        //     $http({
        //         method: 'POST',
        //         url: "hasan/geo/districts/auth",
        //         data:{codes:codes}
        //     }).success(function (data) {
        //         if(data.code=='code.success'){
        //             console.log(data);
        //             toastr.success('提交成功');
        //             window.location.reload();
        //         }
        //     });
        // };

        function zTreeOnCheck(event, treeId, treeNode) {
            $http({
                method: 'POST',
                url: "hasan/geo/districts/modify",
                data:{id:treeNode.code,valid:treeNode.checked}
            }).success(function (data) {
                if(data.code=='code.success'){
                    console.log(data);
                    //toastr.success('提交成功');
                    //window.location.reload();
                }
            });
        }

    }]);
});