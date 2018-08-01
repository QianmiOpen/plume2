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
var prop_types_1 = __importDefault(require("prop-types"));
/**
 * 获取组件的displayName便于react-devtools的调试
 * @param WrappedComponent
 */
var getDisplayName = function (WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};
/**
 * StoreProvider连接ReactUI和Store
 * @param AppStore
 * @param opts
 */
function StoreProvider(AppStore, opts) {
    return function wrapper(Base) {
        var _a;
        return _a = /** @class */ (function (_super) {
                __extends(WrapperComponent, _super);
                function WrapperComponent(props) {
                    var _this = _super.call(this, props) || this;
                    _this.getChildContext = function () {
                        return { _plume$Store: _this.store };
                    };
                    _this._handleStoreChange = function (state) {
                        //will drop on production env
                        if (process.env.NODE_ENV != 'production') {
                            if (_this.store._opts.debug) {
                                console.log("\n" + WrapperComponent.displayName + " will update \uD83D\uDE80");
                            }
                        }
                        _this.setState(state.toObject());
                    };
                    _this._isMounted = false;
                    _this.store = new AppStore(opts || { debug: false });
                    _this.state = __assign({}, _this.state, _this.store.state().toObject());
                    _this.store.subscribe(_this._handleStoreChange);
                    return _this;
                }
                WrapperComponent.prototype.componentWillMount = function () {
                    _super.prototype.componentWillMount && _super.prototype.componentWillMount.call(this);
                    this._isMounted = false;
                    //will drop on production env
                    if (process.env.NODE_ENV != 'production') {
                        if (this.store._opts.debug) {
                            if (window) {
                                var cssRule = 'color: rgb(249, 162, 34);' +
                                    'font-size: 40px;' +
                                    'font-weight: bold;' +
                                    'text-shadow: 1px 1px 5px rgb(249, 162, 34);' +
                                    'filter: dropshadow(color=rgb(249, 162, 34), offx=1, offy=1);';
                                var version = require('../package.json').version;
                                console.log("%cplume2@" + version + "\uD83D\uDE80", cssRule);
                            }
                            console.log(WrapperComponent.displayName + " will mount \uD83D\uDE80");
                        }
                    }
                };
                WrapperComponent.prototype.componentDidMount = function () {
                    _super.prototype.componentDidMount && _super.prototype.componentDidMount.call(this);
                    this._isMounted = true;
                    /**
                     *优化
                     * 不需要每次在Store的构造函数中去
                     * if (__DEV__) {window['store'] = this;}
                     * 1. 需要额外的去写构造函数
                     * 2. 不同的App会覆盖window['store']
                     */
                    if (process.env.NODE_ENV != 'production') {
                        if (this.store._opts.debug) {
                            var displayName = getDisplayName(Base);
                            window['_plume2App'] = window['_plume2App'] || {};
                            window['_plume2App'][displayName] = {
                                store: this.store
                            };
                        }
                    }
                };
                WrapperComponent.prototype.componentWillUpdate = function (nextProps, nextState, nextContext) {
                    _super.prototype.componentWillUpdate &&
                        _super.prototype.componentWillUpdate.call(this, nextProps, nextState, nextContext);
                    this._isMounted = false;
                };
                WrapperComponent.prototype.componentDidUpdate = function (prevProps, prevState, prevContext) {
                    _super.prototype.componentDidUpdate &&
                        _super.prototype.componentDidUpdate.call(this, prevProps, prevState, prevContext);
                    this._isMounted = true;
                };
                WrapperComponent.prototype.componentWillUnmount = function () {
                    _super.prototype.componentWillUnmount && _super.prototype.componentWillUnmount.call(this);
                    this.store.unsubscribe(this._handleStoreChange);
                    if (process.env.NODE_ENV != 'production') {
                        if (this.store._opts.debug) {
                            var displayName = getDisplayName(Base);
                            delete window['_plume2App'][displayName];
                        }
                    }
                };
                WrapperComponent.prototype.render = function () {
                    return _super.prototype.render.call(this);
                };
                return WrapperComponent;
            }(Base)),
            _a.displayName = "StoreProvider(" + getDisplayName(Base) + ")",
            _a.childContextTypes = { _plume$Store: prop_types_1.default.object },
            _a;
    };
}
exports.default = StoreProvider;
