import { fromJS } from 'immutable';
import { MockConsole } from 'mock-jest-console';
import { Action, Actor, IMap, Store } from '../index';

class HelloActor extends Actor {
  defaultState() {
    return {
      hello: 'hello'
    };
  }

  @Action('hello')
  hello(state: IMap, text: string) {
    return state.set('hello', text);
  }
}

class LoadingActor extends Actor {
  defaultState() {
    return {
      loading: true
    };
  }

  @Action('loading')
  loading(state: IMap, status) {
    return state.set('loading', status);
  }
}

class AppStore extends Store {
  bindActor() {
    return [HelloActor, LoadingActor];
  }
}

it('test init time-travel', () => {
  const mock = new MockConsole();
  const store = new AppStore({
    debug: true
  });
  store.dispatch('loading', false);
  store.dispatch('hello', 'hello plume2');
  store.transaction(() => {
    store.dispatch('loading', true);
    store.dispatch('hello', 'hello plume2 world');
  });
  store.dispatch('loading', false);

  expect(store.state().toJS()).toEqual({
    hello: 'hello plume2 world',
    loading: false
  });

  (store as any)._state = fromJS({});
  const timeTravel = store.timeTravel;
  timeTravel.replay();

  expect(store.state().toJS()).toEqual({
    hello: 'hello plume2 world',
    loading: false
  });

  timeTravel.back();
  expect(store.state().toJS()).toEqual({
    hello: 'hello plume2 world',
    loading: true
  });

  timeTravel.back();
  expect(store.state().toJS()).toEqual({
    hello: 'hello plume2',
    loading: false
  });

  timeTravel.back();
  expect(store.state().toJS()).toEqual({
    hello: 'hello',
    loading: false
  });

  timeTravel.next();
  expect(store.state().toJS()).toEqual({
    hello: 'hello plume2',
    loading: false
  });

  timeTravel.next();
  expect(store.state().toJS()).toEqual({
    hello: 'hello plume2 world',
    loading: true
  });
  expect(mock.logs).toMatchSnapshot();
});
