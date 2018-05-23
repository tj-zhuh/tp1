; (function (root, factory) {
    if (typeof define == 'function' && define.amd) {
        define(function (require) { return factory(); })
    }
    else {
        root.utilAlert = factory()
    }
}(this, function () {


    //窗口对象默认配置
    var defOption = {
        winEl: '',
        winHead: '',
        lock: false, //锁定位置
        lockX: false, //锁定水平位置
        lockY: false, //锁定垂直位置
    }

  
    var pp;

    




    //确定父元素
    var _parent = window.parent.document.getElementsByTagName('body')[0];



    //util.alert具体的实现函数
    var __theWantedFunction__ = function (e,func) {

        var zhandlersHelper = {

            //关闭窗口事件(兼容ie8)
            closeWin: function () {
                var that = this;
                _parent.removeChild(_parent.childNodes[_parent.childNodes.length - 1]);
                _parent.removeChild(_parent.childNodes[_parent.childNodes.length - 1]);
                pp = null;

                if(typeof func==='function'){func()}
            },

        }


        //创建一个iframe外的模态膜
        var membrane = window.parent.document.createElement('div');
        membrane.style.width = "100%";
        membrane.style.height = "100%";
        membrane.style.position = "fixed";
        membrane.style.top = 0;
        membrane.className = 'membrane';
        _parent.appendChild(membrane);
   
        //**创建一个iframe外的可移动窗口**//
        //创建一个窗体
        var alertDiv = window.parent.document.createElement('div');
        alertDiv.className = 'utilAlert';
        _parent.appendChild(alertDiv);

        //创建一个winTitle
        var winTitle = window.parent.document.createElement('div');
        winTitle.className = 'utilAlertTitle';
        winTitle.innerHTML = '警告:';

        //创建一个容纳text的div
        var winTextArea = window.parent.document.createElement('div');
        winTextArea.className = 'utilAlertTextArea';

        var forwinTextArea = window.parent.document.createElement('div');
        forwinTextArea.className = 'forwinTextArea';

        forwinTextArea.innerHTML = '<br/>&nbsp;&nbsp;&nbsp;&nbsp;' + e;

        //创建一个按钮
        var alertBtn = window.parent.document.createElement('div');
        alertBtn.className = 'utilAlertConfirmBtn';

        







        //全塞进去
        winTextArea.appendChild(forwinTextArea);
        alertDiv.appendChild(winTitle);
        alertDiv.appendChild(winTextArea);
        alertDiv.appendChild(alertBtn);

        //注册膜的点击事件(点击删掉窗口)
        membrane.addEventListener ? membrane.addEventListener('click', zhandlersHelper.closeWin) : membrane.attachEvent('onclick', zhandlersHelper.closeWin);

        //注册窗口确定按钮的点击事件(窗口是删掉状态)
        alertBtn.addEventListener ? alertBtn.addEventListener('click', zhandlersHelper.closeWin) : alertBtn.attachEvent('onclick', zhandlersHelper.closeWin);

        //设置窗口为可移动

        //创建一个窗口构造函数
        var WIN = function () {

            var startX = startY = 0;
            var _X;
            var _Y;
            var OPTION = {
                winEl: alertDiv,
                winHead: winTitle
            };
            var _this = {
                handle: null,
            };

            var handlersHelper = {

                //开始拖拽
                startDrag: function (event) {

                    var el = OPTION.winEl;
                    var el_head = null;

                    _X = (parseInt(el.style.left.substring(0, el.style.left.length - 1)) || el.offsetLeft);
                    _Y = (parseInt(el.style.top.substring(0, el.style.top.length - 1)) || el.offsetTop);

                    startX = event.clientX    //初始坐标定位
                    startY = event.clientY   //初始坐标定位

                    if (OPTION.winHead) {
                        el_head = typeof OPTION.winHead == 'string' ? document.getElementById(OPTION.winHead) : OPTION.winHead
                        el_head.addEventListener ? el_head.addEventListener('mousemove', handlersHelper.onDrag, false) : el_head.attachEvent('onmousemove', handlersHelper.onDrag);
                    }
                    else {
                        el.addEventListener ? el.addEventListener('mousemove', handlersHelper.onDrag, false) : el.attachEvent('onmousemove', handlersHelper.onDrag);
                    }

                    //取消关联浏览器的事件默认动作
                    event.preventDefault && event.preventDefault();
                    //_this.handle.setCapture && _this.handle.setCapture();

                    if (typeof OPTION.func1 == 'function') {
                        OPTION.func1();
                    }
                },

                //拖拽过程中
                onDrag: function (event) {

                    if (OPTION.lock) { return; }


                    var el = OPTION.winEl;
                    var event = event || window.event;

                    var e_X = event.clientX
                    var e_Y = event.clientY

                    //el.style.position = 'relative';

                    var iTop = _Y + (e_Y - startY);
                    var iLeft = _X + (e_X - startX);

                    OPTION.lockY || (el.style.top = iTop + 'px');
                    OPTION.lockX || (el.style.left = iLeft + 'px');

                    if (typeof OPTION.func2 == 'function') {
                        OPTION.func2();
                    }
                },

                //拖拽完成(解绑mousemove事件)
                overDrag: function () {
                    var el = OPTION.winEl;
                    var el_head = typeof OPTION.winHead == 'string' ? document.getElementById(OPTION.winHead) : OPTION.winHead;
                    if (!!el_head) {
                        el_head.removeEventListener('mousemove', handlersHelper.onDrag, false);
                    }
                    el.removeEventListener('mousemove', handlersHelper.onDrag, false);
                    if (typeof OPTION.func3 == 'function') {
                        OPTION.func3();
                    }
                },

                //获取maxContainer
                identify: function (id) {
                    return (typeof id == 'string' ? document.getElementById(id) : id);
                },

                extend: function () {

                    var _temp = arguments[0];

                    for (var i = 1; i < arguments.length; i++) {

                        for (var j in arguments[i]) {
                            _temp[j] = arguments[i][j]
                        }
                    }
                    return _temp;
                }
            }


            //窗口对象可配置化
            this.config = function (option) {

                OPTION = handlersHelper.extend({}, defOption, option);

                //_this.handle = handlersHelper.identify(OPTION.windowId);

                return OPTION;
            }

            //窗口对象初始化
            this.init = function (bul) {

                var that = this;

                var el = OPTION.winEl;

                //*窗口具体移动方案*//
                if (bul) {

                    //绑定mousedown事件
                    el.addEventListener ? el.addEventListener('mousedown', handlersHelper.startDrag, false) : el.attachEvent('onmousedown', handlersHelper.startDrag);

                    //绑定mouseup事件(解绑mousemove事件)
                    el.addEventListener ? el.addEventListener('mouseup', handlersHelper.overDrag, false) : el.attachEvent('onmouseup', handlersHelper.overDrag);
                }
                else {
                    //绑定mousedown事件
                    window.parent.document.addEventListener ? window.parent.document.addEventListener('mousedown', handlersHelper.startDrag, false) : window.parent.document.attachEvent('onmousedown', handlersHelper.startDrag);

                    //绑定mouseup事件(解绑mousemove事件)
                    window.parent.document.addEventListener ? window.parent.document.addEventListener('mouseup', handlersHelper.overDrag, false) : window.parent.document.attachEvent('ononmouseup', handlersHelper.overDrag);
                }
                //_this.handle.setCapture && _this.handle.setCapture();

            }

            //*对窗口操作(开发者自添加部分)*//

            //添加个人函数

        }

        pp = new WIN();
        pp.config({
            winEl: alertDiv,
            winHead: winTitle
        })
        pp.init(true);


    }


    return __theWantedFunction__;

}))