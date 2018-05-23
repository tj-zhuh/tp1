
; (function (root, factory) {
    if (typeof define == 'function' && define.amd) {
        define(function (require) {
            return factory();
        })
    }
    else {
        root.chart = factory();
    }
}(this, function () {

    var c = {};

    var pieOption = (function () {
        return {
            title: {
                top: '45%',
                left: '43%',
            },
            color: ['#6ABDFA', '#BF9BDE', '#94E469', '#FEACAC', '#F8DC9D' ],
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    type: 'shadow',
                }
            },
            legend: {
                orient: 'vertical',
                right: '2%',
                top: '15%'
            },
            series: [{
                name: '',
                type: 'pie',
                data:[],
                radius: ['30%', '60%'],
                label: { normal: { position: 'inside', formatter: '{d}%' } }
            }, {
                name: '',
                type: 'pie',
                data: [{
                    value: 1,
                    itemStyle: { normal: { color: '#ccc', opacity: 0.3 } }
                }],
                labelLine: { normal: { show: 0 } },
                radius: '85%',
                silent: true
            }]
        };
    })() 

    var barOption = (function () {
        return {
            color: ['#65A8D7', '#BEAECD', '#A1C290', '#E7C3C2', '#F9DC9E', '#B0E6ED'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',

                }
            },
            legend: {
                orient: 'vertical',
                right: '2%',
                top: '15%'
            },
            series: [{
                symbol: 'rect'
            }, {
                symbol: 'rect'
            }, {
                symbol: 'rect'
            }]

        };
    })()

    var extend = (function () {
        
        return function (){

            //反复往里面遍历
            function fuyong(obj1, obj2) {

                //创建一个将要返回的对象
                var _obj = obj1;

                for (var k in obj2) {

                    //如果obj1没有[k]覆盖
                    if (!_obj[k]) {
                        _obj[k] = obj2[k];
                        continue;
                    }


                    //如果obj1是字符串,obj2直接覆盖obj1
                    if (typeof _obj[k] == 'string' || typeof _obj[k] == 'number') {
                        _obj[k] = obj2[k];
                    }

                        //如果obj1是对象obj2是字符串,obj1覆盖obj2
                    else if (typeof obj1[k] == 'object' && typeof obj2[k] !== 'object') {
                        continue;
                    }

                        //都是对象,深度覆盖
                    else {

                        _obj[k] = fuyong(_obj[k], obj2[k]);


                    }
                }

                return _obj;

            }

            //第一个对象
            var _temp = arguments[0];

            //每后一个对象对第一个进行填补
            if (!!arguments[arguments.length - 1]) {

                for (var i = 1; i < arguments.length; i++) {

                    //查看下一个对象中的每一个键
                    for (var j in arguments[i]) {

                        //如果_temp[j]是obj且arguments[i][j]是string,
                        if (typeof _temp[j] == 'object' && typeof arguments[i][j] == 'string') {
                            ;
                        }

                            //如果都是obj
                        else if (typeof _temp[j] == 'object' && typeof arguments[i][j] == 'object') {
                            _temp[j] = fuyong(_temp[j], arguments[i][j]);
                        }

                            //如果_temp[j]是string,且arguments[i][j]是object,
                            //如果都是string
                            //如果_temp里面没有_temp[j]
                        else {
                            _temp[j] = arguments[i][j];
                        }
                    }
                }
            }

                //返回
            else {
                for (var i = 1; i < arguments.length; i++) {
                    for (var j in arguments[i]) {
                        _temp[j] = arguments[i][j];
                    }
                }
            }

            return _temp;
        }

    })()

    c.decorate = function (option) {

        var ss = option.series;

        var isBarLine = false;
        var isPie = false;

        for (var i = 0; i < option.series.length; i++) {
 
            switch(option.series[i].type){
                
                case 'bar': case 'line':
                    isBarLine = true;
                    break;
                case 'pie':
                    isPie = true;
                    break;
                default:
                    throw new Error('序列类型不支持')
            }
        }

        if (isPie && isBarLine) throw new Error('饼图和其它类型序列不能同时出现');

        if (isBarLine)             
            return extend(barOption, option, true);
        
        if (isPie)
            return extend(pieOption, option, true);

    } 

    return c;

}))