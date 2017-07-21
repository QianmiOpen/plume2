import { Map, fromJS } from 'immutable';
import { Actor, Action, Store, QL } from '../src/index';
import { QueryLang } from '../src/ql';
import { IMap } from '../src/typing';

let uuid = 0;

class TodoActor extends Actor {
  defaultState() {
    return {
      filter: '',
      todo: []
    };
  }

  @Action('add')
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
}

class AppStore extends Store {
  bindActor() {
    return [new TodoActor()];
  }

  add = (text: string) => {
    this.dispatch('add', text);
  };
}

const todoQL = QL('todoQL', [
  'todo',
  'filter',

  /**
   * 过滤数据
   */
  (todo, filter) => todo
]);

const countQL = QL('countQL', [
  todoQL,

  /**
   * 支持nested
   */
  todo => todo.count()
]);

describe('bigquery test suite', () => {
  it('countQL', () => {
    const store = new AppStore();
    let count = store.bigQuery(countQL as QueryLang);
    expect(count).toEqual(0);

    store.add('hello');
    count = store.bigQuery(countQL as QueryLang);
    expect(count).toEqual(1);
  });
});
