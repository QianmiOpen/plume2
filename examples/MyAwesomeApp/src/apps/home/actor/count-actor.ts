import { Action, Actor, IMap } from 'plume2';
import { Command } from '../command';

export default class CountActor extends Actor {
  defaultState() {
    return {
      count: 0
    };
  }

  @Action(Command.INIT_COUNT)
  initCount(state: IMap, param: number) {
    return state.set('count', param);
  }

  @Action(Command.INCR_COUNT)
  incr(state: IMap) {
    return state.update('count', count => count + 1);
  }
}
