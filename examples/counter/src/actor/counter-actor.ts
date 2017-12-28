import { Actor, Action, IMap } from 'plume2';
import actionType from '../action-type';

export default class CounterActor extends Actor {
  defaultState() {
    return { count: 0 };
  }

  @Action(actionType.INCREMENT)
  increment(state: IMap) {
    return state.update('count', count => count + 1);
  }

  @Action(actionType.DECREMENT)
  decrement(state: IMap) {
    return state.update('count', count => count - 1);
  }
}
