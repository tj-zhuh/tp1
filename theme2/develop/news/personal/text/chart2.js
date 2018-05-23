
define(function (require) {

    var $ = require('jquery');
    var echarts = require('echarts');
    var chart = require('chart');

    var ret = { chart: null };

    //设置画echarts的容器
    ret.config = function (obj) {
        
        ret.chart = echarts.init(obj.El);

        return ret;
    }

    //设置数据option(不与皮肤接触,但一旦设置样式,这里优先)
    ret.setOption = function (data) {


        return {

            xAxis: [{
                type: 'category',
                data:['1','2','3','4','5','6','星期七']
            }],
            yAxis: [{
                type: 'value',
                
            }],
            //color: ['#ccc', '#ccc', '#ccc', '#ccc', '#F9DC9E', '#B0E6ED'],
            legend: {
                data: ['微信', '微博', '网站']
            },
            series: [{
                type: 'bar',
                name: '微信',
                data: [10, 22, 33, 44, 99, 70, 105]

            }, {
                type: 'bar',
                name: '微博',
                data: [10, 22, 33, 44, 99, 70, 105]

            }, {
                type: 'bar',
                name: '网站',
                data: [10, 22, 33, 44, 99, 70, 105]

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
     
        this.chart.setOption(option); 

        //如果试图给chart添加事件监听器一定要在此处
        ret.chart.on('click', function (e) {

            console.log(e);

        })

    }


    return ret;

})