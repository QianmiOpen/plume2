import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { Actor, Store, StoreProvider } from '../index';
import { Action } from '../decorator';

class HelloActor extends Actor {
  defaultState() {
    return { name: 'plume' };
  }

  @Action('change')
  change(state) {
    return state.set('name', 'plume++');
  }
}

class AppStore extends Store {
  constructor(props) {
    super(props);
    window['_store'] = this;
  }

  bindActor() {
    return [new HelloActor()];
  }

  change = () => {
    this.dispatch('change');
  };
}

@StoreProvider(AppStore)
class Home extends React.Component {
  state: { name: string };

  render() {
    return <div>{this.state.name}</div>;
  }
}

describe('store provider test suite', () => {
  it('first render', () => {
    const tree = renderer.create(<Home />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('store dispath change render', () => {
    const component = renderer.create(<Home />);
    const store = window['_store'] as AppStore;
    store.change();
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('merge store state', () => {
    @StoreProvider(AppStore)
    class StateApp extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          text: 'merge store test'
        };
      }

      render() {
        expect(this.state).toEqual({
          text: 'merge store test',
          name: 'plume'
        });

        return <div />;
      }
    }

    const tree = renderer.create(<StateApp />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
