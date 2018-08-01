import { fromJS } from 'immutable';
import { Action, Actor, IMap } from 'plume2';
import { Command } from '../command';

let uuid = 0;

export default class TodoActor extends Actor {
  defaultState() {
    return { todo: [] };
  }

  @Action(Command.SUMBIT_TEXT)
  add(state: IMap, text: string) {
    return state.update('todo', todo =>
      todo.push(
        fromJS({
          id: ++uuid,
          text,
          done: false
        })
      )
    );
  }

  @Action(Command.DESTROY)
  destroy(state: IMap, index: number) {
    return state.deleteIn(['todo', index]);
  }

  @Action(Command.TOGGLE)
  toggle(state: IMap, index: number) {
    return state.updateIn(['todo', index, 'done'], done => !done);
  }

  @Action(Command.TOGGLE_ALL)
  toggleAll(state: IMap, checked: boolean) {
    return state.update('todo', todo =>
      todo.map(item => item.set('done', checked))
    );
  }

  @Action(Command.CLEAN_COMPLETED)
  clear(state: IMap) {
    return state.update('todo', todo => todo.filter(item => !item.get('done')));
  }

  @Action(Command.INIT)
  init(state: IMap, { todo }) {
    return state.set('todo', fromJS(todo));
  }
}
