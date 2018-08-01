import { Action, Actor, IMap } from 'plume2';
import { Command } from '../command';

export default class LikeActor extends Actor {
  defaultState() {
    return { like: 0 };
  }

  @Action(Command.INCREMENT)
  inc(state: IMap) {
    return state.update('like', like => like + 1);
  }

  @Action(Command.DECREMENT)
  decrement(state: IMap) {
    return state.update('like', like => like - 1);
  }
}
