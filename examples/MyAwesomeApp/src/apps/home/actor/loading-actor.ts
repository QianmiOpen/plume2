import { Action, Actor, IMap } from 'plume2';
import { Command } from '../command';

export default class LoadingActor extends Actor {
  defaultState() {
    return {
      loading: true
    };
  }

  @Action(Command.LOADING_END)
  loadingEnd(state: IMap) {
    return state.set('loading', false);
  }
}
