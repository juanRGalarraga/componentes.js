/**
 * Esqueleto para definir un objeto. 
 *
 */

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

var ProtoName = (function () {
    
    function ProtoName(selector) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, ProtoName);

        this.setDefaults();

        if (ProtoName.isDomElement(selector)) {
            this.select = selector;
        } else {
            this.select = document.querySelector(selector);
        }
        this._initOptions(options);
    }
    
    _createClass(
        ProtoName,
        //Prototype propertys...
        [
            {
                key: "setDefaults",
                value: function setDefaults() {
                    // this.addOption = "...";
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
            }
        ],

        //Static propertys...
        [
            {
                key: "isDomElement",
                value: function isDomElement(o) {
                    return (
                        typeof HTMLElement === "undefined" ? 
                        "undefined" : 
                        typeof HTMLElement) === "object" ? 
                        o instanceof HTMLElement :
                        o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string";
                },
            },
        ]
    );
    return ProtoName;
})();
