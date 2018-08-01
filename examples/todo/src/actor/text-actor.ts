import { Action, Actor, IMap } from 'plume2';
import { Command } from '../command';

export default class TextActor extends Actor {
  defaultState() {
    return { value: '' };
  }

  @Action(Command.CHANGE_TEXT)
  changeText(state: IMap, text) {
    return state.set('value', text);
  }

  @Action(Command.SUMBIT_TEXT)
  submit(state: IMap) {
    return state.set('value', '');
  }

  @Action(Command.INIT)
  init(state: IMap, { value }) {
    return state.set('value', value);
  }
}
