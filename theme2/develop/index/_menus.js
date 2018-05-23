
/* 关于菜单的逻辑 */

define(function (require) {

    var dao = require('dao');
    var tj = require('tj');
    var menu = require('menu');

    menu.setLoadPageFunc(function (url) {

        var frame = document.getElementById('iframe1');
        frame.src = url;

        frame.onload = function () {
            frame.height = iframe1.document.body.scrollHeight;
        } 
    });
  
    tj.addLoadEvent(function () {

        dao.getMenu(function (menus) {            

            var menulv1 = document.getElementById('menulv1'); 
            var menulv2 = document.getElementById('menulv2');
            var menulv3 = document.getElementById('menulv3');
            var menulv4 = document.getElementById('menulv4');

            menu.init(menus, [menulv1, menulv2, menulv3, menulv4]);
        });
    })

})