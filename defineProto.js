__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyProtoObject", function () {
    return MyProtoObject;
});
function _typeof(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof(obj) {
            return typeof obj;
        };
    } else {
        _typeof = function _typeof(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
    }
    return _typeof(obj);
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}

var MyProtoObject = (function () {
    function MyProtoObject(selector) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        _classCallCheck(this, MyProtoObject);
        this.setDefaults();
        if (MyProtoObject.isDomElement(selector)) {
            this.select = selector;
        } else {
            this.select = document.querySelector(selector);
        }
        this._initOptions(options);
    }
    _createClass(
        MyProtoObject,
        [
            {
                key: "setDefaults",
                value: function setDefaults() {
                    
                },
            },
            {
                key: "_initOptions",
                value: function _initOptions(options) {
                    for (var key in options) {
                        if (options.hasOwnProperty(key)) {
                            this[key] = options[key];
                        }
                    }
                },
            },
        ],
        [
            {
                key: "isDomElement",
                value: function isDomElement(o) {
                    return (typeof HTMLElement === "undefined" ? "undefined" : _typeof(HTMLElement)) === "object" ? o instanceof HTMLElement : o && _typeof(o) === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string";
                },
            },
        ]
    );
    return MyProtoObject;
})();
/* harmony default export */ __webpack_exports__["default"] = MyProtoObject;
