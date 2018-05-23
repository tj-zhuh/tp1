

define(function (require) {

    var ret = {};

    // Node描述菜单节点
    var Node = (function () {

        function __Node__() {
            this.li;  // 节点元素
            this.menuId;
            this.menuName;
            this.folder;
            this.active = false; // 是否激活
            this.children = [];  // 孩子
            this.parent = null;  // 父亲（一级菜单的parent是null）
            this.level;  // 层级（一级菜单的level是1）    
            this.rank;   // 排行（第一个节点排行是0）           
        }

        // 初始化一个菜单节点
        // 参数：菜单数据   包含以下字段( menuId  menuName  folder  parentId )
        __Node__.prototype.init = function (menuData, parent) {
            this.menuId = menuData.menuId;
            this.menuName = menuData.menuName;
            this.folder = menuData.folder;
            this.parent = parent;

            if (parent == null) {
                this.level = 1;
            } else {
                this.level = parent.level + 1;
                this.parent.children.push(this);
            }
        }

        __Node__.prototype.draw = function () {

            // 创建li元素
            this.li = document.createElement('li');
            this.li.setAttribute('data-menuId', this.menuId);

            // 将节点添加到容器中
            // 在此过程中，节点的rank属性会被赋值
            cts.addElement(this);

            // 对于lv1，需要额外的绘制图标和选中时的红条 
            if (this.level == 1) {
                var img = document.createElement('img');
                img.src = 'images/micon' + this.rank + '.png';
                this.li.appendChild(img);

                var bar = document.createElement('cite');
                this.li.appendChild(bar);
            }

            // 编写菜单文字
            var text = document.createTextNode(this.menuName);
            this.li.appendChild(text);
        }
                
        __Node__.prototype.dispose = function () {
            this.li = null;
            this.active = false;
            this.rank = -1;
        }

        __Node__.prototype.setActive = function (flag) {

            if (this.active == flag) return;

            this.active = flag;

            if (flag) {
                helper.addClass(this.li, 'active');
            } else {
                helper.removeClass(this.li, 'active');
                helper.removeClass(this.li, 'high');
            }
        }

        __Node__.prototype.setHigh = function () {
            
            helper.addClass(this.li, 'high');
        }

        return __Node__;

    }())

    // Holder描述某级菜单的容器
    var Holder = (function () {

        function __Holder__() {

            this.ul; // ul元素

            this.nodes = [];   // node数组

        }

        __Holder__.prototype.addNode = function (node) {

            // 为node设置其rank属性
            node.rank = this.nodes.length;

            // 添加node
            this.nodes.push(node);

            // 添加html元素
            try {
                this.ul.appendChild(node.li);
            }
            catch (e) {
                debugger
            }
        }  

        __Holder__.prototype.clear = function () {
            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].dispose();
            }
            while (this.ul.firstChild) {
                this.ul.removeChild(this.ul.firstChild);
            }
            this.nodes.splice(0, this.nodes.length);
        }

        __Holder__.prototype.clearActive = function () {
            for (var i = 0; i < this.nodes.length; i++) {
                if (this.nodes[i].active) {
                    this.nodes[i].setActive(false);
                }
            }
        }

        __Holder__.prototype.show = function () {
            this.ul.style.display = 'block';
        }

        __Holder__.prototype.hide = function () {
            this.ul.style.display = 'none';
        }

        return __Holder__;

    }())

    // cts是容器管理器，管理所有的Holder
    var cts = (function () {

        var holders = [];

        var __cts__ = {};

        __cts__.maxLevel = 0;

        __cts__.init = function (arr) {
            for (var i = 0; i < arr.length; i++) {
                var holder = new Holder();
                holder.ul = arr[i];
                holders.push(holder);
            }

            this.maxLevel = arr.length;
        }

        // 获得指定level的容器
        __cts__.getByLevel = function (level) {
            return holders[level - 1];
        }

        // 给定level，获得比level更深的容器数组（不包括level层本身）
        __cts__.getDeeper = function (level) {
            return holders.slice(level);
        }

        __cts__.addElement = function (node) {
            var holder = this.getByLevel(node.level);
            holder.addNode(node);
        }

        __cts__.clearLevel = function (level) {
            var holder = this.getByLevel(node.level);
            holder.clear();
        }



        return __cts__;

    })()

    // evt是事件管理器，负责Node点击事件的处理
    var evt = (function () {

        var __evt__ = {};

        __evt__.bind = function (node) {

            // click事件绑定
            helper.addHandler(node.li, 'click', function (e) {
                __evt__.activate(node);
            })
        }

        __evt__.activate = function (node) {

            // 如果是active的，直接返回
            if (node.active) return;

            // 下面两行代码，取消所有兄弟节点的激活状态
            var holder = cts.getByLevel(node.level);
            holder.clearActive();

            // 将节点设为激活的
            node.setActive(true);

            // 将更低级别的节点全部清空
            var lowerHolders = cts.getDeeper(node.level);
            for (var i = 0; i < lowerHolders.length; i++) {
                lowerHolders[i].clear();
                lowerHolders[i].hide();
            }

            // 如果有孩子
            if (node.children.length > 0) {                

                if (lowerHolders.length >= 0) {

                    // 节点添加high标签，表示它有孩子
                    node.setHigh();

                    for (var i = 0; i < node.children.length; i++) {

                        // 绘制元素
                        node.children[i].draw();  

                        // 绑定事件
                        __evt__.bind(node.children[i]);

                        // 添加到Holder中
                        lowerHolders[0].addNode(node.children[i]);
                    }

                    lowerHolders[0].show();

                    // 设置第一个孩子为active
                    __evt__.activate(node.children[0])

                } else {

                    helper.log('菜单数据异常，加载错误');

                }

            } else { // 没孩子的情况，说明是根节点，需要加载页面

                // 找到页面路径
                var url = node.folder + '/page.html';
                var tmp = node;
                for (var i = 0 ; i < cts.maxLevel; i++) {
                    tmp = tmp.parent;
                    if (tmp) {
                        url = tmp.folder + '/' + url;
                    } else
                        break;
                }
                url = 'develop/' + url;

                // 加载页面
                loadPage(url);
            }
        }

        return __evt__;

    })()

    // allNodes是所有菜单的节点
    var allNodes = [];

    // 打开页面的方法，由外部传入
    var loadPage = null;

    // helper是帮助类
    var helper = (function () {

        var __helper__ = {};

        // 根据menuId找到Node对象
        __helper__.getNodeByMenuId = function (menuId) {
            for (var i = 0; i < allNodes.length; i++) {
                if (allNodes[i].menuId == menuId)
                    return allNodes[i];
            }
        }

        __helper__.addHandler = function (element, type, handler) {
            if (element.addEventListener) {
                element.addEventListener(type, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent('on' + type, handler);
            } else {
                element['on' + type] = handler;
            }
        }

        __helper__.hasClass = function (obj, cls) {
            return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        }

        __helper__.addClass = function (obj, cls) {
            if (!this.hasClass(obj, cls)) obj.className += (obj.className ? " " : "") + cls;
        }

        __helper__.removeClass = function (obj, cls) {
 
            if (this.hasClass(obj, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                obj.className = obj.className.replace(reg, ' ');
                obj.className = obj.className.replace(/^\s+$/, '');
            }
        }

        __helper__.log = function (msg) {
            if (typeof console === 'object' && typeof console.log === 'function')
                console.log(msg);
        }

        return __helper__;

    })()

    // 初始化
    // 参数1：菜单数据  必须包含以下字段( menuId  menuName  folder  parentId )
    // 参数2：各级菜单的容器列表
    ret.init = function (menus, arr) {

        cts.init(arr);

        var loopCount = 0,
            maxCount = menus.length;

        // 最多循环menus.length次，防止意外的无限循环
        while (loopCount++ < maxCount) {

            for (var i = 0; i < menus.length; i++) {
                var menu = menus[i];
                if (menu.parentId == 'root') {
                    var node = new Node();
                    node.init(menu, null);
                    node.draw();
                    evt.bind(node);
                    allNodes.push(node);
                    menus.splice(i, 1);
                    break;
                } else {
                    var parent = helper.getNodeByMenuId(menu.parentId);
                    if (parent) {
                        var node = new Node();
                        node.init(menu, parent);
                        allNodes.push(node);
                        menus.splice(i, 1);
                        break;
                    }
                }
            }
        }

        // 自动激活第一个节点
        if (allNodes.length > 0) {
            evt.activate(allNodes[0]);
        }        
    }

    // 传入加载页面的方法
    ret.setLoadPageFunc = function (fn) {
        loadPage = fn;
    }

    return ret;
})