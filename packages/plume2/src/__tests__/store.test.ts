import { MockLog } from 'mock-console';
import { Action, Actor, IMap, Store } from '../index';

class HelloActor extends Actor {
  defaultState() {
    return { name: 'plume' };
  }

  @Action('change')
  change(state: IMap) {
    return state.set('name', 'plume++');
  }

  @Action('changeText')
  changeTexst(state: IMap, text) {
    return state.set('name', text);
  }
}

class LoadingActor extends Actor {
  defaultState() {
    return { loading: false };
  }

  @Action('change')
  change(state: IMap) {
    return state.set('loading', true);
  }
}

class AppStore extends Store {
  bindActor() {
    return [
      //binding actor
      HelloActor,
      LoadingActor
    ];
  }

  change = () => {
    this.dispatch('change');
  };

  changeTransation() {
    this.transaction(() => {
      this.dispatch('changeText', 'iflux2');
      this.dispatch('changeText', 'plume');
      this.dispatch('changeText', 'plume2');
    });
  }
}

describe('store test suite', () => {
  it('default state', () => {
    const store = new AppStore() as any;

    //defautlState
    expect(store.state().toJS()).toEqual({
      loading: false,
      name: 'plume'
    });

    //actors
    expect(store._actors.length).toEqual(2);

    //actor'state
    const actorState = store._actorsState;
    expect([actorState[0].toJS(), actorState[1].toJS()]).toEqual([
      { name: 'plume' },
      { loading: false }
    ]);
  });

  it('store dispatch', () => {
    const store = new AppStore() as any;
    store.change();

    const storeState = store.state();
    expect(storeState.toJS()).toEqual({ loading: true, name: 'plume++' });

    const actorsState = store._actorsState;
    expect([actorsState[0].toJS(), actorsState[1].toJS()]).toEqual([
      { name: 'plume++' },
      { loading: true }
    ]);
  });

  it('store transation disptch', () => {
    const store = new AppStore();
    store.changeTransation();
    store.subscribe(state => {
      expect(state.toJS()).toEqual({
        loading: false,
        name: 'plume2'
      });
    });
  });

  it('store subscribe', () => {
    const store = new AppStore({}) as any;
    //@ts-ignore
    const _handleStoreChange = (state: IMap) => {
      expect(store.state()).toEqual({ loading: true, name: 'plume++' });
    };

    store.subscribe(_handleStoreChange);
    expect(store._callbacks.length).toEqual(1);

    store.unsubscribe(_handleStoreChange);
    expect(store._callbacks.length).toEqual(0);
  });

  it('dispatch false', () => {
    class LoadingActor extends Actor {
      defaultState() {
        return { loading: true };
      }

      @Action('loading:end')
      end(state: IMap, status: boolean) {
        return state.set('loading', status);
      }
    }

    class AppStore extends Store {
      bindActor() {
        return [LoadingActor];
      }
    }

    const mock = new MockLog();
    const store = new AppStore({ debug: true });
    store.dispatch('loading:end', false);

    expect(store.state().toJS()).toEqual({
      loading: false
    });

    expect(mock.logs).toMatchSnapshot();
  });
});
