/*!
 * 
 *             @project     katerina
 *             @author      Max Eremin
 *             @build       Sunday, June 24, 2018 4:45 PM
 *             @release     sights.js 91f4483fefade3f8ac08
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
return webpackJsonp([0],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(10);


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _cabinet = __webpack_require__(11);

var _cabinet2 = _interopRequireDefault(_cabinet);

var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

var _sight = __webpack_require__(13);

var _sight2 = _interopRequireDefault(_sight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function ($) {
    var getCookie = function getCookie(name) {
        var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : null;
    };

    var createDataTable = function createDataTable(data) {
        // Name
        // Keys
        // Coords
        // Tags
        // Email
        // Rate
        // Email
        // Actions
    };

    var onPageLoad = function onPageLoad(token) {
        $.ajax({
            method: "GET",
            url: "http://localhost:3000/api/admin/all-sights",
            dataType: "json",
            headers: {
                "Authorization": "Bearer " + token
            }
        }).done(function (items) {
            createDataTable(items);
        });
    };

    $(document).ready(function () {
        var token = getCookie("kamin");
        if (!token) {
            return window.location.href = "/admin/home/index";
        }
        onPageLoad(token);
    });
})(_jquery2.default);

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var update = __webpack_require__(0)(
  __webpack_require__(12)
, {"hmr":true});
if(false) {
  module.hot.accept("!!../../../node_modules/file-loader/dist/cjs.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!../../../node_modules/sass-loader/lib/loader.js??ref--1-3!./cabinet.scss", function() {
    update(require("!!../../../node_modules/file-loader/dist/cjs.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!../../../node_modules/sass-loader/lib/loader.js??ref--1-3!./cabinet.scss"));
  });

  module.hot.dispose(function() { update(); });
}

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = "/cabinet.css";

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const moment = __webpack_require__(3);
const Comment = __webpack_require__(14);

class Sight {
    constructor({ 
        id, 
        key,
        name, 
        text, 
        thumbnail, 
        wikiLink, 
        updatedAt,
        coords,
        tags,
        link,
        rate,
        comments,
        email,
        comfirmed
    }) {
        this.id = id;
        this.key = key;
        this.name = name;
        this.text = text;
        this.thumbnail = thumbnail;
        this.wikiLink = wikiLink;
        this.updatedAt = moment(updatedAt);
        this.coords = coords;
        this.tags = tags;
        this.link = link;
        this.rate = rate;
        this.email = email;
        this.comfirmed = comfirmed;
        
        if(comments && typeof comments === "object") {
            this.comments = 
                comments.map(comment => new Comment(comment));
        } else if(typeof comments === "number") {
            this.comments = comments;
        }
    }
    addDetail(detail) {
        this.thumbnail = detail.thumbnail;
        this.wikiLink = detail.wikiLink;
        this.updatedAt = moment(detail.updatedAt);
        this.text = detail.text;
    }
    get existKey() {
        return this.key.key2 || this.key.key1;
    }
};

module.exports = Sight;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const moment = __webpack_require__(3);

class Comment {
    constructor({
        email,
        publishAt,
        name,
        flag,
        text
    }) {
        this.email = email;
        this.publishAt = moment(publishAt);
        this.name = name;
        this.flag = flag;
        this.text = text;
    }
};

module.exports = Comment;

/***/ })
],[9]);
});
//# sourceMappingURL=sights.js.map