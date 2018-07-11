import Store from './store';

/**
 * ViewAction
 * UI = React(State, Action/Event)
 * State = Store(init, Action/Event)
 * UI的Action/Event是入口，出口就是Store的Action/Event
 */
export class ViewAction {
  //bind current react contxt store
  protected store: Store;

  //@ts-ignore
  //只会在store中初始化的时候被调用绑定store的上下文
  private _bindStore(store: Store) {
    this.store = store;
  }
}
