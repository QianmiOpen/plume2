import React from 'react';
import renderer from 'react-test-renderer';
import { Action, Actor, QL, Relax, Store, StoreProvider } from '../index';
import { PQL } from '../pql';
import { isRxRelaxProps } from '../relax';

//===============Actor=========================
class LoadingActor extends Actor {
  defaultState() {
    return {
      loading: false
    };
  }
}

class HelloActor extends Actor {
  defaultState() {
    return { mott: 'hello world!' };
  }

  @Action('change')
  change(state, text) {
    return state.set('mott', text);
  }
}

//===================Store======================
class AppStore extends Store {
  constructor(props) {
    super(props);
    window['_store'] = this;
  }

  bindActor() {
    return [new LoadingActor(), new HelloActor()];
  }
}

//========================UI======================
@StoreProvider(AppStore, { debug: true })
class HelloApp extends React.Component {
  render() {
    return <HelloRelax />;
  }
}

const loadingQL = QL('loadingQL', ['loading', loading => loading]);

const mottQL = QL('mottQL', [
  loadingQL,
  'mott',
  (loading, mott) => ({ loading, mott })
]);

const loadingPQL = PQL(mottFlag => QL('loadingPQL', [mottFlag, mott => mott]));

@Relax
class HelloRelax extends React.Component {
  props: {
    mottFlag?: string;
    relaxProps?: {
      loading: boolean;
      mott: string;
      loadingQL: boolean;
      mottQL: { loading: boolean; mott: string };
      loadingPQL: (mott: string) => string;
    };
  };

  static relaxProps = {
    loading: 'loading',
    mott: 'mott',
    loadingQL,
    mottQL,
    loadingPQL
  };

  render() {
    const {
      loading,
      mott,
      loadingQL,
      mottQL,
      loadingPQL
    } = this.props.relaxProps;

    expect(false).toEqual(loadingQL);
    expect({ loading: false, mott: 'hello world!' }).toEqual(mottQL);
    expect('hello world!').toEqual(loadingPQL('mott'));

    return (
      <div>
        <div>{loading}</div>
        <div>{mott}</div>
      </div>
    );
  }
}

describe('relax test suite', () => {
  it('initial render relax', () => {
    const tree = renderer.create(<HelloApp />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('dispatch event', () => {
    @StoreProvider(AppStore)
    class HelloApp extends React.Component {
      render() {
        return <Hello />;
      }
    }

    @Relax
    class Hello extends React.Component {
      props: { relaxProps?: { mott: string } };

      static relaxProps = {
        mott: 'mott'
      };

      render() {
        return (
          <div>
            <div>{this.props.relaxProps.mott}</div>
          </div>
        );
      }
    }

    const component = renderer.create(<HelloApp />);
    const store = window['_store'] as AppStore;
    store.dispatch('change', 'hello plume');
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('no relax-props warnning', () => {
    @StoreProvider(AppStore)
    class WarnApp extends React.Component {
      render() {
        return <RelaxTest />;
      }
    }

    @Relax
    class RelaxTest extends React.Component {
      render() {
        return <div />;
      }
    }

    renderer.create(<WarnApp />).toJSON();
  });
});

it('test relaxProps is not need rx', () => {
  expect(isRxRelaxProps({ hello: 'hello' })).toEqual(true);

  expect(
    isRxRelaxProps({
      hello: ['state', 'hello']
    })
  ).toEqual(true);

  expect(isRxRelaxProps({ ql: loadingQL })).toEqual(true);

  expect(
    isRxRelaxProps({
      viewAction: 'viewAction'
    })
  ).toEqual(false);

  expect(
    isRxRelaxProps({
      fn: () => {}
    })
  ).toEqual(false);

  expect(
    isRxRelaxProps({
      pql: loadingPQL
    })
  ).toEqual(false);
});
