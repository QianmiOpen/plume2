import * as ReactDOM from 'react-dom';
import { Map, fromJS } from 'immutable';
import Actor from './actor';
import { QueryLang } from './ql';
import { isArray, isString } from './type';
import { IOptions, IMap } from './typing';

export type TDispatch = () => void;
export type TRollback = () => void;
export type TSubscribeHandler = (state: IMap) => void;

/**
 * 是不是可以批量处理
 * ReactDOM'sunstable_batchedUpdates可以很酷的解决父子组件级联渲染的问题
 * 可惜Preact不支持，只能靠Immutable的不可变这个特性来挡着了
 */
const batchedUpdates =
  ReactDOM.unstable_batchedUpdates ||
  function(cb) {
    cb();
  };

/**
 * Store状态容器
 * 整个应用中心的状态管理 控制整个应用的状态控制
 */

export default class Store {
  //store的配置项
  private _opts: IOptions;
  //当前store的聚合状态
  private _state: IMap;
  //保存当前store的状态变化的监听的handler
  private _callbacks: Array<TSubscribeHandler>;
  //当前绑定的actor
  private _actors: Array<Actor>;
  //每个actor中自己独有的状态
  private _actorsState: Array<IMap>;
  //Querlang查询的缓存
  private _cacheQL: { [name: string]: Array<any> };
  //判断当前的dispatch是不是在事务中
  private _isInTranstion: boolean;

  /**
   * init
   * @param props
   */
  constructor(props?: IOptions) {
    this._opts = props || { debug: false };
    this._state = fromJS({});
    this._actorsState = [];
    this._callbacks = [];
    this._cacheQL = {};
    this._isInTranstion = false;
    this._actors = this.bindActor();
    this.reduceActorState();
  }

  /**
   * 绑定Actor
   */
  bindActor(): Array<Actor> {
    return [];
  }

