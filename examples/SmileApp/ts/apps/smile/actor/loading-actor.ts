import { Actor, Action, IMap } from 'plume2';
import actionType from '../action-type';

export default class LoadingActor extends Actor {
  defaultState() {
    return { loading: true };
  }

  @Action(actionType.LOADING_END)
  loadingEnd(state: IMap) {
    return state.set('loading', false);
  }
}
