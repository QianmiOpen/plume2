import Store from './store';

export type TCallback = (store: Store, params?: any) => void;

export default class ActionCreator {
  constructor() {
    this._router = {};
    this._store = null;
  }

  private _store: Store;
  private _router: { [key: string]: TCallback };

  create(msg: string, fn: TCallback) {
    this._router[msg] = fn;
  }

  fire(msg: string, params?: any) {
    //check
    if (process.env.NODE_ENV != 'production') {
      if (this._store == null) {
        throw new Error(
          'ActionCreator Could not bind store, Please bind in StoreProvider or others'
        );
      }
    }

    let fn = this._router[msg];
    if (fn != null) {
      fn.call(this, this._store, params);
      return;
    }

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

  private _bindStore(store: Store) {
    this._store = store;
  }
}
