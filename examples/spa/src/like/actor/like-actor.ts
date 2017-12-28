import { Actor, Action, IMap } from 'plume2';
import actionCreator from '../action-type';

export default class LikeActor extends Actor {
  defaultState() {
    return { like: 0 };
  }

  @Action(actionCreator.INCREMENT)
  inc(state: IMap) {
    return state.update('like', like => like + 1);
  }
}
