
require.config({
    paths: config.getPaths(3)
})


define(function (require) {
    var x=10000
    var $ = require('jquery');
    var chart1 = require('chart1');
    var chart2 = require('chart2');
    var grid = require('grid');
    var util = require('util');

    //设置chart1的容器
    chart1.config({
        El: document.getElementById('chart1')
    })

    //画chart2
    chart1.draw()


    //设置chart2的容器
    chart2.config({
        El: document.getElementById('chart2')
    })

    //画chart2
    chart2.draw()


    //年月日点击事件
    $('#zPanel3-ul li div').click(function () {

        if($(this).hasClass('active')){return }

        else {
            $('#zPanel3-ul li').removeClass('active');
            $(this).parent().addClass('active');
        }

    })


    //表格点击事件
    $('.zGridTitle').click(function () {
        //util.alert('你报错了sadasdaasdddddddddddddddddddddddddddddddddsssaddddddddddddddddddddddddddddddddddddddddasfsadgfsdgsdfgfgs', function () { $('.zGridTitle').text(x) });
        if ($(this).hasClass('active')) { return }

        else {
            $('.zGridTitle').removeClass('active');
            $(this).addClass('active');
        }

    })







})
















