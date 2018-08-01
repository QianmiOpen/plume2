import { Action, Actor, IMap } from 'plume2';
import { Command } from '../command';

export default class FilterActor extends Actor {
  defaultState() {
    return { filterStatus: '' };
  }

  @Action(Command.CHANGE_FILTER)
  changeFilter(state: IMap, text: string) {
    return state.set('filterStatus', text);
  }

  @Action(Command.INIT)
  init(state: IMap, { filterStatus }) {
    return state.set('filterStatus', filterStatus);
  }
}
