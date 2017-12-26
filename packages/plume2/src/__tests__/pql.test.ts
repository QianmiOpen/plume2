import { Actor, Store, QL } from '../index';
import { PQL } from '../pql';

class LoadingActor extends Actor {
  defaultState() {
    return { loading: false };
  }
}

class TodoActor extends Actor {
  defaultState() {
    return {
      todo: [{ id: 1, text: 'hello plume', done: false }]
    };
  }
}

class AppStore extends Store {
  bindActor() {
    return [new LoadingActor(), new TodoActor()];
  }
}

describe('dql test suite', () => {
  it('todoDQL', () => {
    const store = new AppStore();

    //ql
    const loadingQL = QL('loadingQL', ['loading', loading => loading]);

    //pql
    const todoPQL = PQL(index =>
      QL('todoQL', [
        loadingQL,
        ['todo', index, 'text'],
        (loading, text) => ({
          loading,
          text
        })
      ])
    );

    const fn = todoPQL.partialQL(store.bigQuery);

    expect(fn(0)).toEqual({
      loading: false,
      text: 'hello plume'
    });
  });
});
