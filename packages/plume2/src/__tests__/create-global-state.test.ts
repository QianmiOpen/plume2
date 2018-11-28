import { fromJS } from 'immutable';
import { MockConsole } from 'mock-jest-console';
import { Action, Actor, createGlobalState, IMap, QL, RL, Store } from '..';

jest.mock('raf', () => jest.fn(cb => cb()));

const { getter, setter } = createGlobalState({
  hello: 'hello global state'
});

const helloQL = QL('helloQL', ['hello', hello => hello]);
const helloRL = RL('helloRL', [
  helloQL,
  hello => {
    setter({ hello });
  }
]);

class HelloActor extends Actor {
  defaultState() {
    return { hello: 'hello' };
  }

  @Action('globalState')
  globalStateChange(state: IMap, param) {
    return state.merge(param);
  }

  @Action('change')
  ChannelMergerNode(state: IMap, param) {
    return state.set('hello', param);
  }
}

class ShoppingCartStore extends Store {
  bindActor() {
    return [HelloActor];
  }

  bindRx() {
    return {
      helloRL
    };
  }

  bindGlobalState() {
    getter(state => {
      this.dispatch('globalState', state);
    });
  }
}

class ProductListStore extends Store {
  bindActor() {
    return [HelloActor];
  }

  bindGlobalState() {
    getter(state => this.dispatch('globalState', state));
  }
}

it('test merge global state', () => {
  const store = new ShoppingCartStore();
  const state = store.state();
  expect(state.toJS()).toEqual({ hello: 'hello global state' });
});

it('test setGlobalState callback', () => {
  const store = new ShoppingCartStore();
  setter(state => state.set('hello', 'I was changed by set global state'));
  expect(store.state().toJS()).toEqual({
    hello: 'I was changed by set global state'
  });
});

it('test setGlobalState value', () => {
  const store = new ShoppingCartStore();
  setter(
    fromJS({
      hello: 'I was changed by set global state'
    })
  );
  expect(store.state().toJS()).toEqual({
    hello: 'I was changed by set global state'
  });
});

it('multiple store', () => {
  //reset
  setter(fromJS({ hello: 'hello global state' }));

  const shoppinCartStore = new ShoppingCartStore();
  const productListStore = new ProductListStore();

  expect(shoppinCartStore.state().toJS()).toEqual({
    hello: 'hello global state'
  });
  expect(productListStore.state().toJS()).toEqual({
    hello: 'hello global state'
  });
});

it('multiple store complex secene', () => {
  const mock = new MockConsole();
  setter(fromJS({ hello: 'hello global state' }));
  const shoppinCartStore = new ShoppingCartStore({ debug: true });
  const productListStore = new ProductListStore({ debug: true });
  expect(shoppinCartStore.state().toJS()).toEqual({
    hello: 'hello global state'
  });
  expect(productListStore.state().toJS()).toEqual({
    hello: 'hello global state'
  });

  shoppinCartStore.dispatch('change', 'multiple store complex secene');

  expect(shoppinCartStore.state().toJS()).toEqual({
    hello: 'multiple store complex secene'
  });
  expect(productListStore.state().toJS()).toEqual({
    hello: 'multiple store complex secene'
  });

  expect(mock.logs).toMatchSnapshot();
});
