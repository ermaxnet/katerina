/*!
 * 
 *             @project     katerina
 *             @author      Max Eremin
 *             @build       Sunday, June 24, 2018 4:45 PM
 *             @release     home.js 91f4483fefade3f8ac08
 *             @copyright   Copyright (c) 2018, Max Eremin
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return webpackJsonp([1],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(5);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _home = __webpack_require__(6);

var _home2 = _interopRequireDefault(_home);

var _background = __webpack_require__(8);

var _background2 = _interopRequireDefault(_background);

var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RAINBOW = {
    1: "#D50000",
    2: "#FF6D00",
    3: "#FFD600",
    4: "#00C853",
    5: "#0091EA",
    6: "#2962FF",
    7: "#AA00FF"
};

var random = function random() {
    var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 7;

    return Math.floor(Math.random() * (max - min + 1) + 1);
};

var rainbowText = function rainbowText(context) {
    var letters = context.text();
    context.text("");
    var lettersContext = (0, _jquery2.default)("<div class=\"letters-context\"></div>").appendTo(context);
    for (var i = 0; i < letters.length; i++) {
        var color = random();
        (0, _jquery2.default)("<span>" + letters[i] + "</span>").css("color", RAINBOW[color]).appendTo(lettersContext);
    }
};

var makeLogo = function makeLogo(context) {
    context.find(".admin-mark").remove();
    var width = context.width();
    var height = context.height();
    var actualWidth = context.find(".letters-context").width();
    var letterHeight = context.find("span:eq(0)").height();
    var color = random();
    (0, _jquery2.default)("<mark class=\"admin-mark\">admin</mark>").css({
        "right": (width - actualWidth) / 2,
        "bottom": (height - letterHeight) / 2 - 10,
        "color": RAINBOW[color]
    }).appendTo(context);
};

function debounce(func, ms) {
    var timer = null;
    return function () {
        var _this = this;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var onComplete = function onComplete() {
            func.apply(_this, args);
            timer = null;
        };
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(onComplete, ms);
    };
};

var activeTextField = function activeTextField(field) {
    if (field.val() || field.is(":-webkit-autofill")) {
        field.addClass("on-full");
    } else {
        field.removeClass("on-full");
    }
};

var initTextField = function initTextField(field) {
    var wrapper = field.closest(".field-wrapper");
    field.on("focus", function () {
        wrapper.addClass("on-focus");
    }).on("blur", function () {
        wrapper.removeClass("on-focus");
        activeTextField(field);
    });
    activeTextField(field);
};

var onPageLoad = function onPageLoad(context) {
    var header = context.find(".page-header");
    var loginContext = context.find("#login");
    loginContext.css({
        "margin-top": header.height() + 30
    });
    loginContext.css("visibility", "visible");
    loginContext.find(".field").each(function (idx, element) {
        return initTextField((0, _jquery2.default)(element));
    });
};

(0, _jquery2.default)(document).ready(function () {
    var appName = (0, _jquery2.default)(".app-name");
    rainbowText(appName);
    makeLogo(appName);
    (0, _jquery2.default)(window).on("resize", debounce(function () {
        return makeLogo(appName);
    }, 20));

    onPageLoad((0, _jquery2.default)(".page"));
});

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var update = __webpack_require__(0)(
  __webpack_require__(7)
, {"hmr":true});
if(false) {
  module.hot.accept("!!../../../node_modules/file-loader/dist/cjs.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!../../../node_modules/sass-loader/lib/loader.js??ref--1-3!./home.scss", function() {
    update(require("!!../../../node_modules/file-loader/dist/cjs.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!../../../node_modules/sass-loader/lib/loader.js??ref--1-3!./home.scss"));
  });

  module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "/home.css";

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = "/background.jpg";

/***/ })
],[4]);
});
//# sourceMappingURL=home.js.map