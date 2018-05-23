
/* 顶部栏的业务逻辑 */

define(function (require) {

    var dao = require('dao'); 
    var tj = require('tj');
    var menu = require('menu');

    tj.addLoadEvent(function () {

        dao.getUserInfo(function (userInfo) {

            var elem = document.getElementById('username');
      
            var text = document.createTextNode(userInfo.userName);            
            elem.appendChild(text);

        });

    })   
    

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