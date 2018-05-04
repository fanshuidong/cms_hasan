define(function (require) {

    var angular = require('angular');
    var toastr=require('toastr')

    angular.module('ui.table', []);
    angular.module('ui.table').controller('uiTableController', ['$scope', '$attrs', '$element','$compile','$parse','$http',
        function($scope, $attrs, $element,$compile,$parse,$http) {

            var isFirstTimeLoad = true;
            $scope.$filterRow = {};
            $scope.$loading = false;
            var name=$attrs.uiTable;

            this.compileDirectiveTemplates = function (columns) {
                $element.addClass("");
                var theadFound = false;
                angular.forEach($element.children(), function(e) {
                    if (e.tagName === 'THEAD') {
                        theadFound = true;
                    }
                });
                if (!theadFound) {
                    headerTemplate = angular.element(document.createElement('thead'));
                    var headRow=angular.element(document.createElement("tr"));
                    angular.forEach(columns, function(item) {
                        var th=angular.element(document.createElement('th'));
                        th.html(item.title);
                        headRow.append(th);
                    });
                    headerTemplate.append(headRow);
                    $element.prepend(headerTemplate);
                }
                $scope.separate='...';
                var paginationTemplate = angular.element(document.createElement('div'));
                paginationTemplate.addClass("page-list");
                paginationTemplate.html("<ul class='pagination' style='display:inline-block;' ng-show='settings().$page.total>0' >"+
                        "<span style='line-height:32px;float:left'> 共有{{settings().$page.total}}条，每页显示：10条&nbsp;&nbsp;&nbsp;&nbsp;</span>"+
                    "<li ng-class='{disabled:settings().$page.pageNum==1}' ng-click='prevPage()'><span style='position:static'>&lt;</span></li>"+
                    "<li ng-repeat='item in settings().$page.navigatepageNums track by $index' ng-class='{active:item==settings().$page.currentPage,separate:item==separate}' ng-click='changeCurrentPage(item)'>"+
                    "<span style='position:static'>{{item}}</span>"+
                    "</li>"+
                    "<li ng-class='{disabled:settings().$page.pageNum==settings().$page.lastPage}' ng-click='nextPage()'><span style='position:static'>&gt;</span></li>"+
                    //"&nbsp;&nbsp;共&nbsp;<input style='height:32px;background:#f4f6f9' type='text' ng-model='settings().$page.lastPage' readonly disabled>&nbsp;页"+

                    "<span class='pageNum' ng-show='settings().$page.total>0'>"+
                    "&nbsp;&nbsp;<input name='input1' style='height:32px;border-radius: 0' type='number' ng-model='settings().pageParam.pageNum' />&nbsp;&nbsp;<button style='height:30px;border-radius: 0' class='bttn' ng-click='jumpToPage()'>GO</button>"+
                    "</span>"+
                    "</ul>"+
                    "<div class='no-items no-data' ng-show='settings().$page.total<=0'>无相关数据</div>");
                $element.after(paginationTemplate);
                $compile(paginationTemplate)($scope);
            };
            $scope.nextPage=function(){
                var name=$attrs.uiTable;
                var pageNext = $scope[name].pageParam.pageNum;
                $scope[name].pageParam.pageNum = pageNext == $scope[name].pageParam.lastPage ? pageNext : pageNext+1;
                $scope[name].requestData();
            }
            $scope.prevPage=function(){
                var name=$attrs.uiTable;
                var pagePre = $scope[name].pageParam.pageNum;
                $scope[name].pageParam.pageNum= pagePre==1 ? pagePre : pagePre-1;
                $scope[name].requestData();
            }
            /*$scope.jumpToPage=function(){
                var name=$attrs.uiTable;
                //alert($scope[name].jumpPageNum);
                $scope[name].pageParam.pageNum=$scope[name].jumpPageNum;
                $scope[name].requestData();
            }*/
            $scope.changeCurrentPage=function(pageNum){
                //alert(pageNum);
                var name=$attrs.uiTable;
                $scope[name].pageParam.pageNum=pageNum;
                $scope[name].requestData();
            }
            $scope.jumpToPage=function(){
            	var input1 = $("input[name='input1']").val();
            	var pages = $scope[name].pageParam.pages;
            	if(input1 < 1){
            		$("input[name='input1']").val("1");
            		$scope[name].pageParam.pageNum=1;
            	}
            	if(input1 >= pages){
            		$("input[name='input1']").val(pages);
            		$scope[name].pageParam.pageNum=pages;
            	}
                $scope[name].requestData();
            }
            $scope[name].reload=function(){
                $scope[name].requestData();
            }
            $scope.settings=function(){
                return $scope[name];
            }
            this.getParam=function(){
                var tableParamsGetter = $parse($attrs.uiTable);
                var name=$attrs.uiTable;
                var localParams={};
                $scope.$watch(tableParamsGetter, (function (params) {
                    if (angular.isUndefined(params)) {
                        return;
                    }
                    $scope.paramsModel = tableParamsGetter;
                    $scope[name] = params;
                }), false);
                var ajaxParam=$scope[name].query||{};
                var pageParam=$scope[name].page||{};
                var defaultPageParam={
                    pageSize:10,
                    pageNum:1
                };
                angular.extend(ajaxParam,$scope[name].ajax||{});
                angular.extend(pageParam,$scope[name].page||defaultPageParam);
                //console.log($scope[name]);
                $scope[name].ajaxParam=ajaxParam;
                $scope[name].pageParam=pageParam;
                //console.log($scope[name])
            }

            this.requestData=$scope[name].requestData=function(){
               $('.landmark').css('display','block');
                var name=$attrs.uiTable;
                //console.log($scope[name]);
                if(!angular.isDefined( $scope[name].ajaxParam)){
                    $scope[name].ajaxParam={};
                }
                $scope[name].ajaxParam.pageSize=$scope[name].pageParam.pageSize;
                $scope[name].ajaxParam.pageNum=$scope[name].pageParam.pageNum;
                $http({
                    method: 'POST',
                    url:$scope[name].url,
                    data: $scope[name].ajaxParam,
                }).success(function(data) {
                    $scope[name].$page=data.paginator;
                    $scope[name].pageParam=angular.copy(data.paginator);
                    $scope[name].$rows=data.list;

                    $('.landmark').css('display','none');


                    if(data.result=='fail'){
                        toastr.error('系统错误')
                    }

                }).error(function(data, status, headers, pgconfig) {
                    toastr.error('系统错误')
                });
            }
        }]);
    angular.module("ui.table").directive("uiTable", function () {
        return {
            restrict: 'A',
            priority: 1001,
            scope: true,
            controller: 'uiTableController',
            //templateUrl: 'temp.html',
            compile: function(element, attrs) {
                var columns = [],
                    i = 0,
                    dataRow,
                    groupRow,
                    rows = [];
                angular.forEach(element.find('tr'), function(tr) {
                    rows.push(angular.element(tr))
                });
                if (!rows) {
                    return;
                }
                //console.log(rows);
                angular.forEach(rows[0].find('td'), function(item) {
                    var el = angular.element(item);
                    var title=el.attr('title');
                    columns.push({
                        id: i++,
                        title: title
                    });

                });
                //console.log(columns);
                return function(scope, element, attrs, controller) {
                    controller.getParam();
                    controller.requestData();
                    controller.compileDirectiveTemplates(columns);
                };
            }
        };
    });
});

