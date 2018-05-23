; (function (root, factory) {
    if (typeof define == 'function' && define.amd) {
        require.config({
            paths: {
                "utilAlert": "../../../../../../js/modules/utilFuncs/utilAlert",

            }
        })
        define(function (require) {
            var utilAlert = require('utilAlert');

            return factory(utilAlert);
        })
    }
    else {
        root.util = factory(root.utilAlert)
    }
}(this, function (utilAlert) {

    var __theWantedFunction__ = {};

    //统合alert方法
    __theWantedFunction__.alert = utilAlert;




    return __theWantedFunction__;

}))