  /**
   * store分发事件协同actor
   *
   * @param msg 事件名称
   * @param params  参数
   */
  dispatch(msg: string, params?: any) {
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
  transaction(dispatch: TDispatch, rollBack?: TRollback): boolean {
    //有没有rollback
    let isRollback = false;

    //log
    if (process.env.NODE_ENV != 'production') {
      if (this._opts.debug) {
        console.groupCollapsed &&
          console.groupCollapsed(
            '::::::::::::::::🚀 open new transaction 🚀::::::::::::::::::'
          );
      }
    }

    this._isInTranstion = true;
    //record current state
    const currentStoreState = this._state;
    try {
      dispatch();
    } catch (err) {
      //如果提供了rollback的自定义回调函数，
      //就调用业务级别的rollback
      //否则就自动回滚到上一次的状态
      if (rollBack) {
        rollBack();
      } else {
        this._state = currentStoreState;
      }
      isRollback = true;

      if (process.env.NODE_ENV != 'production') {
        console.warn(
          '😭, some exception occur in transaction, store state roll back'
        );
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

  private reduceActorState() {
    this._state = this._state.withMutations(state => {
      for (let actor of this._actors) {
        let initState = fromJS(actor.defaultState());
        this._actorsState.push(initState);
        state = state.merge(initState);
      }
      return state;
    });
  }

  private _notifier() {
    batchedUpdates(() => {
      this._callbacks.forEach(cb => cb(this._state));
    });
  }

  private _dispatchActor(msg: string, params?: any) {
    let _state = this._state;

    if (process.env.NODE_ENV != 'production') {
      if (this._opts.debug) {
        console.groupCollapsed &&
          console.groupCollapsed(`store dispatch => '${msg}'`);
        //如果参数存在
        if (typeof params !== 'undefined') {
          if (typeof params === 'object') {
            console.log(`params|>`);
            console.dir && console.dir(params);
          } else {
            console.log(`params|> ${params}`);
          }
        }
      }
    }

    for (let i = 0, len = this._actors.length; i < len; i++) {
      let actor = this._actors[i] as any;
      const fn = (actor._route || {})[msg];

      //如果actor没有处理msg的方法，直接跳过
      if (!fn) {
        //log
        if (process.env.NODE_ENV != 'production') {
          if (this._opts.debug) {
            console.log(
              `${actor.constructor.name} receive '${msg}', but no handle 😭`
            );
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

  /**
   * 计算querylang
   * @param ql querylang
   */
  bigQuery = (ql: QueryLang | string | Array<string | number>): any => {
    //如果当前的查询参数是字符串，直接获取状态对应的路径参数
    if (isString(ql)) {
      return this._state.get(ql as string);
    }

    if (isArray(ql)) {
      return this._state.getIn(ql as Array<any>);
    }

    if (!(ql instanceof QueryLang)) {
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
        console.groupCollapsed &&
          console.groupCollapsed(`🔥:tracing: QL(${name})`);
        console.time && console.time('QL:duration');
      }
    }

    let args = lang.map((elem, index) => {
      if (elem instanceof QueryLang) {
        const value = this.bigQuery(elem);
        if (value != this._cacheQL[id][index]) {
          outdate = true;
          this._cacheQL[id][index] = value;
        }

        if (process.env.NODE_ENV != 'production') {
          if (this._opts.debug) {
            console.log(
              `dep:${elem.name()}, cache:${!outdate},value:${JSON.stringify(
                value,
                null,
                2
              )}`
            );
          }
        }

        return value;
      } else {
        const value = isArray(elem)
          ? this._state.getIn(elem)
          : this._state.get(elem);

        if (
          this._cacheQL[id].length == 0 ||
          value != this._cacheQL[id][index]
        ) {
          outdate = true;
          this._cacheQL[id][index] = value;
        }

        if (process.env.NODE_ENV != 'production') {
          if (this._opts.debug) {
            console.log(
              `dep:${elem}, cache:${!outdate}, value:${JSON.stringify(
                value,
                null,
                2
              )}`
            );
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
          console.time && console.timeEnd('QL:duration');
          console.groupEnd && console.groupEnd();
        }
      }

      return result;
    } else {
      if (process.env.NODE_ENV != 'production') {
        if (this._opts.debug) {
          console.log(
            `🚀:QL(${name}), cache: true, result: ${JSON.stringify(
              this._cacheQL[id][args.length],
              null,
              2
            )}`
          );
          console.time && console.timeEnd('QL:duration');
          console.groupEnd && console.groupEnd();
        }
      }

      //返回cache中最后一个值
      return this._cacheQL[id][args.length];
    }
  };

  /**
   * 获取store容器的数据状态
   */
  state() {
    return this._state;
  }

  /**
   * 设置store数据容器的状态，一般用于rollback之后的状态恢复
   * @param state 设置store的状态
   */
  setState(state) {
    this._state = state;
  }

  /**
   * 定义store发生的数据变化
   * @param cb 回调函数
   */
  subscribe(cb: TSubscribeHandler) {
    if (typeof cb != 'function' || this._callbacks.indexOf(cb) != -1) {
      return;
    }

    this._callbacks.push(cb);
  }

  /**
   * 取消store发生数据变化的订阅
   * @param cb 回调函数
   */
  unsubscribe(cb: TSubscribeHandler) {
    const index = this._callbacks.indexOf(cb);
    if (typeof cb != 'function' || index == -1) {
      return;
    }

    this._callbacks.splice(index, 1);
  }

  //=============================help method==========================

  /**
   * 打印store中的数据状态
   */
  pprint() {
    if (process.env.NODE_ENV != 'production') {
      console.log(JSON.stringify(this._state, null, 2));
    }
  }

  /**
   * 打印store中的数据状态是从哪些Actor中聚合
   */
  pprintActor() {
    if (process.env.NODE_ENV != 'production') {
      const stateObj = {};
      this._actors.forEach((actor, index) => {
        const name = (actor.constructor as any).name;
        stateObj[name] = this._actorsState[index].toJS();
      });
      console.log(JSON.stringify(stateObj, null, 2));
    }
  }
}
