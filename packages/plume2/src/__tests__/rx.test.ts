import { fromJS } from 'immutable';
import { MockConsole, MockLog } from 'mock-jest-console';
import { Action, Actor, IMap, QL, RL, Store } from '../index';

class HelloActor extends Actor {
  defaultState() {
    return { mott: 'plume2' };
  }

  @Action('change')
  change(state: IMap) {
    return state.set('mott', 'Build tools for human');
  }
}

const helloQL = QL('helloQL', ['mott', mott => mott]);

const helloRL = RL('helloRL', [
  'mott',
  helloQL,
  (mott, mottQL) => {
    //side-effect
    //webapi.update();
    expect(mott).toEqual('Build tools for human');
    expect(mottQL).toEqual('Build tools for human');
  }
]);

class AppStore extends Store {
  bindActor() {
    return [HelloActor];
  }

  bindRx() {
    return { helloRL };
  }
}

describe('reactive rx test suite', () => {
  it('test helloRl', () => {
    const mockLog = new MockLog();
    new AppStore({
      debug: true
    });
    expect(mockLog.logs).toMatchSnapshot();
  });

  it('test helloRL dispatch one time', () => {
    const mockLog = new MockLog();
    const store = new AppStore({
      debug: true
    });
    store.dispatch('change');
    expect(mockLog.logs).toMatchSnapshot();
  });

  it('test helloRL dispatch second time', () => {
    const mockLog = new MockLog();
    const store = new AppStore({
      debug: true
    });
    store.dispatch('change');
    store.dispatch('change');
    expect(mockLog.logs).toMatchSnapshot();
  });

  it('test helloRL dispatch transaction', () => {
    const mockConsole = new MockConsole();
    const store = new AppStore({ debug: true });
    store.transaction(() => {
      store.dispatch('change');
      store.dispatch('change');
      store.dispatch(
        'c',
        fromJS({
          id: 1,
          name: 'plume2',
          addr: {
            province: 'jiangsu',
            city: 'nanjing'
          }
        })
      );
    });
    expect(mockConsole.logs).toMatchSnapshot();
  });
});
