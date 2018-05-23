
define(function (require) {

    var $ = require('jquery');
    var echarts = require('echarts');
    var chart = require('chart');


    var ret = { chart: null };

    //取随机数组工具函数(获得固定数量的数组型数据)
    function getRadomNums(nums, min, max) {
        var _temp = [];

        for (var i = 0; i < nums; i++) {
            var __temp__ = (min + (max - min) * Math.random()).toFixed(2);

            _temp.push(__temp__);
        }

        return _temp;
    }

    //获得一个随机数工具函数
    function getRandom(min, max) {
        var __temp__ = (min + (max - min) * Math.random()).toFixed(2);
        return __temp__;
    }


    //设置画echarts的容器
    ret.config = function (obj) {

        ret.chart = echarts.init(obj.El);

        return ret;
    }

    //设置数据option(不与皮肤接触,但一旦设置样式,这里优先)
    ret.setOption = function (data) {


        return {
            legend: {
                data: ['微信', '微博', '网站', 'APP', '可视化']
            },
            title: {
                text: '访问占比',
                subtext:'    2017年'
            },
            series: [{
                type: 'pie',
                name: '呵呵',
                data: [
                    { name: '微信', value: getRandom(20, 100) },
                    { name: '微博', value: getRandom(20, 100) },
                    { name: '网站', value: getRandom(20, 100) },
                    { name: 'APP', value: getRandom(20, 100) },
                    { name: '可视化', value: getRandom(20, 100) },
                ]

            }]
        }
    }

    //画图与事件绑定处理(结合皮肤)
    ret.draw = function () {
        if (typeof ret.chart !== 'object') {
            throw new Error('echarts图表尚未初始化,请先调用chart.config()以设置容器')
        }

        var option = this.setOption();

        //先set一遍皮肤
        option = chart.decorate(option);
        //console.log(option)
        this.chart.setOption(option);

        //如果试图给chart添加事件监听器一定要在此处
        ret.chart.on('click', function (e) {

            console.log(e);

        })

    }


    return ret;

})