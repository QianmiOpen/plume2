"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReactDOM = require("react-dom");
const immutable_1 = require("immutable");
const ql_1 = require("./ql");
const is_array_1 = require("./util/is-array");
const batchedUpdates = (ReactDOM.unstable_batchedUpdates || function (cb) { cb(); });
class Store {
    constructor(props) {
        this._opts = props || { debug: false };
        this._state = immutable_1.fromJS({});
        this._actorsState = [];
        this._callbacks = [];
        this._cacheQL = {};
        this._isInTranstion = false;
        this._actors = this.bindActor();
        this.reduceActorState();
    }
    bindActor() {
        return [];
    }
    reduceActorState() {
        this._state = this._state.withMutations(state => {
            for (let actor of this._actors) {
                let initState = immutable_1.fromJS(actor.defaultState());
                this._actorsState.push(initState);
                state = state.merge(initState);
            }
            return state;
        });
    }
    dispatch(msg, params) {
        const newStoreState = this._dispatchActor(msg, params);
        //如果发生store的状态变化
        if (newStoreState != this._state) {
            this._state = newStoreState;
            //如果在dispatch不在transation内，通知UI去re-render
            if (!this._isInTranstion) {
                this._notifier();
            }
        }
    }
    /**
     * 事务控制dispatch
     *
     * @param dispatch 要执行的dispatch的正常逻辑
     * @param rollBack 发生rollback之后的自定义逻辑
     * @return 是不是发生了错误，数据回滚
     */
    transaction(dispatch, rollBack) {
        //有没有rollback
        let isRollback = false;
        //log
        if (process.env.NODE_ENV != 'production') {
            if (this._opts.debug) {
                console.groupCollapsed
                    && console.groupCollapsed('::::::::::::::::🚀 open new transaction 🚀::::::::::::::::::');
            }
        }
        this._isInTranstion = true;
        //record current state 
        const currentStoreState = this._state;
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
    }
    _notifier() {
        batchedUpdates(() => {
            this._callbacks.forEach(cb => cb(this._state));
        });
    }
    _dispatchActor(msg, params) {
        let _state = this._state;
        if (process.env.NODE_ENV != 'production') {
            if (this._opts.debug) {
                console.groupCollapsed && console.groupCollapsed(`store dispatch => '${msg}'`);
                console.log(`params |>`);
                //fixed, 当前params为false的时候，显示的no params
                console.dir && console.dir(typeof (params) === 'undefined' ? 'no params' : params);
            }
        }
        for (let i = 0, len = this._actors.length; i < len; i++) {
            let actor = this._actors[i];
            const fn = (actor._route || {})[msg];
            //如果actor没有处理msg的方法，直接跳过
            if (!fn) {
                //log
                if (process.env.NODE_ENV != 'production') {
                    if (this._opts.debug) {
                        console.log(`${actor.constructor.name} receive '${msg}', but no handle 😭`);
                    }
                }
                continue;
            }
            //debug
            if (process.env.NODE_ENV != 'production') {
                if (this._opts.debug) {
                    const actorName = actor.constructor.name;
                    console.log(`${actorName} receive => '${msg}'`);
                }
            }
            let preActorState = this._actorsState[i];
            const newActorState = actor.receive(msg, preActorState, params);
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
    }
    bigQuery(ql) {
        if (!(ql instanceof ql_1.QueryLang)) {
            throw new Error('invalid QL');
        }
        //数据是否过期,默认否
        let outdate = false;
        const id = ql.id();
        const name = ql.name();
        //获取缓存数据结构
        this._cacheQL[id] = this._cacheQL[id] || [];
        //copy lang
        const lang = ql.lang().slice();
        //reactive function
        const rxFn = lang.pop();
        //will drop on production env
        if (process.env.NODE_ENV != 'production') {
            if (this._opts.debug) {
                console.groupCollapsed && console.groupCollapsed(`🔥:tracing: QL(${name})`);
                console.time('QL:duration');
            }
        }
        let args = lang.map((elem, index) => {
            if (elem instanceof ql_1.QueryLang) {
                const value = this.bigQuery(elem);
                if (value != this._cacheQL[id][index]) {
                    outdate = true;
                    this._cacheQL[id][index] = value;
                }
                if (process.env.NODE_ENV != 'production') {
                    if (this._opts.debug) {
                        console.log(`dep:${elem.name()}, cache:${!outdate},value:${JSON.stringify(value, null, 2)}`);
                    }
                }
                return value;
            }
            else {
                const value = is_array_1.default(elem) ? this._state.getIn(elem) : this._state.get(elem);
                if (value != this._cacheQL[id][index]) {
                    outdate = true;
                    this._cacheQL[id][index] = value;
                }
                if (process.env.NODE_ENV != 'production') {
                    if (this._opts.debug) {
                        console.log(`dep:${elem}, cache:${!outdate}, value:${JSON.stringify(value, null, 2)}`);
                    }
                }
                return value;
            }
        });
        //如果数据过期，重新计算一次
        if (outdate) {
            const result = rxFn.apply(null, args);
            this._cacheQL[id][args.length] = result;
            if (process.env.NODE_ENV != 'production') {
                if (this._opts.debug) {
                    console.log(`QL(${name})|> ${JSON.stringify(result, null, 2)}`);
                    console.timeEnd('QL:duration');
                    console.groupEnd && console.groupEnd();
                }
            }
            return result;
        }
        else {
            if (process.env.NODE_ENV != 'production') {
                if (this._opts.debug) {
                    console.log(`🚀:QL(${name}), cache: true, result: ${JSON.stringify(this._cacheQL[id][args.length], null, 2)}`);
                    console.timeEnd('QL:duration');
                    console.groupEnd && console.groupEnd();
                }
            }
            //返回cache中最后一个值
            return this._cacheQL[id][args.length];
        }
    }
    state() {
        return this._state;
    }
    subscribe(cb) {
        if (typeof (cb) != 'function' || this._callbacks.indexOf(cb) != -1) {
            return;
        }
        this._callbacks.push(cb);
    }
    unsubscribe(cb) {
        const index = this._callbacks.indexOf(cb);
        if (typeof (cb) != 'function' || index == -1) {
            return;
        }
        this._callbacks.splice(index, 1);
    }
    pprint() {
        if (process.env.NODE_ENV != 'production') {
            console.log(JSON.stringify(this._state, null, 2));
        }
    }
    pprintActor() {
        if (process.env.NODE_ENV != 'production') {
            const stateObj = {};
            this._actors.forEach((actor, index) => {
                const name = actor.constructor.name;
                stateObj[name] = this._actorsState[index].toJS();
            });
            console.log(JSON.stringify(stateObj, null, 2));
        }
    }
}
exports.default = Store;
