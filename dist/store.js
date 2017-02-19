"use strict";
const immutable_1 = require("immutable");
const ql_1 = require("./ql");
const is_array_1 = require("./util/is-array");
const defer_1 = require("./util/defer");
class Store {
    constructor(props) {
        this._opts = props || { debug: false, syncDispatch: false };
        this._state = immutable_1.fromJS({});
        this._actorsState = [];
        this._callbacks = [];
        this._cacheQL = {};
        this._dQueue = [];
        this._pending = false;
        this._actors = this.bindActor();
        this.reduceActor();
    }
    bindActor() {
        return [];
    }
    reduceActor() {
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
        //sync dispatch 
        if (this._opts.syncDispatch) {
            this.transaction((state) => this.dispatchActor(msg, state, params));
        }
        else {
            this._dQueue.push({ msg, params });
            //be sure, only emit one time
            if (!this._pending) {
                defer_1.default(() => {
                    this.transaction((state) => {
                        for (let payload of this._dQueue) {
                            const { msg, params } = payload;
                            state = this.dispatchActor(msg, state, params);
                        }
                        //recover 
                        this._pending = false;
                        this._dQueue = [];
                        return state;
                    });
                });
            }
            this._pending = true;
        }
    }
    transaction(dispatchActor) {
        const newStoreState = this._state.withMutations(state => {
            return dispatchActor(state);
        });
        if (newStoreState != this._state) {
            this._state = newStoreState;
            this._callbacks.forEach(cb => cb(this._state));
        }
    }
    dispatchActor(msg, storeState, params) {
        if (process.env.NODE_ENV != 'production') {
            if (this._opts.debug) {
                //node can not support groupCollapsed
                (console.groupCollapsed && console.log)(`store dispatch => '${msg}'`);
                console.log(`params |> ${JSON.stringify(params || 'no params')}`);
            }
        }
        for (let i = 0, len = this._actors.length; i < len; i++) {
            let actor = this._actors[i];
            const fn = actor.route(msg);
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
                storeState = storeState.merge(newActorState);
            }
        }
        if (process.env.NODE_ENV != 'production') {
            if (this._opts.debug) {
                console.groupEnd();
            }
        }
        return storeState;
    }
    bigQuery(ql, params) {
        if (!(ql instanceof ql_1.QueryLang)) {
            throw new Error('invalid QL');
        }
        //获取参数
        const opt = params || { debug: false };
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
            if (opt.debug) {
                console.log(`🔥:tracing: QL(${name})....`);
                console.time('duration');
            }
        }
        let args = lang.map((elem, index) => {
            if (elem instanceof ql_1.QueryLang) {
                const value = this.bigQuery(elem);
                outdate = value != this._cacheQL[id][index];
                this._cacheQL[id][index] = value;
                if (process.env.NODE_ENV != 'production') {
                    if (opt.debug) {
                        console.log(`dep:${elem.name()}|>QL, cache:${!outdate} value:${JSON.stringify(value, null, 2)}`);
                    }
                }
                return value;
            }
            else {
                const value = is_array_1.default(elem) ? this._state.getIn(elem) : this._state.get(elem);
                outdate = value != this._cacheQL[id][index];
                this._cacheQL[id][index] = value;
                if (process.env.NODE_ENV != 'production') {
                    if (opt.debug) {
                        console.log(`dep:${elem}|> cache:${!outdate} value:${JSON.stringify(value, null, 2)}`);
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
                if (opt.debug) {
                    console.log(`QL(${name})|> result: ${JSON.stringify(result, null, 2)}`);
                    console.timeEnd('duration');
                }
            }
            return result;
        }
        else {
            if (process.env.NODE_ENV != 'production') {
                if (opt.debug) {
                    console.log(`🚀:QL(${name})|> cache: true; result: ${JSON.stringify(this._cacheQL[id][args.length], null, 2)}`);
                    console.timeEnd('duration');
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Store;
