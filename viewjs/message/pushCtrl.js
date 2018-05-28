/**
 * Created by sun on 2016/8/4.
 */
define(function (require) {
    var app = require('/../js/app');
    require('ui-table');
    var toastr =require('toastr');
    app.useModule("ui.table");
    app.controller('pushCtrl', ['$scope','$http',function ($scope, $http) {
        $scope.message={};
        $scope.pushMessage = function () {
            $http({
                method: 'POST',
                url: "hasan/push/send",
                data:$scope.message
            }).success(function(data) {
                console.log(data);
                if(data.code==='code.success'){
                    toastr.success("推送成功！")
                }
            });
        }
    }]);
});