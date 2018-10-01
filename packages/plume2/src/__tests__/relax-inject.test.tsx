import { MockLog, MockWarn } from 'mock-jest-console';
import React from 'react';
import renderer from 'react-test-renderer';
import { Actor, QL, Relax, Store, StoreProvider } from '../';

it('could not inject value from store', () => {
  class HelloActor extends Actor {
    defaultState() {
      return {
        mott: 'build tools for hunman'
      };
    }
  }

  class AppStore extends Store {
    bindActor() {
      return [HelloActor];
    }
  }

  const helloQL = QL('helloQL', ['hello', hello => hello]);

  @Relax
  class Mott extends React.Component {
    props: {
      relaxProps?: {
        hello: string;
      };
    };
    static relaxProps = [
      'hello',
      {
        helloQL
      }
    ];
    render() {
      return <div>{this.props.relaxProps.hello}</div>;
    }
  }

  @StoreProvider(AppStore, { debug: true })
  class TestApp extends React.Component {
    render() {
      return <Mott />;
    }
  }
  const mockLogs = new MockLog();
  const mockWarn = new MockWarn();
  const tree = renderer.create(<TestApp />);
  expect(tree).toMatchSnapshot();
  expect(mockLogs.logs).toMatchSnapshot();
  expect(mockWarn.logs).toMatchSnapshot();
});
