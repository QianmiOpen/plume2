import { Action, Actor, IMap } from 'plume2';
import { Command } from '../command';

export default class CountActor extends Actor {
  defaultState() {
    return { count: 1 };
  }

  @Action(Command.INCREMENT)
  change(state: IMap) {
    return state.update('count', count => count + 1);
  }

  @Action(Command.INIT)
  init(state: IMap, count: number) {
    return state.set('count', count);
  }
}
