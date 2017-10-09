import { Actor, Action, IMap } from 'plume2';
import actionCreator from '../action-creator';

export default class TextActor extends Actor {
  defaultState() {
    return { value: '' };
  }

  @Action(actionCreator.CHANGE_TEXT)
  changeText(state: IMap, text) {
    return state.set('value', text);
  }

  @Action(actionCreator.SUMBIT_TEXT)
  submit(state: IMap) {
    return state.set('value', '');
  }

  @Action(actionCreator.INIT)
  init(state: IMap, { value }) {
    return state.set('value', value);
  }
}
