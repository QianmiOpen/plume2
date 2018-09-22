import { MockLog } from 'mock-console';
import React from 'react';
import renderer from 'react-test-renderer';
import { Actor, Store, StoreProvider } from '../index';

class LoadingActor extends Actor {
  defaultState() {
    return {
      loading: true
    };
  }
}

class HelloActor extends Actor {
  defaultState() {
    return {
      hello: 'hello'
    };
  }
}

class AppStore extends Store {
  bindActor() {
    return [new LoadingActor(), new HelloActor()];
  }
}

@StoreProvider(AppStore, { debug: true })
class DebugApp extends React.Component {
  render() {
    return <div>hello world</div>;
  }
}

it('test debug window app', () => {
  const mockLogs = new MockLog();
  const tree = renderer.create(<DebugApp />).toJSON();
  expect(tree).toMatchSnapshot();
  expect(window['_plume2App'].DebugApp != null).toEqual(true);
  expect(window['_plume2App'].DebugApp.store instanceof AppStore).toEqual(true);
  expect(mockLogs.logs).toMatchSnapshot();
});
