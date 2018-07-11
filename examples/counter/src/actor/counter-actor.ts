import { Action, Actor, IMap } from 'plume2';
import { Command } from '../command';

export default class CounterActor extends Actor {
  defaultState() {
    return { count: 0 };
  }

  @Action(Command.INCREMENT)
  increment(state: IMap) {
    return state.update('count', count => count + 1);
  }

  @Action(Command.DECREMENT)
  decrement(state: IMap) {
    return state.update('count', count => count - 1);
  }
}
