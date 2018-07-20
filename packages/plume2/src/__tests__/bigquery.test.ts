import { fromJS } from 'immutable';
import { Action, Actor, IMap, QL, Store } from '../index';
import { QueryLang } from '../ql';

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

////////////////////////QueryLang///////////////////////////
const todoQL = QL('todoQL', [
  'todo',
  'filter',
  //过滤数据
  todo => todo
]);

const countQL = QL('countQL', [
  todoQL,

  //支持nested
  todo => todo.count()
]);

////////////////////////Test suite///////////////////////////

describe('bigquery test suite', () => {
  it('countQL', () => {
    const store = new AppStore();
    let count = store.bigQuery(countQL as QueryLang);
    expect(count).toEqual(0);

    store.add('hello');
    count = store.bigQuery(countQL as QueryLang);
    expect(count).toEqual(1);

    const filter = store.bigQuery('filter');
    expect(filter).toEqual('');

    const first = store.bigQuery(['todo', 0]);
    expect(first.toJS()).toEqual({
      id: 1,
      text: 'hello',
      done: false
    });
  });
});
