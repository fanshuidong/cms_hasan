define(function(require) {
	var app = require('./app');

    //枚举对象通用过滤器
    app.filter("enumFilter",function (enums) {
        return function (value,name) {//value为需要被过滤的值,name表示枚举对象名
            var entity = enums.enumConfig[name];
            for(var index in entity){
                if(value == entity[index].mark || value==entity[index].value){
                    return entity[index].text;
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
});