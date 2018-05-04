require.config({
    baseUrl: './',
    paths: {
        "jquery":"lib/jquery/jquery-3.1.0.min",
        'angular': 'lib/angular/angular.min',
        'angular-ui-router': 'lib/angular-ui-router/angular-ui-router.min',
        'angular-async-loader': 'lib/angular-async-loader/angular-async-loader.min',
        "ui-table":"lib/ui-table/uiTable",
        "datepicker":"lib/datepicker/datepicker",
        "bootstrap": 'lib/bootstrap/bootstrap.min',
        "ui-bootstrap": 'lib/bootstrap/ui-bootstrap-tpls.min',
        "ueditor.all.min":"lib/ue/ueditor.all",
        "ueditor.config":"lib/ue/ueditor.config",
        "ZeroClipboard":"lib/ue/third-party/zeroclipboard/ZeroClipboard",
        "angular-ueditor":"lib/ue/angular-ueditor",
        'select2':'lib/select2/select2',
        'angular-select2':'lib/angular-select2',
        'toastr':'lib/bootstrap-toastr/toastr',
        'upload':'lib/upload/ng-file-upload',
        'upload-shim':'lib/upload/ng-file-upload-shim',
        'sanitize':'lib/angular-sanitize/angular-sanitize.min',
        'highchart':'lib/highcharts/highstock',
        'highchartng':'lib/highcharts/highcharts-ng',
        'angular-datepicker':'lib/angular-datepicker',
        'bootstrap-fileinput':'lib/bootstrap-fileinput/js/fileinput',
        'bootstrap-switch':'lib/bootstrap-switch-master/dist/js/bootstrap-switch.min',
        'ztree':'lib/ztree/js/jquery.ztree.all.min'
    },
    shim: {
        'angular': {deps: ['jquery'],exports: 'angular'},
        'bootstrap' : {deps : [ 'jquery' ], exports : 'bootstrap'},
        'angular-ui-router': {deps: ['angular']},
        'ui-bootstrap':{deps: ['angular'],exports : 'ui-bootstrap'},
        'sanitize':{deps: ['angular'],exports : 'ngSanitize'},
        'datepicker':{deps: ['angular']},
        'ueditor.all.min':{deps: ['ueditor.config']},
        'angular-ueditor':{deps: ['angular','ueditor.all.min']},
        'angular-select2':{deps: ['angular','select2'],exports : 'uiSelect2'},
        'toastr':{exports:'toastr'},
        'upload':{deps: ['angular','upload-shim'],exports : 'Upload'},
        'highchartng':{deps: ['angular','highchart']},
        'angular-datepicker':{deps: ['angular'],exports:'datePicker'}

    }
});

require(['angular', './js/app-routes'], function (angular) {
    // 页面加载完成后,再加载模块
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['app']);
        //angular.element(document).find('html').addClass('ng-app');
    });
});

