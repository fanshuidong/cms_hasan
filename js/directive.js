define(function (require) {
    var angular = require('angular');
    var $=require("jquery");
    var app = require('./app');

    require("bootstrap");


    //取消a标签的默认动作
    // app.directive('a', function() {
    //     return {
    //         restrict: 'E',
    //         link: function(scope, elem, attrs) {
    //             if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
    //                 elem.on('click', function(e) {
    //                     e.preventDefault(); // prevent link click for above criteria
    //                 });
    //             }
    //         }
    //     };
    // });
    app.directive('showtab', function () {
            return {
                link: function (scope, element, attrs) {
                    element.click(function(e) {
                        e.preventDefault();
                        $(element).tab('show');
                    });
                }
            };
        });

    app.directive('getmaxheight', function () {
        return {
            link: function (scope, element, attrs) {
                var windowH=document.documentElement.clientHeight-300;


                    $(element).css('maxHeight','windowH')
                }

        };
    });


    app.directive('modal', function () {
        return {
            template: '<div class="modal fade" data-backdrop="static" draggable>' +
            '<div class="modal-dialog modal-lg">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '<h4 class="modal-title">{{ title }}</h4>' +
            '</div>' +
            '<div class="modal-body col-md-12" ng-transclude>' +
            '</div>' +
            '<div class="modal-footer"></div>'+
            '</div>' +
            '</div>' +
            '</div>',
            restrict: 'E',
            transclude: true,
            replace:true,
            scope:true,
            link: function postLink(scope, element, attrs) {

                scope.title = attrs.title;

                scope.$watch(attrs.visible, function(value){
                    if(value == true)
                        $(element).modal('show');
                    else
                        $(element).modal('hide');
                });

                $(element).on('shown.bs.modal', function(){
                    scope.$apply(function(){
                        scope.$parent[attrs.visible] = true;

                    });
                });

                $(element).on('hidden.bs.modal', function(){
                    scope.$apply(function(){
                        scope.$parent[attrs.visible] = false;
                    });
                });
            }
        };
    });


    app.directive('modal1', function () {
        return {
            template: '<div class="modal fade" data-backdrop="static" draggable>' +
            '<div class="modal-dialog modal-lg">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            // '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '<h4 class="modal-title" style="text-align: center">{{ title }}</h4>' +
            '</div>' +
            '<div class="modal-body col-md-12" ng-transclude>' +
            '</div>' +
            '<div class="modal-footer"></div>'+
            '</div>' +
            '</div>' +
            '</div>',
            restrict: 'E',
            transclude: true,
            replace:true,
            scope:true,
            link: function postLink(scope, element, attrs) {

                scope.title = attrs.title;

                scope.$watch(attrs.visible, function(value){
                    if(value == true)
                        $(element).modal('show');
                    else
                        $(element).modal('hide');
                });

                $(element).on('shown.bs.modal', function(){
                    scope.$apply(function(){
                        scope.$parent[attrs.visible] = true;

                    });
                });

                $(element).on('hidden.bs.modal', function(){
                    scope.$apply(function(){
                        scope.$parent[attrs.visible] = false;
                    });
                });
            }
        };
    });

    app.directive('maxmodal', function () {
        return {
            template: '<div class="modal fade" data-backdrop="static" draggable>' +
            '<div class="modal-dialog modal-lg" style="width:1200px;">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '<h4 class="modal-title">{{ title }}</h4>' +
            '</div>' +
            '<div class="modal-body col-md-12" ng-transclude>' +
            '</div>' +
            '<div class="modal-footer"></div>'+
            '</div>' +
            '</div>' +
            '</div>',
            restrict: 'E',
            transclude: true,
            replace:true,
            scope:true,
            link: function postLink(scope, element, attrs) {

                scope.title = attrs.title;

                scope.$watch(attrs.visible, function(value){
                    if(value == true)
                        $(element).modal('show');
                    else
                        $(element).modal('hide');
                });

                $(element).on('shown.bs.modal', function(){
                    scope.$apply(function(){
                        scope.$parent[attrs.visible] = true;

                    });
                });

                $(element).on('hidden.bs.modal', function(){
                    scope.$apply(function(){
                        scope.$parent[attrs.visible] = false;
                    });
                });
            }
        };
    });

    app.directive('timerbutton', function($timeout, $interval){
        return {
            restrict: 'AE',
            scope: {
                showTimer: '=',
                timeout: '='
            },
            link: function(scope, element, attrs){
                scope.timer = false;
                scope.timeout = 60000;
                scope.timerCount = scope.timeout / 1000;
                scope.text = "获取验证码";

                scope.onClick = function(){
                    scope.showTimer = true;
                    scope.timer = true;
                    scope.text = "秒后重新获取";
                    var counter = $interval(function(){
                        scope.timerCount = scope.timerCount - 1;
                    }, 1000);

                    $timeout(function(){
                        scope.text = "获取验证码";
                        scope.timer = false;
                        $interval.cancel(counter);
                        scope.showTimer = false;
                        scope.timerCount = scope.timeout / 1000;
                    }, scope.timeout);
                }
            },
            template: '<button on-tap="onClick()" class="button button-calm xgmm-btn" ng-disabled="timer"><span ng-if="showTimer">{{ timerCount }}</span>{{text}}</button>'
        };
    });

    app.directive('draggable', ['$document', function($document) {
        return function(scope, element,parent, attr) {
            var startX = 0, startY = 0, x = 0, y = 0;
            element= angular.element(document.getElementsByClassName("modal-header"));
            parent= angular.element(document.getElementsByClassName("modal-dialog"));
            element.css({
                position: 'relative',
                cursor: 'move'
            });
            element.on('mousedown', function(event) {
                // Prevent default dragging of selected content
                event.preventDefault();
                startX = event.pageX - x;
                startY = event.pageY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });
            function mousemove(event) {
                y = event.pageY - startY;
                x = event.pageX - startX;

                if(x<=-250){
                    x=-250
                }
                if(y<=-10){
                    y=-10
                }

                if(x>=$document.width()-900-280){
                    x=$document.width()-900-280
                }

                if(y>=$document.height()-element.height()-270){
                    y=$document.height()-element.height()-270
                }

                parent.css({
                    top: y + 'px',
                    left:  x + 'px'
                });
            }
            function mouseup() {
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
            }
        };
    }]);
    app.directive('draggable2', ['$document', function($document) {
        return function(scope, element,parent, attr) {
            var startX = 0, startY = 0, x = 0, y = 0;
            element= angular.element(document.getElementsByClassName("maxPicImg"));
            parent= angular.element(document.getElementsByClassName("maxPicImg"));
            element.css({
                position: 'relative',
                cursor: 'move'
            });
            element.on('mousedown', mousedown);
            function mousedown(event){
                event.preventDefault();
                startX = event.pageX - x;
                startY = event.pageY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            }
            function mousemove(event) {
                y = event.pageY - startY;
                x = event.pageX - startX;
                parent.css({
                    top: y + 'px',
                    left:  x + 'px'
                });
            }
            function mouseup() {
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
            }

            var masaike = angular.element(document.getElementById("masaike"));
            masaike.on('click',function(){
                var offSetX=0;
                var offSetY=0;
                if(document.getElementById('updiv')){
                    document.getElementById('maxPicModel').removeChild(document.getElementById('updiv'));
                }
                var updiv =document.createElement("div");
                var updivStartX =0,updivStartY=0;
                updiv.id="updiv";
                updiv.style.position='absolute';
                updiv.style.width=(document.getElementById('targetImg').scrollWidth).toString()+'px';
                updiv.style.height=(document.getElementById('targetImg').scrollHeight).toString()+'px';
                updiv.style.top=document.getElementById('targetImg').style.top ? document.getElementById('targetImg').style.top : '0px';
                updiv.style.left=document.getElementById('targetImg').style.left ? document.getElementById('targetImg').style.left : '0px';
                updiv.style.border='2px solid #139AF6';
                document.getElementById('maxPicModel').appendChild(updiv);

                angular.element('#updiv').css('cursor','crosshair');
                var wId = "w";
                var index = 0;
                var startX = 0, startY = 0;
                var flag = false;
                var retcLeft = "0px", retcTop = "0px", retcHeight = "0px", retcWidth = "0px";
                var element1= angular.element(document.getElementById("updiv"));


                element1.on('mousedown', drawMousedown);

                function drawMousedown(){
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                    flag = true;
                    try{
                        var top=document.getElementById("updiv").offsetTop;
                        var left=document.getElementById("updiv").offsetLeft;
                        var evt = window.event || e;
                        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                        var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
                        startX = evt.clientX -left;
                        startY = evt.clientY -top;
                        //START POINT
                        index++;
                        var div = document.createElement("div");
                        div.id = wId + index;
                        div.className = "imgDiv";
                        div.style.marginLeft = startX + "px";
                        div.style.marginTop = startY + "px";
                        div.style.zIndex='99999';
                        element1[0].appendChild(div);
                    }catch(e){
                        //alert(e);
                    }
                    $document.on('mousemove', drawMousemove);
                    $document.on('mouseup', drawMouseup);
                }

                function drawMouseup(){
                    try{
                        element1[0].removeChild(document.getElementById(wId + index));
                        var div = document.createElement("div");
                        div.className = "retc";
                        div.style.marginLeft = retcLeft;
                        div.style.marginTop = retcTop;
                        div.style.width = retcWidth;
                        div.style.height = retcHeight;
                        div.style.zIndex='99999';
                        element1[0].appendChild(div);
                        document.getElementById('imgBtn').style.marginLeft=retcLeft;
                        document.getElementById('imgBtn').style.marginTop = retcTop;
                        document.getElementById('imgBtn').style.display='block';
                        document.getElementById('updiv').appendChild(document.getElementById('imgBtn'));
                        element1.on('mousedown', function() {
                            $document.off('mousemove', drawMousemove);
                            $document.off('mouseup', drawMouseup);
                        });
                        scope.x=startX;
                        scope.y=startY;
                        scope.screenshotX=offSetX;
                        scope.screenshotY=offSetY;

                        scope.imgCancel=function(){
                            document.getElementById('maxPicModel').appendChild(document.getElementById('imgBtn'));
                            document.getElementById('maxPicModel').removeChild(document.getElementById('updiv'));
                            document.getElementById('imgBtn').style.display='none';
                            element.on('mousedown', mousedown);
                        };
                        element1.off('mousedown');
                    }catch(e){
                        //alert(e);
                    }
                    flag = false;
                }
                function drawMousemove(e){
                    if(flag){
                        try{
                            var mintop=document.getElementById("updiv").offsetTop;
                            var minleft=document.getElementById("updiv").offsetLeft;
                            var maxbottom=document.getElementById("updiv").offsetTop + document.getElementById("updiv").offsetHeight;
                            var maxright=document.getElementById("updiv").offsetLeft + document.getElementById("updiv").offsetWidth;
                            var top=parseInt(updiv.style.top);
                            var left=parseInt(updiv.style.left);
                            var evt = window.event || e;
                            offSetX= evt.offsetX;
                            offSetY= evt.offsetY;
                            if(evt.clientX>minleft && evt.clientX<=maxright && evt.clientY>mintop && evt.clientY<=maxbottom){
                                offSetX= evt.clientX - minleft;
                            }
                            if(evt.clientX<=minleft) {
                                offSetX=0;
                                offSetY=evt.clientY - mintop;
                            }
                            if(evt.clientX>maxright) {
                                offSetX=document.getElementById("updiv").offsetWidth;
                                offSetY=evt.clientY - mintop;
                            }
                            if(evt.clientY>mintop && evt.clientY<=maxbottom && evt.clientX>minleft && evt.clientX<=maxright){
                                offSetY= evt.clientY - mintop;
                            }
                            if(evt.clientY<=mintop){
                                offSetY=0;
                                offSetX=evt.clientX - minleft;
                            }
                            if(evt.clientY>maxbottom){
                                offSetY=document.getElementById("updiv").offsetHeight;
                                offSetX=evt.clientX - minleft;
                            }

                            if(evt.clientX<=minleft && evt.clientY<=mintop){
                                offSetY=0;
                                offSetX=0;
                            }
                            if(evt.clientX<=minleft && evt.clientY>maxbottom){
                                offSetY=document.getElementById("updiv").offsetHeight;
                                offSetX=0;
                            }
                            if(evt.clientX>maxright && evt.clientY<=mintop){
                                offSetY=0;
                                offSetX=document.getElementById("updiv").offsetWidth;
                            }
                            if(evt.clientX>maxright && evt.clientY>maxbottom){
                                offSetX=document.getElementById("updiv").offsetWidth;
                                offSetY=document.getElementById("updiv").offsetHeight;
                            }
                            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                            var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
                            retcLeft = (startX - offSetX > 0 ?   offSetX : startX) + "px";
                            retcTop = (startY - offSetY > 0 ?     offSetY : startY) + "px";
                            retcHeight = Math.abs(startY - offSetY) + "px";
                            retcWidth = Math.abs(startX - offSetX) + "px";
                            document.getElementById(wId + index).style.marginLeft = retcLeft;
                            document.getElementById(wId + index).style.marginTop = retcTop;
                            document.getElementById(wId + index).style.width = retcWidth;
                            document.getElementById(wId + index).style.height = retcHeight;
                        }catch(e){
                            //alert(e);
                        }
                    }
                }


            });
            scope.$on("imgChange",function(event,msg){
                if(msg){
                    document.getElementById('targetImg').src=msg.url;
                    document.getElementById('maxPicModel').appendChild(document.getElementById('imgBtn'));
                    document.getElementById('maxPicModel').removeChild(document.getElementById('updiv'));
                    document.getElementById('imgBtn').style.display='none';
                    element.on('mousedown', mousedown);
                }
            })


        };
    }]);
    app.directive('menu', function($timeout) {
        return {
            restrict: 'A',
            controller: function() {
                var data = [];
            },
            compile: function(element, attrs){
                var ele=$(element[0]);
                var onoff=true;

                    function first(){
                        ele.css('width', '56px');
                        $('.bigPage').css({'width':'calc(100% - 56px)','left':'56px','transition':'0.3s'});
                        $('.landmark').css({'width':'calc(100% - 56px)','left':'56px','transition':'0.3s'});
                        $('.top-nav').css({'width':'calc(100% - 56px)','left':'56px','transition':'0.3s'});
                        $('.page-sidebar2-menu').css({'width':'calc(100% - 140px)','left':'140px','transition':'0.3s'});

                        $('.txt').css('transform','scaleY(0)');
                        onoff = false;
                    }


                function second(){
                    ele.css('width', '180px');
                    $('.bigPage').css({'width':'calc(100% - 180px)','left':'180px','transition':'0.3s'});
                    $('.landmark').css({'width':'calc(100% - 180px)','left':'180px','transition':'0.3s'});

                    $('.top-nav').css({'width':'calc(100% - 180px)','left':'180px','transition':'0.3s'});
                    $('.page-sidebar2-menu').css({'width':'calc(100% - 264px)','left':'264px','transition':'0.3s'});
                    $('.txt').css('transform','scaleY(1)');
                    onoff=true;
                }
                function third(){
                    ele.css('width', '56px');
                    $('.bigPage').css({'width':'calc(100% - 56px)','left':'56px','transition':'0s'});

                    $('.top-nav').css({'width':'calc(100% - 56px)','left':'56px','transition':'0s'});

                    $('.landmark').css({'width':'calc(100% - 56px)','left':'56px','transition':'0s'});
                    $('.page-sidebar2-menu').css({'width':'calc(100% - 140px)','left':'140px','transition':'0s'});

                    $('.txt').css('transform','scaleY(0)');
                }

                ele.find('.toggleNav').click(function() {
                    if (onoff) {
                        first();
                }else{
                        second();
                    }
                });



                ele.find('.page-sidebar-menu a').click(function(){

                    var width=$(this).width();
                    if(width==32) {
                        $timeout(third,100)

                    }

                    $('.page-sidebar-menu a').removeClass('active1');
                    $('.page-sidebar-menu span[class^=icon]').css('background-color','');
                    $(this).addClass('active1');

                    $('.page-sidebar-menu span[class^=icon]').removeClass(function(index,className){
                        var arr = className.split(/\s+/);
                        for (var i = 0; i < arr.length; i++) {
                            if(arr[i].indexOf('active') === -1){
                                arr.splice(i,1);
                                i--;
                            }
                        };
                        return arr.join(' ');
                    });

                    var bgcolor=$(this).find('span');
                    if(bgcolor.hasClass('icon0')){
                        $('.icon0').css('background-color','#ef7ead');
                    }else if(bgcolor.hasClass('icon1')){
                        $('.icon1').css('background-color','#fcb95b');
                    }else if(bgcolor.hasClass('icon2')){
                        $('.icon2').css('background-color','#F88962');
                    }else if(bgcolor.hasClass('icon3')){
                        $('.icon3').css('background-color','#7F8DE1');
                    }else if(bgcolor.hasClass('icon4')){
                        $('.icon4').css('background-color','#A094ED');
                    }else if(bgcolor.hasClass('icon5')){
                        $('.icon5').css('background-color','#F49756');
                    }else if(bgcolor.hasClass('icon6')){
                        $('.icon6').css('background-color','#4BC076');
                    }else if(bgcolor.hasClass('icon7')){
                        $('.icon7').css('background-color','#E6D478');
                    }else if(bgcolor.hasClass('icon8')){
                        $('.icon8').css('background-color','#EB7092');
                    }else if(bgcolor.hasClass('icon9')){
                        $('.icon9').css('background-color','#83B6FF');
                    }else if(bgcolor.hasClass('icon10')){
                        $('.icon10').css('background-color','#EF6E64');
                    }else if(bgcolor.hasClass('icon11')){
                        $('.icon11').css('background-color','#2ECBBE');
                    }else if(bgcolor.hasClass('icon12')){
                        $('.icon12').css('background-color','#489DD0');
                    }else if(bgcolor.hasClass('icon13')){
                        $('.icon13').css('background-color','#BAAC93');
                    }else if(bgcolor.hasClass('icon14')){
                        $('.icon14').css('background-color','#65CAE4');
                    }else if(bgcolor.hasClass('icon15')){
                        $('.icon15').css('background-color','#F2CF5B');
                    }else if(bgcolor.hasClass('icon16')){
                        $('.icon16').css('background-color','#e5b229');
                    }
                })
                return function(scope, element, attrs, controller) {
                };
            }
        };
    });

    app.directive('childmenu2', ['$location','$rootScope', function($location,$rootScope) {
        return {
            restrict: 'A',
            compile: function(element, attrs){
                $rootScope.path = $location.path();
                element.click(function(){
                    $('.page-sidebar2-menu a').removeClass('active2');
                    element.addClass('active2');
                });
                return function(scope, element, attrs, controller) {
                };
            }
        };
    }]);

    app.directive('resetIcon', function() {
        return {
            restrict: 'A',
            compile: function(element, attrs){
                var ele=$(element[0]);
                var n=0;
                ele.click(function(){
                    n++;
                    ele.css({'transform':'rotate('+360*n+'deg)'})
                });
                return function(scope, element, attrs, controller) {
                };
            }
        };
    });

    app.directive('moreSearch', function() {
        return {
            restrict: 'A',
            compile: function(element, attrs){
                var ele=$(element[0]);
                var onOff1=false;
                var onOff2=false;

                ele.find('li').first().click(function(){
                    if(!onOff1){
                            $(this).addClass('addnike');
                            $('#searchdate').attr('datashow');
                            $('#searchdate').css('display', 'block');
                            setTimeout(function () {
                                $('#searchdate').addClass('scaleshow');
                            }, 100);
                        onOff1=true;
                    }else{
                        $(this).removeClass('addnike');
                        $('#searchdate').removeAttr('datashow');
                        $('#searchdate').removeClass('scaleshow');
                        setTimeout(function () {
                            $('#searchdate').css('display', 'none');
                        }, 200);
                        onOff1=false;
                    }

                });
                ele.find('li').last().click(function(){
                    if(!onOff2){
                        $(this).addClass('addnike');
                        $('#search2').css('display','block');
                        setTimeout(function(){
                            $('#search2').addClass('scaleshow');
                        },50);
                        onOff2=true;
                    }else{
                        $(this).removeClass('addnike');
                        $('#search2').removeClass('scaleshow');
                        setTimeout(function(){
                            $('#search2').css('display','none');
                        },100);
                        onOff2=false;
                    }

                });


                return function(scope, element, attrs, controller) {
                };
            }
        };
    });

    app.directive('laydate', function() {
        return {
            require: '?ngModel',
            restrict: 'A',
            scope: {
                ngModel: '='
            },
            link: function(scope, element, attr, ngModel) {
                // 初始化
                laydate.render({
                    elem: '#' + attr.id,
                    range: attr.range,
                    done: function(data) {
                        scope.$apply(setViewValue(data));
                    },
                    clear:function () {
                        ngModel.$setViewValue('');
                    }
                });
                // 模型值同步到视图上
                ngModel.$render = function() {
                    element.val(ngModel.$viewValue || '');
                };

                setViewValue();

                // 更新模型上的视图值
                function setViewValue(data) {
                    ngModel.$setViewValue(data);
                }
            }
        }
    });


    app.directive('laydateType', function() {
        return {
            require: '?ngModel',
            restrict: 'A',
            scope: {
                ngModel: '='
            },
            link: function(scope, element, attr, ngModel) {
                // 初始化
                laydate.render({
                    elem: '#' + attr.id,
                    type:attr.laydateType,
                    range: attr.range,
                    done: function(data) {
                        scope.$apply(setViewValue(data));
                    },
                    clear:function () {
                        ngModel.$setViewValue('');
                    }
                });
                // 模型值同步到视图上
                ngModel.$render = function() {
                    element.val(ngModel.$viewValue || '');
                };

                setViewValue();

                // 更新模型上的视图值
                function setViewValue(data) {
                    ngModel.$setViewValue(data);
                }
            }
        }
    });
});
