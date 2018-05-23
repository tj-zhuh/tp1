
; (function (root, factory) {
    if (typeof define == 'function' && define.amd) {
        define(function (require) { return factory(); })
    }
    else {
        root.tj = factory()
    }
}(this, function () {

    var ret = function () { }

    // 添加window.onload事件，替代$(function(){})
    ret.addLoadEvent = function (fn) {

        if (typeof fn !== 'function') return;

        if (document.readyState == 'complete') {
            fn();
        }

        if (typeof window.onload !== 'function') {
            window.onload = fn;
            return;
        }

        var tmp = window.onload;



        window.onload = function () {
            tmp();
            fn();
        }
    }

    // 绑定事件
    ret.addHandler = function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }
    }

    // 解除事件绑定
    ret.removeHandler = function (element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, hander, false);
        } else if (element.detachEvent) {
            element.detachEvent('on' + type, handler);
        } else {
            element['on' + type] = null;
        }
    }

    // 根据class查找元素
    ret.getElementsByClassName = function (className) {

        //高版本浏览器
        if (document.getElementsByClassName) {
            return document.getElementsByClassName(className);
        }

        //兼容ie8
        var _temp = [];

        var Els = document.getElementsByTagName('*');

        //遍历元素集
        for (var i = 0; i < Els.length; i++) {

            //获取到这个元素的className
            var _str = Els[i].className;

            if (!!_str) {

                //用正则式对class进行标准化处理
                _str = _str.replace(/\s+/g, " ");                             //标准化多个" "(变为一个" ")
                _str = _str.replace(/^\s/, "");                             //处理掉前后端的多余" "
                _str = _str.replace(/$\s/, "");

                _str = " " + _str + " ";                                    //前后端再加一个" "

                var _exp = new RegExp("\\s" + className + "\\s");

                if (!_exp.exec(_str)) { continue; };
                if (typeof _exp.exec(_str).index == 'number') {
                    _temp.push(Els[i]);
                }
            }
        }
        return _temp;
    }

    // 判断元素是否包含class名
    ret.hasClass = function (element, className) { }

    // 为元素添加class(兼容至ie8)
    ret.addClass = function (element, className,callback) {
        if (!element)
            throw new Error("您的添加类操作没有指定一个正确的元素标签");
        if (!className || typeof className !== "string")
            throw new Error("您添加的类名称不是一个字符串");
        if (element)

            if (!this.hasClass(element, className)) element.className += " " + className;

        if (!callback)
            return;
        else if (typeof callback !== "function")
            throw new Error("您的回调函数不是一个正确的方法");
        callback();
    }

    // 为元素删除class(兼容至ie8)
    ret.removeClass = function (element, className,callback) {
        if (!element)
            throw new Error("您的添加类操作没有指定一个正确的元素标签");
        if (!className || typeof className !== "string")
            throw new Error("您添加的类名称不是一个字符串");
       
        if (element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                element.className = element.className.replace(reg, ' ');
            }

        if (!callback)
            return;
        else if (typeof callback !== "function")
            throw new Error("您的回调函数不是一个正确的方法");
        callback();
    }

    //*注意:此方法以对象优先覆盖string||number为原则*//
    //仿$.extend
    ret.extend = function () {

        //反复往里面遍历
        function zMultiplex(obj1, obj2) {

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

                    _obj[k] = zMultiplex(_obj[k], obj2[k]);
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
                        _temp[j] = zMultiplex(_temp[j], arguments[i][j]);
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

            //不是深度覆盖
        else {
            for (var i = 1; i < arguments.length - 1; i++) {
                for (var j in arguments[i]) {
                    _temp[j] = arguments[i][j];
                }
            }
        }

        return _temp;
    }
     

    return ret;

}))




