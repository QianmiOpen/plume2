"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var prop_types_1 = __importDefault(require("prop-types"));
var react_1 = __importDefault(require("react"));
var pql_1 = require("./pql");
var ql_1 = require("./ql");
var type_1 = require("./type");
/**
 * 通过分析relaxProps构成，来判断@Relax需不需要订阅store的变化
 * @param relaxProps
 */
exports.isRxRelaxProps = function (relaxProps) {
    for (var prop in relaxProps) {
        var propValue = relaxProps[prop];
        if ((type_1.isString(propValue) && prop !== 'viewAction') ||
            type_1.isArray(propValue) ||
            propValue instanceof ql_1.QueryLang) {
            return true;
        }
    }
    return false;
};
/**
 * Relax Container
 * 负责注入relaxProps属性对应的值
 * @param Wrapper
 */
function RelaxContainer(Wrapper) {
    var _a;
    return _a = /** @class */ (function (_super) {
            __extends(Relax, _super);
            function Relax(props, context) {
                var _this = _super.call(this, props) || this;
                _this._handleStoreChange = function (state) {
                    if (_this._isMounted) {
                        _this.setState({
                            storeState: state
                        });
                    }
                };
                _this._isMounted = false;
                _this.state = { storeState: {} };
                //判断是不是需要响应store的状态变化
                _this._isNeedRxStore = exports.isRxRelaxProps(Relax.relaxProps);
                if (_this._isNeedRxStore) {
                    context._plume$Store.subscribe(_this._handleStoreChange);
                }
                return _this;
            }
            Relax.prototype.componentWillMount = function () {
                this._isMounted = false;
                //计算一次relaxProps
                this._relaxProps = this._computeRelaxProps();
                //will drop on production env
                if (process.env.NODE_ENV != 'production') {
                    if (this.context['_plume$Store']._opts.debug) {
                        var relaxData = function (relaxProps) {
                            var data = {};
                            //filter viewAction and function
                            for (var prop in relaxProps) {
                                if (prop === 'viewAction' ||
                                    typeof relaxProps[prop] === 'function') {
                                    continue;
                                }
                                data[prop] = relaxProps[prop];
                            }
                            return data;
                        };
                        console.groupCollapsed &&
                            console.groupCollapsed(Relax.displayName + " will mount rx store: " + this._isNeedRxStore + " \uD83D\uDE80 ");
                        console.log('props:|>', JSON.stringify(this.props, null, 2));
                        console.log('relaxProps:|>', JSON.stringify(relaxData(this._relaxProps), null, 2));
                        console.groupEnd && console.groupEnd();
                    }
                }
            };
            Relax.prototype.componentDidMount = function () {
                this._isMounted = true;
            };
            Relax.prototype.componentWillUpdate = function () {
                this._isMounted = false;
            };
            Relax.prototype.componentDidUpdate = function () {
                this._isMounted = true;
            };
            Relax.prototype.shouldComponentUpdate = function (nextProps) {
                var newRelaxProps = this._computeRelaxProps();
                if (!immutable_1.is(immutable_1.fromJS(this.props), immutable_1.fromJS(nextProps)) ||
                    !immutable_1.is(immutable_1.fromJS(this._relaxProps), immutable_1.fromJS(newRelaxProps))) {
                    this._relaxProps = newRelaxProps;
                    if (process.env.NODE_ENV != 'production') {
                        if (this.context['_plume$Store']._opts.debug) {
                            var relaxData = function (relaxProps) {
                                var data = {};
                                for (var prop in relaxProps) {
                                    if (prop === 'viewAction' ||
                                        typeof relaxProps[prop] == 'function') {
                                        continue;
                                    }
                                    data[prop] = relaxProps[prop];
                                }
                                return data;
                            };
                            console.groupCollapsed &&
                                console.groupCollapsed(Relax.displayName + " will update rx store " + this._isNeedRxStore + " \uD83D\uDE80");
                            console.log('props:|>', JSON.stringify(this.props, null, 2));
                            console.log('relaxProps:|>', JSON.stringify(relaxData(this._relaxProps), null, 2));
                            console.groupEnd && console.groupEnd();
                        }
                    }
                    return true;
                }
                else {
                    return false;
                }
            };
            Relax.prototype.componentWillUnmount = function () {
                if (this._isNeedRxStore) {
                    this.context['_plume$Store'].unsubscribe(this._handleStoreChange);
                }
            };
            Relax.prototype.render = function () {
                return react_1.default.createElement(Wrapper, __assign({}, this.props, { relaxProps: this._relaxProps }));
            };
            Relax.prototype._computeRelaxProps = function () {
                //dev check
                if (process.env.NODE_ENV != 'production') {
                    if (!Wrapper.relaxProps) {
                        console.warn("\uD83D\uDE13 " + Relax.displayName + " could not find any static relaxProps, Please remove @Relex!!!");
                    }
                }
                var relaxProps = {};
                var staticRelaxProps = Relax.relaxProps;
                var store = this.context['_plume$Store'];
                for (var propName in staticRelaxProps) {
                    //prop的属性值
                    var propValue = staticRelaxProps[propName];
                    //判断注入的属性是不是viewAction,如果是就直接将store中的viewAction注入
                    if (propValue === 'viewAction') {
                        //warning...
                        if (process.env.NODE_ENV != 'production') {
                            if (!store.viewAction) {
                                console.error("store can not find viewAction, please bind viewAction first");
                            }
                        }
                        relaxProps[propName] = store.viewAction;
                    }
                    else if (type_1.isString(propValue) ||
                        type_1.isArray(propValue) ||
                        propValue instanceof ql_1.QueryLang) {
                        relaxProps[propName] = store.bigQuery(propValue);
                    }
                    else if (typeof propValue === 'function') {
                        //如果该属性值是函数类型，注入store的method
                        var storeMethod = store[propName];
                        relaxProps[propName] = storeMethod || propValue;
                        //warning...
                        if (process.env.NODE_ENV != 'production') {
                            if (!storeMethod) {
                                console.warn("store can not find '" + propName + "' method.");
                            }
                        }
                    }
                    else if (propValue instanceof pql_1.PartialQueryLang) {
                        relaxProps[propName] = propValue.partialQL(this.context._plume$Store.bigQuery);
                    }
                }
                return relaxProps;
            };
            return Relax;
        }(react_1.default.Component)),
        //displayName
        _a.displayName = "Relax(" + getDisplayName(Wrapper) + ")",
        //拷贝WrapperComponent的defaultProps
        _a.defaultProps = Wrapper.defaultProps || {},
        //拷贝WrapperComponent的relaxProps
        //注入和store关联的数据和方法
        _a.relaxProps = Wrapper.relaxProps || {},
        //声明上下文依赖
        _a.contextTypes = { _plume$Store: prop_types_1.default.object },
        _a;
    function getDisplayName(WrappedComponent) {
        return WrappedComponent.displayName || WrappedComponent.name || 'Component';
    }
}
exports.default = RelaxContainer;
