import { Action, Actor, IMap, Store, ViewAction } from '../index';

// ===========build ViewAction============
class HelloViewAciton extends ViewAction {
  sayHello = () => {
    this.store.dispatch('hello', 'hello');
  };
}

class WorldViewAction extends ViewAction {
  sayWorld = () => {
    this.store.dispatch('world', 'world');
  };
}

const viewAction = {
  HelloViewAciton,
  WorldViewAction
};

//==============build Actor==============
class HelloWorldActor extends Actor {
  defaultState() {
    return {
      hello: '',
      world: ''
    };
  }

  @Action('hello')
  hello(state, msg: string) {
    return state.set('hello', msg);
  }

  @Action('world')
  world(state: IMap, msg: string) {
    return state.set('world', msg);
  }
}

//===============AppStore==================
class AppStore extends Store<typeof viewAction> {
  bindActor() {
    return [new HelloWorldActor()];
  }

  bindViewAction(): any {
    return viewAction;
  }
}

it('test viewAction', () => {
  const store = new AppStore();
  store.viewAction.HelloViewAciton.sayHello();
  expect(store.get('hello')).toEqual('hello');
  store.viewAction.WorldViewAction.sayWorld();
  expect(store.get('world')).toEqual('world');
});
