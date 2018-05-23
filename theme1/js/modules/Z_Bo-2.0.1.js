/***************************************************************************************************/
//                                       zbc尊享专属框架
//                                           ver 2.0.1
//
//
//
//注释：
//  这里用的都是原生JS,不依赖任何其他框架,且尽可能与其他框架相兼容.
//  兼容$1.12.4
//  兼容require.js
//用法：
//  在html文件最前面直接引;
//  $$()是一个类似$()的选择器;
//  所有方法均为z.func(arguments);
//  如果不做特殊声明,则没一个方法后面都有一个回调函数;
//
//
//
//                                                                          始发日期:2017.3.8
//                                                                          版本大改:(避免与全局交流;兼容require)
//                                                                          版本2.0企划日期:20.17.5.5
//                                                                          最近更新日期:2017.5.16
/*************************************************************************************************/

/*******************************************全局函数*******************************************/

//类$选择器
//function $$(selector, context) {
//    context = context || document;
//    var elements = context.querySelectorAll(selector);
//    return Array.prototype.slice.call(elements);
//};
;(function onlyOnceRun(root, factory) {
    if(typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if(typeof define === 'function' && define.amd)
        define([], factory);
    else if(typeof exports === 'object')
        exports["z"] = factory();
    else
        root["z"] = factory();
})(this, (function () {

    var __zbcBaseFunction__ = function () {
        this.___TotalzbcFuns___ = '共有12个可用方法';
    }

    //1.
    //正则式创建元素
    __zbcBaseFunction__.prototype.createEl = function (dom) {
        //*************************创建DOM元素方法***************************************//
        /*参数1是字符串*/
        /*处理*/
        if (typeof dom == "string") {

            //创建元素
            if ((/\s*<\s*/).test(dom)) {
                var _cel = dom.replace(/\s*<\s*/, "");      //清除<前后的多余" "
                _cel.replace(/\s*>/, " >");                 //特意添加一个" "以备后用
                _cel = _cel.replace(/>\s*/, "");             //清除>前后的多余" "         
                _cel = _cel.replace(/\s+/g, " ");           //将多个空格转换为一个空格(第一步标准化)
                _cel = _cel.replace(/'/g, '"');             //将全部'转为"(第二步标准化)
                _cel = _cel.replace(/\s*=\s*"\s*/g, '="');   //去掉="之间的空格(第三部标准化)    
                _cel = _cel + " ";
                if (!(/</).exec(_cel)) {
                    try {
                        var _attrs = [], _contents = [];        //创建属性名[],属性值[]
                        var L = (/\s/).exec(_cel).index;        //L是元素名之后的第一个空格所在位置
                        var _temp = document.createElement(_cel.slice(0, L));        //_temp是创建的元素
                        var _exp_name = /\s+\w+=/;       //匹配属性名的正则式
                        var _exp_value = /"|'\w"|'/;        //匹配属性值的正则式
                        var thosestr = _cel.slice(L + 1, dom.length + 1);   //去掉元素名之后的标准剩余部分
                        thosestr = " " + thosestr;
                        var fixed_str = thosestr;                           //固定住thosestr
                        var _exp_s = /"\s/g;         //检测全局空格的正则式          

                        //进行装入操作
                        var _start_p = 0;
                        for (; _exp_s.exec(fixed_str) ;) {
                            var _temp_str = thosestr.slice(0, /"\s/.exec(thosestr).index);
                            _attrs.push((_temp_str.slice(1, /="|='/.exec(_temp_str).index)).replace(/"|'/g, ""));
                            _contents.push((_temp_str.slice(/="|='/.exec(_temp_str).index + 1, _temp_str.length)).replace(/"|'/g, ""));
                            _start_p = /"\s/.exec(thosestr).index + 1;
                            thosestr = thosestr.slice(_start_p, thosestr.length + 1);
                        }
                        for (var i = 0; i < _attrs.length; i++) {
                            _temp.setAttribute(_attrs[i], _contents[i]);
                        }
                        return _temp;
                    }
                    catch (e) {
                        console.log(e)
                        alert('error:' + "无法创建" + _cel + "元素");
                        return;
                    }
                }
                else {
                    throw new Error("一次只能创建一个元素且不必以</>结尾");
                }
            }
        }
    }

    //2.
    //从数组中删除特定值的元素(可用)(重制一回)
    //注释：(不改变原数组或原对象,返回一个改变后的对象,如想改变原对象,重复赋值即可)
    //data为操作数组，x为定义值,x可以是'string','number',{},[].(注:如果x是{},则x的键随意,键的值对应操作对象的字段)
    __zbcBaseFunction__.prototype.del_x = function (data, x, callback) {
        if (typeof data !== "object")
            throw new Error("您del_x方法要操作的对象不是一个正确的数组或对象");
        
        var _temp;
        var __temp__ = new Object();

        for (var kk in data) {__temp__[kk] = data[kk];}         //手动复制
        
        if (typeof x == 'string' || typeof x == 'number') {
            function _ztdele(ob, b) {
                for (var ii in ob) {
                    if (x == ii) {
                        delete __temp__[ii];
                    }
                }
                return ob;
            }
            _temp = _ztdele(__temp__, x);
        }

        else if (typeof x == 'object') {

            for (var ii in __temp__) {
                var _temp2 = new Object();
                _temp2[ii] = __temp__[ii];
                for (var jj in x) {
                    if (x[jj] in _temp2) {
                        delete __temp__[ii];
                        break;
                    }
                }
            }
            _temp = __temp__;
        }
        if (!callback)
            return _temp;
        else if (typeof callback !== "function")
            throw new Error("您的回调函数不是一个正确的方法");
        callback(_temp);
        return _temp;
    }


    //3.
    //从数组中删掉第i个元素(可用)
    //注释：(改变原数组)
    //  data为操作数组，i表示第几个
    __zbcBaseFunction__.prototype.del_i = function (data, x, callback) {
        if (typeof data !== "object")
            throw new Error("您要操作的对象不是一个正确的数组");
        if (!(typeof x == "number" || typeof x == "string"))
            throw new Error("参数x不是一个数字或字符串");
        var retrieval = function (y) {
            var I = parseInt(x);
            var temp = [];
            for (var i = 0; i < I - 1; i++) {
                temp.push(data.shift());
            }
            data.shift();
            for (var j = 0; j < I - 1; j++) {
                data.unshift(temp.pop());
            }
        }
        retrieval();
        if (!callback)
            return;
        else if (typeof callback !== "function")
            throw new Error("您的回调函数不是一个正确的方法");
        callback();
    }


    //4.
    //循环执行n次函数func
    __zbcBaseFunction__.prototype.do = function (func, x, callback) {
        if (typeof func !== "function")
            throw new Error("您要重复执行的操作不是一个正确的函数");
        var n = parseInt(x);
        for (var i = 0; i < x; i++) {
            func();
        }
        if (!callback)
            return;
        else if (typeof callback !== "function")
            throw new Error("您的回调函数不是一个正确的方法");
        callback();
    }


    
    //返回值区********************************************************************************************
    //1.
    //正则式检测(可用)
    //注释：
    //  返回一个obj{
    //      contents:[](每次出现时的字符串),
    //      posiitons:[](每次出现时的位置),
    //      total:(一共出现过几次)
    //    }
    __zbcBaseFunction__.prototype.exec = function (exp, str, callback) {
        if (typeof exp !== "object")
            throw new Error("正则式检测方法的第一个参数必须是正则式");
        if (typeof str !== "string")
            throw new Error("正则式检测方法的第二个参数应该是您要检测的字符串");
        var obj = {
            total: 0,
            contents: [],
            positions: []
        }
        try {
            var _temp
            while (_temp = exp.exec(str)) {
                obj.total++;
                obj.contents.push(_temp[0]);
                obj.positions.push(exp.lastIndex);
            }
        }
        catch (e) {
            console.log(e);
        }
        if (!callback)
            return obj;
        else if (typeof callback !== "function")
            throw new Error("您的回调函数不是一个正确的方法");
        callback();
        return obj;
    }


    //2.
    //时间组件(可用)
    __zbcBaseFunction__.prototype.getDate = new function () {
        var that = this;
        var temp = new Date();

        this.Year = temp.getFullYear();     //当年
        this.Month = temp.getMonth() + 1;   //当月
        this.Day = temp.getDate();          //当天
        this.weekday = temp.getDay();       //今天是当前周第几天

        this._how_many_days = new Date(that.Year, that.Month - 1, 0).getDate();     //上月有多少天
        this.how_many_days = new Date(that.Year, that.Month, 0).getDate();        //本月多少天

        this.Year_ = (temp.getFullYear()).toString();              //当年
        this.Month__ = (temp.getMonth()).toString();               //上月
        this.Month_ = (temp.getMonth() + 1).toString();            //当月
        this.Day_ = (temp.getDate()).toString();                   //当天

        this._Week = (function () {
            var _temp = [];

            for (var i = 0; i < 7; i++) {
                var tt = that.Day - that.weekday + i - 6;
                if (tt <= 0) {
                    _temp.push(that.Year_ + '-' + that.Month__ + "-" + (that._how_many_days + tt).toString());
                }
                else {
                    _temp.push(that.Year_ + '-' + that.Month_ + "-" + (tt).toString());
                }
            }
            return _temp;
        })();                           //本周(所有天)

        this._Month = (function () {

            var _temp = [];
            for (var i = 0; i < that.how_many_days; i++) {
                _temp.push(that.Year_ + '-' + that.Month_ + '-' + (i + 1).toString());
            }
            return _temp;
        })();                          //本月(所有天)


    }


    //DOM元素操作*****************************************************************************************

    //1.节点元素渐出方法(可用)
    //如果bull==true,则出去后的最后效果是display:none
    __zbcBaseFunction__.prototype.fadeOut = function (node, speed, bull,callback) {
        if (!node)
            throw new Error("您设置的节点元素不存在");
        if (typeof speed !== "number")
            throw new Error("您的渐出函数速度设置不是一个数字");
        if (speed < 1)
            throw new Error("您的渐出函数速度设置范围应设置在1以上");
        var level = 0.01;
        var step = function () {

            //document selector
            if (node.style)
                node.style.opacity = 1 - level;

                //$ selector
            else if (node[0].style)
                node[0].style.opacity = 1 - level;
            if (level < 1) {
                level += 0.01;
                setTimeout(step, speed);
            }
            else {

                //document selector
                if (node.style) {
                    if (bull)
                        node.style.display = "none";
                    node.style.marginLeft = '-999999px';
                }             

                //$ selector
                else if (node[0].style) {
                    if (bull)
                        node[0].style.display = "none";
                    node[0].style.marginLeft = '-999999px';
                }
                        
                if (!callback)
                    return;
                else if (typeof callback !== "function")
                    throw new Error("您的渐出操作回调的不是一个正确的函数");
                callback();
            }
        };
        setTimeout(step, speed);
    }


    //2.节点元素渐进方法(可用)
    //只对display:none的块起作用
    __zbcBaseFunction__.prototype.fadeIn = function (node, speed, callback) {
        if (!node)
            throw new Error("您设置的节点元素不存在");
        if (typeof speed !== "number")
            throw new Error("您的渐进函数速度设置不是一个数字");
        if (speed < 1)
            throw new Error("您的渐进函数速度设置范围应设置在1以上");

        //document selector
        if (node.style && node.style.display == "none")
            node.style.display = "block";

            //$ selector
        else if (node[0].style.display == "none")
            node[0].style.display = "block";
        var level = 0.01;
        var step = function () {

            //document selector
            if (node.style)
                node.style.opacity = 0 + level;

                //$ selector
            else if (node[0].style)
                node[0].style.opacity = 0 + level;
            if (level < 1) {
                level += 0.01;
                setTimeout(step, speed);
            }
            else {
                if (!callback)
                    return;
                else if (typeof callback !== "function")
                    throw new Error("您的渐进操作回调的不是一个正确的函数");
                callback();
            }
        };
        setTimeout(step, speed);
    }


    //3.添加类(可用)
    __zbcBaseFunction__.prototype.addClass = function (node, clas, callback) {
        if (!node)
            throw new Error("您的添加类操作没有指定一个正确的元素标签");
        if (!clas || typeof clas !== "string")
            throw new Error("您添加的类名称不是一个字符串");
        if (node)
            try {

                //docement selector
                for (var i = 0; i < node.attributes.length; i++) {
                    if (node.attributes[i].localName == "class") {
                        node.attributes[i].value += (" " + clas)
                    }
                }
            }
            catch (error) {

                //$ selector
                for (var i = 0; i < node[0].attributes.length; i++) {
                    if (node[0].attributes[i].localName == "class") {
                        node[0].attributes[i].value += (" " + clas)
                    }
                }
            }
        if (!callback)
            return;
        else if (typeof callback !== "function")
            throw new Error("您的回调函数不是一个正确的方法");
        callback();
    }


    //4.移除类(可用)
    __zbcBaseFunction__.prototype.removeClass = function (node, clas, callback) {
        if (!node)
            throw new Error("您的添加类操作没有指定一个正确的元素标签");
        if (!clas || typeof clas !== "string")
            throw new Error("您添加的类名称不是一个字符串");
        var L = clas.length;
        if (node)
            try {

                //document selector
                for (var i = 0; i < node.attributes.length; i++) {
                    if (node.attributes[i].localName == "class") {
                        var temp = node.attributes[i].value;
                        var temp1 = temp.slice(0, temp.indexOf(clas));
                        var temp2 = temp.slice(temp.indexOf(clas) + L, temp.length + 1);
                        var temp3 = (temp1 + temp2).replace(/^\s/, "");
                        node.attributes[i].value = temp3;
                        return;
                    }
                }
            }
            catch (error) {

                //$ selector
                for (var i = 0; i < node[0].attributes.length; i++) {
                    if (node[0].attributes[i].localName == "class") {
                        var temp = node[0].attributes[i].value;
                        var temp1 = temp.slice(0, temp.indexOf(clas));
                        var temp2 = temp.slice(temp.indexOf(clas) + L, temp.length + 1);
                        var temp3 = (temp1 + temp2).replace(/^\s/, "");
                        node[0].attributes[i].value = temp3;
                        return;
                    }
                }
            }
        if (!callback)
            return;
        else if (typeof callback !== "function")
            throw new Error("您的回调函数不是一个正确的方法");
        callback();
    }


    //5.将元素节点放到某元素里面去(可用)
    //要求把元素后坠进parent里面去
    __zbcBaseFunction__.prototype.putIn = function (node, parent, callback) {
        if (!node)
            throw new Error("您设置的节点元素不存在");
        if (typeof node !== "object")
            throw new Error("您要放进去的元素不是一个对象");
        if (typeof parent !== "object")
            throw new Error("您要放进的父元素不是一个对象");
        try {

            //对node和parent进行$selector和document选择器进行判断
            if (parent.childNodes && !node[0]) {
                var _temp = [], L = parent.childNodes.length;
                parent.insertBefore(node, parent.childNodes[L]);
            }
            else if (parent.childNodes && node[0]) {
                var _temp = [], L = parent.childNodes.length;
                parent.insertBefore(node[0], parent.childNodes[L]);
            }
            else if (parent[0].childNodes && !node[0]) {
                var _temp = [], L = parent[0].childNodes.length;

                parent[0].insertBefore(node, parent[0].childNodes[L]);
            }
            else if (parent[0].childNodes && node[0]) {
                var _temp = [], L = parent[0].childNodes.length;
                parent[0].insertBefore(node[0], parent[0].childNodes[L]);
            }
        }
        catch (e) {
            console.log(e)
            alert("error:无法将" + node + "节点放进" + parent + "目标节点中");
        }
        if (!callback)
            return;
        else if (typeof callback !== "function")
            throw new Error("您的回调函数不是一个正确的方法");
        callback();
    }


    //6.把元素放置在目标元素后面(可用)
    __zbcBaseFunction__.prototype.addTo = function (node, target, callback) {
        if (!node)
            throw new Error("您设置的节点元素不存在");
        if (typeof node !== "object")
            throw new Error("您要放进去的元素不是一个对象");
        if (typeof parent !== "object")
            throw new Error("您要放进的父元素不是一个对象");
        try {
            var L = 1;
            //对node和parent进行$selector和document选择器进行判断
            if (target.childNodes && !node[0]) {
                var _parent = target.parentElement;
                for (var i = 0; i < _parent.children.length; i++, L++) {
                    if (_parent.children[i] == target) {
                        _parent.insertBefore(node, _parent.childNodes[2 * L]);
                        break;
                    }
                }
            }
            else if (target.childNodes && node[0]) {
                var _parent = target.parentElement;
                for (var i = 0; i < _parent.children.length; i++, L++) {
                    if (_parent.children[i] == target) {
                        _parent.insertBefore(node[0], _parent.childNodes[2 * L]);
                        break;
                    }
                }
            }
            else if (target[0].childNodes && !node[0]) {
                var _parent = target[0].parentElement;
                for (var i = 0; i < _parent.children.length; i++, L++) {
                    if (_parent.children[i] == target[0]) {
                        _parent.insertBefore(node, _parent.childNodes[2 * L]);
                        break;
                    }
                }
            }
            else if (target[0].childNodes && node[0]) {
                var _parent = target[0].parentElement;
                for (var i = 0; i < _parent.children.length; i++, L++) {
                    if (_parent.children[i] == target[0]) {
                        _parent.insertBefore(node[0], _parent.childNodes[2 * L]);
                        break;
                    }
                }
            }
        }
        catch (e) {
            console.log(e)
            alert("error:无法将" + node + "节点放进" + parent + "目标节点中");
        }
        if (!callback)
            return;
        else if (typeof callback !== "function")
            throw new Error("您的回调函数不是一个正确的方法");
        callback();
    }


    //7.设置元素为可拖动(初步设计为只对div生效,事实上似乎对很多东西都生效)%\!!!!不可用
    //node为操作节点
    //bull是设置是否可拖动.为true或false
    //per是一个0到1的有效数字(大于1一概等同于1),是设置节点顶端到节点从上起算高度的百分比(为有效拖动区域)
    __zbcBaseFunction__.prototype.setDraggable = function (node, bull, per, callback) {
        if (!node)
            throw new Error("您设置的节点元素不存在");
        if (typeof node !== "object" && typeof node !== "string")
            throw new Error("您要设置的元素不是一个对象或所有对象");

        function setdrag(node, bull2) {

            //document selector
            if (node.style && bull2) {
                node.draggable = true;
                var _start_x, _start_y, _end_x, _end_y;     //创建初始坐标、结束坐标容器
                var _X, _Y;                                 //创建偏差值容器
                var posi_T = 0, posi_L = 0;                 //创建移动后的设置坐标容器
                node.onmousedown = function (e) {
                    var event = e || window.event;
                    _start_x = event.clientX;
                    _start_y = event.clientY;
                    if (((_start_y - node.offsetTop) / node.clientHeight) < per) {
                        var panduanqi = true;
                        dend(e, panduanqi);
                    }
                    else if (((_start_y - node.offsetTop) / node.clientHeight) >= per) {
                        var panduanqi = false;
                        dend(e, panduanqi);
                    }
                }
                function dend(e, panduanqi) {
                    node.ondragend = function (e) {
                        if (!panduanqi) { return; }
                        var event = e || window.event;
                        _end_x = event.clientX;
                        _end_y = event.clientY;
                        _X = _end_x - _start_x;
                        _Y = _end_y - _start_y;
                        posi_T += _Y; posi_L += _X;
                        node.setAttribute("style", "position:relative;top:" + posi_T + "px;left:" + posi_L + "px;");
                    }
                }
            }

                //document selector
            else if (node.style && !bull2) {
                node.draggable = false;
                node.onmousedown = function (e) { }
                node.ondragend = function (e) { }
            }
                //$ selector
            else if (node[0].style && bull2) {
                node[0].draggable = true;
                var _start_x, _start_y, _end_x, _end_y;     //创建初始坐标、结束坐标容器
                var _X, _Y;                                 //创建偏差值容器
                var posi_T = 0, posi_L = 0;                 //创建移动后的设置坐标容器
                node[0].onmousedown = function (e) {
                    var event = e || window.event;
                    _start_x = event.clientX;
                    _start_y = event.clientY;
                    if (((_start_y - node[0].offsetTop) / node[0].clientHeight) < per) {
                        var panduanqi = true;
                        dend(e, panduanqi);
                    }
                    else if (((_start_y - node[0].offsetTop) / node[0].clientHeight) >= per) {
                        var panduanqi = false;
                        dend(e, panduanqi);
                    }
                }
                function dend(e, panduanqi) {
                    node[0].ondragend = function (e) {
                        if (!panduanqi) { return; }
                        var event = e || window.event;
                        _end_x = event.clientX;
                        _end_y = event.clientY;
                        _X = _end_x - _start_x;
                        _Y = _end_y - _start_y;
                        posi_T += _Y; posi_L += _X;
                        node[0].setAttribute("style", "position:relative;top:" + posi_T + "px;left:" + posi_L + "px;");
                    }
                }
            }

                //$ selector
            else if (node[0].style && !bull2) {
                node[0].draggable = false;
                node[0].onmousedown = function (e) { }
                node[0].ondragend = function (e) { }
            }
        }
        var _x = 0, _y = 0;
        try {
            if (typeof node !== "string") {
                setdrag(node, bull)
            }
            else if (typeof node == "string" && node === "all") {
                var ancestor = document.getElementsByTagName('body')[0];
                var last_el = ancestor;                         //上一次点击的元素

                function let_it_go(el, b) {
                    var _start_x, _start_y, _end_x, _end_y;
                    //var _x = _x || 0, _y = _y || 0;
                    if (!b) {
                        el.draggable = false;
                        el.onmousedown = function () { };
                        el.ondragend = function () { };
                        return;
                    }
                    else {
                        el.draggable = true;
                        el.ondragenter = function () {
                            _start_x = event.clientX || window.event.clientX;
                            _start_y = event.clientY || window.event.clientY;
                            console.log(11111)
                        };
                        el.ondragend = function () {
                            _end_x = event.clientX || window.event.clientX;
                            _end_y = event.clientY || window.event.clientY;
                            _x += (_end_x - _start_x);
                            _y += (_end_y - _start_y);
                            console.log(_x, _y)
                            var temp = el.getAttribute("style");
                            console.log(temp)
                            el.setAttribute("style", "position:relative;top:" + _y + "px;left:" + _x + "px");
                        };
                    }
                }

                last_el.onmousedown = function (e) {
                    var event = e || window.event;
                    var this_el = event.srcElement || event.target; //本次点击的元素
                    last_el = this_el;
                    console.log(this_el, this_el.parentElement)

                    let_it_go(last_el, true)






                }






            }
        }
        catch (e) {
            console.log(e);
            alert("error:设置" + node + "的拖动操作失败");
            return;
        }
        if (!callback)
            return;
        else if (typeof callback !== "function")
            throw new Error("您的回调函数不是一个正确的方法");
        callback();
    }






    var obj;
    obj = new __zbcBaseFunction__();
    return obj;

}))







//开发代码框架：
//zbc.prototype.xxxxxxxxx = function () {


//}

//if (!callback)
//    return;
//else if (typeof callback !== "function")
//    throw new Error("您的回调函数不是一个正确的方法");
//callback();


//if (typeof func !== "function")
//  throw new Error("您要重复执行的操作不是一个正确的函数");