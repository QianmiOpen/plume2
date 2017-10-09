import { Actor, Action, IMap } from 'plume2';
import actionCreator from '../action-creator';

export default class CounterActor extends Actor {
  defaultState() {
    return { count: 0 };
  }

  @Action(actionCreator.INCREMENT)
  increment(state: IMap) {
    return state.update('count', count => count + 1);
  }

  @Action(actionCreator.DECREMENT)
  decrement(state: IMap) {
    return state.update('count', count => count - 1);
  }
}
