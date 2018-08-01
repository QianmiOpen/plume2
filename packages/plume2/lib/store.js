"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var react_dom_1 = __importDefault(require("react-dom"));
var ql_1 = require("./ql");
var type_1 = require("./type");
/**
 * 是不是可以批量处理
 * ReactDOM'sunstable_batchedUpdates可以很酷的解决父子组件级联渲染的问题
 * 可惜Preact不支持，只能靠Immutable的不可变这个特性来挡着了
 */
var batchedUpdates = react_dom_1.default.unstable_batchedUpdates ||
    function (cb) {
        cb();
    };
/**
 * Store状态容器
 * 整个应用中心的状态管理 控制整个应用的状态控制
 * Store = f(Actor, ViewAction)
 */
var Store = /** @class */ (function () {
    function Store(props) {
        var _this = this;
        /**
         * 计算querylang
         * @param ql querylang
         */
        this.bigQuery = function (ql) {
            //如果当前的查询参数是字符串，直接获取状态对应的路径参数
            if (type_1.isString(ql)) {
                return _this._state.get(ql);
            }
            if (type_1.isArray(ql)) {
                return _this._state.getIn(ql);
            }
            if (!(ql instanceof ql_1.QueryLang)) {
                throw new Error('invalid QL');
            }
            //数据是否过期,默认否
            var outdate = false;
            var id = ql.id();
            var name = ql.name();
            //获取缓存数据结构
            _this._cacheQL[id] = _this._cacheQL[id] || [];
            //copy lang
            var lang = ql.lang().slice();
            //reactive function
            var rxFn = lang.pop();
            //will drop on production env
            if (process.env.NODE_ENV != 'production') {
                if (_this._opts.debug) {
                    console.groupCollapsed &&
                        console.groupCollapsed("\uD83D\uDD25:tracing: QL(" + name + ")");
                }
            }
            var args = lang.map(function (elem, index) {
                if (elem instanceof ql_1.QueryLang) {
                    var value = _this.bigQuery(elem);
                    if (value != _this._cacheQL[id][index]) {
                        outdate = true;
                        _this._cacheQL[id][index] = value;
                    }
                    if (process.env.NODE_ENV != 'production') {
                        if (_this._opts.debug) {
                            console.log("dep:" + elem.name() + ", cache:" + !outdate + ",value:" + JSON.stringify(value, null, 2));
                        }
                    }
                    return value;
                }
                else {
                    var value = type_1.isArray(elem)
                        ? _this._state.getIn(elem)
                        : _this._state.get(elem);
                    if (_this._cacheQL[id].length == 0 ||
                        value != _this._cacheQL[id][index]) {
                        outdate = true;
                        _this._cacheQL[id][index] = value;
                    }
                    if (process.env.NODE_ENV != 'production') {
                        if (_this._opts.debug) {
                            console.log("dep:" + elem + ", cache:" + !outdate + ", value:" + JSON.stringify(value, null, 2));
                        }
                    }
                    return value;
                }
            });
            //如果数据过期，重新计算一次
            if (outdate) {
                var result = rxFn.apply(null, args);
                _this._cacheQL[id][args.length] = result;
                if (process.env.NODE_ENV != 'production') {
                    if (_this._opts.debug) {
                        console.log("QL(" + name + ")|> " + JSON.stringify(result, null, 2));
                        console.groupEnd && console.groupEnd();
                    }
                }
                return result;
            }
            else {
                if (process.env.NODE_ENV != 'production') {
                    if (_this._opts.debug) {
                        console.log("\uD83D\uDE80:QL(" + name + "), cache: true, result: " + JSON.stringify(_this._cacheQL[id][args.length], null, 2));
                        console.groupEnd && console.groupEnd();
                    }
                }
                //返回cache中最后一个值
                return _this._cacheQL[id][args.length];
            }
        };
        //====================private method==========================
        this._initViewAction = function () {
            var viewActionMapper = _this.bindViewAction() || {};
            var keys = Object.keys(viewActionMapper);
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                //get current ViewAction class
                var ViewAction = viewActionMapper[key];
                //init and pass current to viewAction
                var viewAction = new ViewAction();
                viewAction._bindStore(_this);
                _this.viewAction[key] = viewAction;
            }
        };
        this._opts = props || { debug: false };
        this._state = immutable_1.fromJS({});
        this._actorsState = [];
        this._callbacks = [];
        this._cacheQL = {};
        this._isInTranstion = false;
        this._reduceActorState();
        this.viewAction = {};
        this._initViewAction();
    }
    //==================public method ==================
    /**
     * 绑定Actor
     */
    Store.prototype.bindActor = function () {
        return [];
    };
    /**
     * 绑定ViewAction
     */
    Store.prototype.bindViewAction = function () {
        return {};
    };
    /**
     * store分发事件协同actor
     *
     * @param msg 事件名称
     * @param params  参数
     */
    Store.prototype.dispatch = function (msg, params) {
        var newStoreState = this._dispatchActor(msg, params);
        //如果发生store的状态变化
        if (newStoreState != this._state) {
            this._state = newStoreState;
            //如果在dispatch不在transation内，通知UI去re-render
            if (!this._isInTranstion) {
                this._notifier();
            }
        }
    };
    /**
     * 事务控制dispatch
     *
     * @param dispatch 要执行的dispatch的正常逻辑
     * @param rollBack 发生rollback之后的自定义逻辑
     * @return 是不是发生了错误，数据回滚
     */
    Store.prototype.transaction = function (dispatch, rollBack) {
        //有没有rollback
        var isRollback = false;
        //log
        if (process.env.NODE_ENV != 'production') {
            if (this._opts.debug) {
                console.groupCollapsed &&
                    console.groupCollapsed('::::::::::::::::🚀 open new transaction 🚀::::::::::::::::::');
            }
        }
        this._isInTranstion = true;
        //record current state
        var currentStoreState = this._state;
        try {
            dispatch();
        }
        catch (err) {
            //如果提供了rollback的自定义回调函数，
            //就调用业务级别的rollback
            //否则就自动回滚到上一次的状态
            if (rollBack) {
                rollBack();
            }
            else {
                this._state = currentStoreState;
            }
            isRollback = true;
            if (process.env.NODE_ENV != 'production') {
                console.warn('😭, some exception occur in transaction, store state roll back');
                if (this._opts.debug) {
                    console.trace(err);
                }
            }
        }
        //fn前后状态有没有发生变化
        if (currentStoreState != this._state) {
            this._notifier();
        }
        this._isInTranstion = false;
        //log
        if (process.env.NODE_ENV != 'production') {
            if (this._opts.debug) {
                console.groupEnd && console.groupEnd();
            }
        }
        return isRollback;
    };
    /**
     * 获取store容器的数据状态
     */
    Store.prototype.state = function () {
        return this._state;
    };
    /**
     *获取数据的快捷方式
     */
    Store.prototype.get = function (path) {
        return this.bigQuery(path);
    };
    /**
     * 设置store数据容器的状态，一般用于rollback之后的状态恢复
     * @param state 设置store的状态
     */
    Store.prototype.setState = function (state) {
        this._state = state;
    };
    /**
     * 定义store发生的数据变化
     * @param cb 回调函数
     */
    Store.prototype.subscribe = function (cb) {
        if (typeof cb != 'function' || this._callbacks.indexOf(cb) != -1) {
            return;
        }
        this._callbacks.push(cb);
    };
    /**
     * 取消store发生数据变化的订阅
     * @param cb 回调函数
     */
    Store.prototype.unsubscribe = function (cb) {
        var index = this._callbacks.indexOf(cb);
        if (typeof cb != 'function' || index == -1) {
            return;
        }
        this._callbacks.splice(index, 1);
    };
    Store.prototype._reduceActorState = function () {
        var _this = this;
        this._actors = [];
        var actors = this.bindActor() || [];
        this._state = this._state.withMutations(function (state) {
            for (var _i = 0, actors_1 = actors; _i < actors_1.length; _i++) {
                var actor = actors_1[_i];
                //支持bindActor直接传递Actor本身不需要new
                if (typeof actor === 'function') {
                    actor = new actor();
                }
                _this._actors.push(actor);
                var initState = immutable_1.fromJS(actor.defaultState());
                _this._actorsState.push(initState);
                state = state.merge(initState);
            }
            return state;
        });
    };
    Store.prototype._notifier = function () {
        var _this = this;
        batchedUpdates(function () {
            _this._callbacks.forEach(function (cb) { return cb(_this._state); });
        });
    };
    Store.prototype._dispatchActor = function (msg, params) {
        var _state = this._state;
        if (process.env.NODE_ENV != 'production') {
            if (this._opts.debug) {
                console.groupCollapsed &&
                    console.groupCollapsed("store dispatch => '" + msg + "'");
                //如果参数存在
                if (typeof params !== 'undefined') {
                    if (typeof params === 'object') {
                        console.log("params|>");
                        console.dir && console.dir(params);
                    }
                    else {
                        console.log("params|> " + params);
                    }
                }
            }
        }
        for (var i = 0, len = this._actors.length; i < len; i++) {
            var actor = this._actors[i];
            var fn = actor._route[msg];
            //如果actor没有处理msg的方法，直接跳过
            if (!fn) {
                //log
                if (process.env.NODE_ENV != 'production') {
                    if (this._opts.debug) {
                        console.log(actor.constructor.name + " receive '" + msg + "', but no handle \uD83D\uDE2D");
                    }
                }
                continue;
            }
            //debug
            if (process.env.NODE_ENV != 'production') {
                if (this._opts.debug) {
                    console.log(actor.constructor.name + " receive => '" + msg + "'");
                }
            }
            var preActorState = this._actorsState[i];
            var newActorState = actor.receive({
                msg: msg,
                state: preActorState,
                params: params
            });
            if (preActorState != newActorState) {
                this._actorsState[i] = newActorState;
                _state = _state.merge(newActorState);
            }
        }
        if (process.env.NODE_ENV != 'production') {
            if (this._opts.debug) {
                console.groupEnd && console.groupEnd();
            }
        }
        return _state;
    };
    //=============================help method==========================
    /**
     * 打印store中的数据状态
     */
    Store.prototype.pprint = function () {
        if (process.env.NODE_ENV != 'production') {
            console.log(JSON.stringify(this._state, null, 2));
        }
    };
    /**
     * 打印store中的数据状态是从哪些Actor中聚合
     */
    Store.prototype.pprintActor = function () {
        var _this = this;
        if (process.env.NODE_ENV != 'production') {
            var stateObj_1 = {};
            this._actors.forEach(function (actor, index) {
                var name = actor.constructor.name;
                stateObj_1[name] = _this._actorsState[index].toJS();
            });
            console.log(JSON.stringify(stateObj_1, null, 2));
        }
    };
    return Store;
}());
exports.default = Store;
