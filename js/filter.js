define(function(require) {
	var app = require('./app');

    //枚举对象通用过滤器
    app.filter("enumFilter",function (enums,$sce) {
        return function (value,name) {//value为需要被过滤的值,name表示枚举对象名
            var entity = enums.enumConfig[name];
            for(var index in entity){
                if(value == entity[index].mark || value==entity[index].value || value==entity[index].id){
                    if(entity[index].color){
                        return $sce.trustAsHtml("<span style='color: "+entity[index].color+"'>"+entity[index].text+"</span>");
                    }else{
                        return entity[index].name?entity[index].name:entity[index].text;
                    }
                }
			}
            return value;
        }
    });


    //时间过滤展示
    app.filter("timeFilter",function(DateUtil){
        return function(str){
            var out=str;
            if(str==0 || str==null){
                out="/"
            }else{
                out=DateUtil.getFormateDate(new Date(str*1000));
            }
            return out;
        }
    });

    app.filter("minutesFilter",function () {//分钟转日分秒格式
        return function(minutes){
            var h = parseInt(minutes/60);
            var m = minutes%60;
            return (h<10?("0"+h):h)+":"+(m<10?("0"+m):m)+":00";
        }
    })
});