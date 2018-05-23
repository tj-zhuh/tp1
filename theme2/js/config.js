 

var config = (function () {

    var ret = {};

    // 获得require.config的内容
    // 参数baseUrl是从页面入口js到根目录的路径(string)，或者是页面的菜单级数（一级菜单是1，二级是2，以此类推，最高到4）
    ret.getPaths = function (baseUrl) {

        if (typeof baseUrl === 'number') {
            switch (baseUrl) {
                case 1: baseUrl = '../../'; break;
                case 2: baseUrl = '../../../'; break;
                case 3: baseUrl = '../../../../'; break;
                case 4: baseUrl = '../../../../../'; break;
            }
        }

        if (typeof baseUrl !== 'string')
            baseUrl = '';

        var modulePaths = {
            "jquery": "js/modules/jquery-1.12.4",
            "echarts": "js/modules/echarts-3.3.2",
            //"themeBar": "theme/js/bar",
            //"themePie": "theme/js/pie",
            "tj": "js/modules/tj",
            "chart": "theme2/js/chart",
            "util":"js/modules/util"
        };

        var obj = {};

        for (var i in modulePaths) {
            obj[i] = baseUrl + modulePaths[i];
        }

        return obj;
    } 

    return ret;
})()