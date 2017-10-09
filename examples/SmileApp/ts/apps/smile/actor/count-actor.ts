import { Actor, Action, IMap } from 'plume2';
import actionCreator from '../action-creator';

export default class CountActor extends Actor {
  defaultState() {
    return { count: 1 };
  }

  @Action(actionCreator.INCREMENT)
  change(state: IMap) {
    return state.update('count', count => count + 1);
  }

  @Action(actionCreator.INIT)
  init(state: IMap, count: number) {
    return state.set('count', count);
  }
}
