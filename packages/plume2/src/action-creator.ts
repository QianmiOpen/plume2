import Store from './store';

export type TActionHandler = (store: Store, params?: any) => void;

/**
 * ActiopnHandler
 * UI = React(State, Action/Event)
 * State = Store(init, Action/Event)
 * UI的Action/Event是入口，出口就是Store的Action/Event
 */
export class ActionHandler {
  constructor() {
    this._route = {};
    this._store = null;
  }

  //当前绑定的store
  private _store: Store;
  //当前的msg和actionHandler的映射
  private _route: { [key: string]: TActionHandler };

  /**
   *创建msg和ActionHandler的绑定
   */
  create(msg: string, fn: TActionHandler) {
    this._route[msg] = fn;
  }

  /**
   * UI触发的事件
   * @param msg
   * @param params
   */
  fire(msg: string, params?: any) {
    //development check
    if (process.env.NODE_ENV != 'production') {
      if (this._store == null) {
        throw new Error(
          'ActionCreator Could not bind store, Please bind in Store bindActionCreator'
        );
      }
    }

    //查询当前route是否包含对msg的ActionHandler
    //如果存在，直接调用
    //怎么绑定一个ActionHandler到route
    //const actionCreator = ActionCreator()
    //actionCreator.create('ON_INIT', (store, params) => {
    // console.log('init');
    //})
    let fn = this._route[msg];
    if (fn != null) {
      fn.call(this, this._store, params);
      return;
    }

    //如果在当前的route中不存在
    //就去查询store中是否存在对于msg的处理
    //如果存在就调用,不存在就直接告警
    //如何绑定
    //class AppStore extends Store {
    //  @Action('ON_INIT')
    //  init(params) {}
    //}
    fn = (this._store as any)._route[msg];
    if (fn == null) {
      if (process.env.NODE_ENV != 'production') {
        console.error(
          'Could not find any method. You should check your ActionCreator or Store'
        );
      }
      return;
    }
    //call store methods
    this._store.receive(msg, params);
  }

  /**
   * 绑定当前的store，仅在Store中被绑定
   * @param store
   */
  private _bindStore(store: Store) {
    this._store = store;
  }
}

export default function ActionCreator() {
  return new ActionHandler();
}
