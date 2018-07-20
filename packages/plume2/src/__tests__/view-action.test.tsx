import React from 'react';
import renderer from 'react-test-renderer';
import {
  Action,
  Actor,
  IMap,
  Relax,
  Store,
  StoreProvider,
  ViewAction
} from '../index';
import { TViewAction } from '../typing';

// ===========build ViewAction============
class HelloViewAction extends ViewAction {
  sayHello = () => {
    this.store.dispatch('hello', 'hello');
  };
}

class WorldViewAction extends ViewAction {
  sayWorld = () => {
    this.store.dispatch('world', 'world');
  };
}

//===========export viewAction=============
const viewAction = {
  HelloViewAction,
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

@Relax
class HelloRelax extends React.Component {
  props: {
    relaxProps?: {
      hello: string;
      world: string;
      viewAction: TViewAction<typeof viewAction>;
    };
  };

  static relaxProps = {
    hello: 'hello',
    world: 'world',
    viewAction: 'viewAction'
  };

  render() {
    const { hello, world, viewAction } = this.props.relaxProps;
    expect(Object.keys(viewAction)).toEqual([
      'HelloViewAction',
      'WorldViewAction'
    ]);

    return (
      <div>
        <div>{hello}</div>
        <div>{world}</div>
      </div>
    );
  }
}

@StoreProvider(AppStore, { debug: true })
class HelloApp extends React.Component {
  render() {
    return <HelloRelax />;
  }
}

describe('viewAction test suite', () => {
  it('test viewAction', () => {
    const store = new AppStore();
    store.viewAction.HelloViewAction.sayHello();
    expect(store.get('hello')).toEqual('hello');
    store.viewAction.WorldViewAction.sayWorld();
    expect(store.get('world')).toEqual('world');
  });

  it('test relax inject viewAction', () => {
    const component = renderer.create(<HelloApp />);
    expect(component.toJSON()).toMatchSnapshot();
    const store = window['_plume2App'].HelloApp.store as AppStore;
    store.viewAction.HelloViewAction.sayHello();
    store.viewAction.WorldViewAction.sayWorld();
    expect(component.toJSON()).toMatchSnapshot();
  });
});
