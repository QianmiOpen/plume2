import { MockConsole } from 'mock-console';
import { Action, Actor, IMap, Store } from '../index';

class HelloActor extends Actor {
  defaultState() {
    return { text: 'hello' };
  }

  @Action('change')
  //@ts-ignore
  change(state: IMap, text) {
    throw new Error('change exception');
    // return state.set('text', text);
  }
}

class LoadingActor extends Actor {
  defaultState() {
    return { loading: false };
  }

  @Action('loading:end')
  change(state: IMap) {
    return state.update('loading', loading => !loading);
  }
}

class AppStore extends Store {
  bindActor() {
    return [new LoadingActor(), new HelloActor()];
  }

  rollBack = () => {
    const isRollback = this.transaction(() => {
      this.dispatch('loading:end');
      this.dispatch('change', 'hello iflux2');
    });

    expect(isRollback).toEqual(true);
  };

  customRollBack = () => {
    const currentState = this.state();
    const isRollback = this.transaction(
      () => {
        this.dispatch('loading:end');
        this.dispatch('change', 'hello iflux2');
      },
      () => {
        expect(currentState != this.state()).toEqual(true);
        this.setState(currentState);
      }
    );

    expect(isRollback).toEqual(true);
  };

  change = () => {
    this.transaction(() => {
      try {
        this.dispatch('loading:end');
        this.dispatch('change', 'hello iflux2');
      } catch (err) {
        expect(err).toEqual(new Error('change exception'));
      }
    });
  };
}

describe('test store transaction fail rollback', () => {
  it('test rollback', () => {
    const store = new AppStore();
    const state = store.state();
    store.rollBack();
    expect(store.state()).toEqual(state);
  });

  it('test customRollBack', () => {
    const store = new AppStore({});
    const state = store.state();
    store.customRollBack();
    expect(store.state()).toEqual(state);
  });

  it('test without rollback', () => {
    const mock = new MockConsole();
    const store = new AppStore({ debug: true });
    const state = store.state();
    store.change();
    expect(store.state() == state).toEqual(false);
    expect(mock.logs).toEqual([]);
  });
});
