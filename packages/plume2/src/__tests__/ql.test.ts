import { Actor, Store } from '../index';
import { QL, QueryLang } from '../ql';

class LoadingActor extends Actor {
  defaultState() {
    return { loading: true };
  }
}

class TodoActor extends Actor {
  defaultState() {
    return { todo: [{ id: 1, text: 'hello plume', done: false }] };
  }
}

class AppStore extends Store {
  bindActor() {
    return [new LoadingActor(), new TodoActor()];
  }
}

describe('ql test suite', () => {
  it('init ql state', () => {
    const helloQL = QL('helloQL', [
      'loading',
      /**
       *
       */
      loading => loading
    ]) as QueryLang;

    expect(helloQL.id()).toEqual(1);
    expect(helloQL.name()).toEqual('helloQL');
    expect(helloQL.lang()).toMatchSnapshot();
  });

  it('test bigQuery', () => {
    const todoQL = QL('todoQL', [
      'loading',
      ['todo', 0, 'text'],
      (loading, text) => ({
        loading,
        text
      })
    ]) as QueryLang;

    const store = new AppStore({});
    const todo = store.bigQuery(todoQL);

    expect(todo).toEqual({
      loading: true,
      text: 'hello plume'
    });
  });

  it('test complex bigQuery', () => {
    const loadingQL = QL('loadingQL', [
      'loading',
      loading => loading
    ]) as QueryLang;

    const todoQL = QL('todoQL', [
      loadingQL,
      ['todo', 0, 'text'],
      (loading, text) => ({
        loading,
        text
      })
    ]) as QueryLang;

    const store = new AppStore({});
    const loading = store.bigQuery(loadingQL);
    expect(loading).toEqual(true);

    const todo = store.bigQuery(todoQL);
    expect(todo).toEqual({ loading: true, text: 'hello plume' });

    //from cache
    const todoCache = store.bigQuery(todoQL);
    expect(todoCache).toEqual({ loading: true, text: 'hello plume' });
  });

  it('when path value is undefined', () => {
    const testQL = QL('testQL', ['a', a => 10]);
    const store = new AppStore();
    const result = store.bigQuery(testQL as QueryLang);

    expect(result).toEqual(10);
  });
});
