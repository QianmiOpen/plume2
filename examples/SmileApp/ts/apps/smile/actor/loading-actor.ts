import { Actor, Action, IMap } from 'plume2';
import actionCreator from '../action-creator';

export default class LoadingActor extends Actor {
  defaultState() {
    return { loading: true };
  }

  @Action(actionCreator.LOADING_END)
  loadingEnd(state: IMap) {
    return state.set('loading', false);
  }
}
