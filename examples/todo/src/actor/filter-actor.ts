import { Actor, Action, IMap } from 'plume2';
import actionCreator from '../action-creator';

export default class FilterActor extends Actor {
  defaultState() {
    return { filterStatus: '' };
  }

  @Action(actionCreator.CHANGE_FILTER)
  changeFilter(state: IMap, text: string) {
    return state.set('filterStatus', text);
  }

  @Action(actionCreator.INIT)
  init(state: IMap, { filterStatus }) {
    return state.set('filterStatus', filterStatus);
  }
}
