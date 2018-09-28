import { Actor, Relax, Store, StoreProvider } from 'plume2';
import React from 'react';
import ReactDOM from 'react-dom';

class HelloActor extends Actor {
  defaultState() {
    return {
      mott: 'Build tools for human'
    };
  }
}

class AppStore extends Store {
  bindActor() {
    return [HelloActor];
  }
}

@Relax
class Mott extends React.Component {
  props: {
    relaxProps?: {
      mott: string;
    };
  };
  static relaxProps = ['mott'];

  render() {
    return <div>{this.props.relaxProps.mott}</div>;
  }
}

@StoreProvider(AppStore, { debug: true })
class HelloApp extends React.Component {
  render() {
    return <Mott />;
  }
}

ReactDOM.render(<HelloApp />, document.getElementById('app'));
