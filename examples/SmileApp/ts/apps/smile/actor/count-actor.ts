import { Actor, Action, IMap } from 'plume2';
import actionType from '../action-type';

export default class CountActor extends Actor {
  defaultState() {
    return { count: 1 };
  }

  @Action(actionType.INCREMENT)
  change(state: IMap) {
    return state.update('count', count => count + 1);
  }

  @Action(actionType.INIT)
  init(state: IMap, count: number) {
    return state.set('count', count);
  }
}
