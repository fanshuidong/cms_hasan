define(function (require) {
    var app = require('./app');
    var toastr =require('toastr');
    app.factory('httpInterceptor',['$q','$injector','$timeout','Url','$rootScope',function ($q, $injector,$timeout,Url,$rootScope){
        return{
            request:function(config) {
                config.headers = config.headers || {};
                config.headers.token = window.localStorage.getItem("token");
                if(!config.headers.token){
                    window.location.href = "login.html";
                    return;
                }
                if(config.method=="POST"){
                    $rootScope.response = false;
                    setTimeout(function(){
                        if(!$rootScope.response)
                            $('.landmark').addClass('landmark-block');
                    }, 500);
                    config.url = Url.hasan[window.localStorage.getItem("apiUrl")]+config.url;
                    config.data.client = "BROWSER";
                    config.data.usernameType = "MOBILE";
                    config.data.deviceType = "PC";
                    config.data.os = "WINDOWS";
                }
                return config;
            },
            requestError:function(config){
                return $q.reject(config);
            },
            response : function(response){
                if(response.data.code == 110 || response.data.code == 111){
                    window.location.href = "login.html";
                }
                if(response.data.code>0){
                    toastr.error(response.data.desc);
                }
                $rootScope.response = true;
                $('.landmark').removeClass('landmark-block');
                return response;
            },
            responseError : function(response) {
                if(!window.sessionStorage.getItem("token")){
                    return response;
                }
                toastr.error("服务器异常，请稍后再试");
                $rootScope.response = true;
                $('.landmark').removeClass('landmark-block');
                return $q.reject(response);
            }
        }
    }]);

    app.config(['$httpProvider',function ($httpProvider) {
        $httpProvider.defaults.headers.post["Content-Type"] = "application/json";
        $httpProvider.interceptors.push('httpInterceptor');
        $httpProvider.defaults.transformRequest = [function(data) {
            return String(data) !== '[object File]'
                ? JSON.stringify(data)
                : data;
        }];
    }]);
});

