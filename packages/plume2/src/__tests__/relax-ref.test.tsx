import { MockLog } from 'mock-jest-console';
import React from 'react';
import renderer from 'react-test-renderer';
import { Actor, Relax, Store, StoreProvider } from '../';

class HelloActor extends Actor {
  defaultState() {
    return {
      hello: 'hello'
    };
  }
}

class AppStore extends Store {
  bindActor() {
    return [HelloActor];
  }
}

@StoreProvider(AppStore, { debug: true })
class TestApp extends React.Component {
  _text: any;

  componentDidMount() {
    expect(this._text._relaxProxy.props.relaxProps).toEqual({
      hello: 'hello'
    });
  }

  render() {
    return <Text ref={text => (this._text = text)} />;
  }
}

@Relax
class Text extends React.Component {
  props: {
    relaxProps?: {
      hello: string;
    };
  };

  static relaxProps = ['hello'];

  render() {
    return <div>{this.props.relaxProps.hello}</div>;
  }
}

it('test relax proxy ref', () => {
  const mockLog = new MockLog();
  const tree = renderer.create(<TestApp />).toJSON();
  expect(tree).toMatchSnapshot();
  expect(mockLog.logs).toMatchSnapshot();
});
